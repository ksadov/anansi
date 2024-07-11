import { create } from 'zustand';
import {
  Connection,
  Edge,
  Viewport,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import Dagre from '@dagrejs/dagre';
import { dagreLayout, basicLayout } from './layout';

import { LoomNode, NodeGraphData, SavedLoomNode } from "./types";
import { createLoomNode, nodeToJson, fromSaveFile } from "./loomNode"

export type RFState = {
  loomNodes: LoomNode[];
  nodes: Node<NodeGraphData>[];
  edges: Edge[];
  viewPort: Viewport;
  dagreGraph: Dagre.graphlib.Graph;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewPort: (viewPort: Viewport) => void;
  spawnChildren: (nodeId: string, version: number) => void;
  layoutDagre: () => void;
  focusedNodeId: string;
  setFocusedNodeId: (nodeId: string) => void;
  focusedNodeVersion: number | null;
  setFocusedNodeVersion: (version: number) => void;
  initFromSaveFile: (loomNodes: SavedLoomNode[]) => void;
};

const initialLoomNode: LoomNode = createLoomNode("0", "Node 0", undefined, true);

const initialNodes: Node<NodeGraphData>[] = [
  {
    id: "0",
    type: "custom",
    data: {
      label: "Node 0",
      loomNode: initialLoomNode,
      focusNode: () => useStore.getState().setFocusedNodeId("0")
    },
    position: { x: 0, y: 0 }
  }
]

const initialEdges: Edge[] = [];

var node_id = 0;
var edge_id = 0;
const getNodeId = () => { node_id++; return node_id.toString() };
const getEdgeId = () => { edge_id++; return edge_id.toString() };

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const new_child_nodes = 3;
// this is our useStore hook that we can use in our components to get parts of the store and call actions

function initGraphNodesFromLoomNodes(loomNodes: LoomNode[]): Node<NodeGraphData>[] {
  const graphNodes = loomNodes.map(loomNode => {
    return {
      id: loomNode.id,
      type: "custom",
      data: {
        label: loomNode.latestText,
        loomNode: loomNode,
        focusNode: () => { useStore.getState().setFocusedNodeId(loomNode.id) }
      },
      position: { x: 0, y: 0 }
    }
  })
  return graphNodes;
}

function initEdgesFromGraphNodes(nodes: Node<NodeGraphData>[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const parentId = nodes[i].data.loomNode.parent?.loomNode.id;
    if (parentId) {
      edges.push({
        id: getEdgeId(),
        source: parentId,
        target: nodes[i].id
      });
    }
  }
  return edges;
}

const useStore = create<RFState>((set, get) => ({
  loomNodes: [initialLoomNode],
  nodes: initialNodes,
  edges: initialEdges,
  dagreGraph: g,
  viewPort: { x: 0, y: 0, zoom: 1 },
  focusedNodeId: "0",
  focusedNodeVersion: 0,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  setNodes: (nodes: Node[]) => {
    set({ nodes });
  },
  setEdges: (edges: Edge[]) => {
    set({ edges });
  },
  setViewPort: (viewPort: Viewport) => {
    set({ viewPort });
  },
  spawnChildren: (nodeId: string, version: number) => {
    let nodes = get().nodes;
    let edges = get().edges;
    let newLoomNodes: LoomNode[] = [];
    let new_nodes: Node[] = [];
    let new_edges: Edge[] = [];
    for (let i = 0; i < new_child_nodes; i++) {
      let new_node_id = getNodeId();
      let parentNode = get().loomNodes.find(loomNode => loomNode.id === nodeId);
      let parentDict = parentNode ? { loomNode: parentNode, version: version } : undefined;
      let newLoomNode = createLoomNode(
        new_node_id,
        `This is custom node ${new_node_id}`,
        parentDict
      )
      // update parent node
      let parent_node = get().loomNodes.find(loomNode => loomNode.id === nodeId);
      if (parent_node) {
        parent_node.children.push(newLoomNode);
      }
      newLoomNodes.push(newLoomNode);
      new_nodes.push({
        id: new_node_id,
        type: "custom",
        data: {
          label: `Node ${new_node_id}`,
          loomNode: newLoomNode,
          focusNode: () => useStore.getState().setFocusedNodeId(new_node_id)
        },
        position: { x: 0, y: 0 }
      });
      new_edges.push({
        id: getEdgeId(),
        source: nodeId,
        target: new_nodes[i].id
      });
    }
    // layout nodes and edges
    const parent_node = nodes.find(node => node.id === nodeId);
    const parent_x = parent_node ? parent_node.position.x ?? 0 : 0;
    const parent_y = parent_node ? parent_node.position.y ?? 0 : 0;
    const existing_children = (nodes.filter(node => edges.some(edge => edge.source === nodeId && edge.target === node.id))).length;
    const formattedNew = basicLayout(
      new_nodes,
      existing_children,
      parent_x,
      parent_y
    );
    let layoutedNodes = nodes.concat(formattedNew);
    let layoutedEdges = edges.concat(new_edges);
    set({ nodes: layoutedNodes });
    set({ edges: layoutedEdges });
    set({ loomNodes: get().loomNodes.concat(newLoomNodes) });
  },
  layoutDagre: () => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = dagreLayout(
      get().dagreGraph,
      nodes,
      edges,
      { direction: "TB" }
    );
    set({ nodes: layoutedNodes });
    set({ edges: layoutedEdges });
    set({ viewPort: { x: 0, y: 0, zoom: 1 } });
  },
  setFocusedNodeId: (nodeId: string, version?: number) => {
    set({ focusedNodeId: nodeId });
    if (version !== undefined) {
      set({ focusedNodeVersion: version });
    }
    else {
      set({ focusedNodeVersion: null });
    }
  },
  setFocusedNodeVersion: (version: number) => {
    set({ focusedNodeVersion: version });
  },
  initFromSaveFile: (savedNodes: SavedLoomNode[]) => {
    const loomNodes = fromSaveFile(savedNodes);
    const graphNodes = initGraphNodesFromLoomNodes(loomNodes);
    const edges = initEdgesFromGraphNodes(graphNodes);
    const { nodes: layoutedNodes, edges: layoutedEdges } = dagreLayout(
      get().dagreGraph,
      graphNodes,
      edges,
      { direction: "TB" }
    );
    set({ loomNodes: loomNodes });
    set({ nodes: layoutedNodes });
    set({ edges: layoutedEdges });
    set({ focusedNodeId: loomNodes[0].id });
    set({ focusedNodeVersion: 0 });
  }
}));

export default useStore;
