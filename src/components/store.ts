import { create } from 'zustand';
import {
  Connection,
  Edge,
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
import Dagre, { layout } from '@dagrejs/dagre';
import { v4 as uuid } from 'uuid';
import { dagreLayout, basicLayout } from './layout';

import { LoomNode, NodeGraphData, SavedLoomNode, ModelSettings } from "./types";
import { createLoomNode, fromSavedTree, getSubTree } from "./loomNode"
import { DEFAULT_NODE_TEXT, DEBUG_MODEL } from "./constants"

export type RFState = {
  loomNodes: LoomNode[];
  nodes: Node<NodeGraphData>[];
  edges: Edge[];
  dagreGraph: Dagre.graphlib.Graph;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  spawnChildren: (nodeId: string, version: number) => Node[];
  layoutDagre: () => void;
  focusedNodeId: string;
  setFocusedNodeId: (nodeId: string) => void;
  focusedNodeVersion: number | null;
  setFocusedNodeVersion: (version: number) => void;
  initFromSaveFile: (loomNodes: SavedLoomNode[]) => void;
  deleteNode: (nodeId: string) => void;
  modelsSettings: ModelSettings[];
  setModelsSettings: (modelsSettings: ModelSettings[]) => void;
  activeModelIndex: number;
  setActiveModelIndex: (index: number) => void;
};

const initialEdges: Edge[] = [];

function getNodeId() {
  return uuid();
}
function getEdgeId() {
  return uuid();
}

const defaultLoomNode: LoomNode = createLoomNode(getNodeId(), DEFAULT_NODE_TEXT, undefined, true);

const defaultNodes: Node<NodeGraphData>[] = [
  {
    id: defaultLoomNode.id,
    type: "custom",
    data: {
      loomNode: defaultLoomNode,
      focusNode: () => useStore.getState().setFocusedNodeId("0"),
      invisible: true
    },
    position: { x: 0, y: 0 }
  }
]


const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const new_child_nodes = 3;
// this is our useStore hook that we can use in our components to get parts of the store and call actions

function initGraphNodesFromLoomNodes(loomNodes: LoomNode[]): Node<NodeGraphData>[] {
  const graphNodes = loomNodes.map(loomNode => {
    return {
      id: loomNode.id,
      type: "custom",
      data: {
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
  loomNodes: [defaultLoomNode],
  nodes: defaultNodes,
  edges: initialEdges,
  dagreGraph: g,
  viewPort: { x: 0, y: 0, zoom: 1 },
  focusedNodeId: defaultLoomNode.id,
  focusedNodeVersion: 0,
  modelsSettings: [DEBUG_MODEL],
  activeModelIndex: 0,
  onNodesChange: (changes: NodeChange[]) => {
    const filteredChanges = changes.filter((change) => change.type !== "select");
    set({
      nodes: applyNodeChanges(filteredChanges, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    const filteredChanges = changes.filter((change) => change.type !== "select" && change.type !== "remove");
    set({
      edges: applyEdgeChanges(filteredChanges, get().edges),
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
    // set new nodes to be invisible
    layoutedNodes.forEach(node => {
      if (node.id !== nodeId) {
        node.data.invisible = true;
      }
    });
    layoutedEdges.forEach(edge => {
      edge.hidden = true;
    });
    set({ nodes: layoutedNodes });
    set({ edges: layoutedEdges });
    set({ loomNodes: get().loomNodes.concat(newLoomNodes) });
    return formattedNew;
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
    const loomNodes = fromSavedTree(savedNodes);
    const graphNodes = initGraphNodesFromLoomNodes(loomNodes);
    const edges = initEdgesFromGraphNodes(graphNodes);
    const { nodes: layoutedNodes, edges: layoutedEdges } = dagreLayout(
      get().dagreGraph,
      graphNodes,
      edges,
      { direction: "TB" }
    );
    // set nodes and edges to be invisible
    layoutedNodes.forEach(node => {
      node.data.invisible = true;
    });
    layoutedEdges.forEach(edge => {
      edge.hidden = true;
    });
    set({ loomNodes: loomNodes });
    set({ nodes: layoutedNodes });
    set({ edges: layoutedEdges });
    set({ focusedNodeId: loomNodes[0].id });
    set({ focusedNodeVersion: null });
  },
  deleteNode: (nodeId: string) => {
    // remove node and all children from loomNodes
    let loomNodes = get().loomNodes;
    let node = loomNodes.find(loomNode => loomNode.id === nodeId);
    if (node) {
      if (node.parent == null) {
        return
      }
      let parent = node.parent.loomNode;
      parent.children = parent.children.filter(child => child.id !== nodeId);
      let nodes = get().nodes;
      let edges = get().edges;
      let subTree = getSubTree(node);
      let nodeIds = subTree.map(node => node.id);
      let newLoomNodes = loomNodes.filter(loomNode => !nodeIds.includes(loomNode.id));
      let newNodes = nodes.filter(node => !nodeIds.includes(node.id));
      let newEdges = edges.filter(edge => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target));
      set({ loomNodes: newLoomNodes });
      set({ nodes: newNodes });
      set({ edges: newEdges });
      set({ focusedNodeId: parent.id });
    }
  },
  setModelsSettings: (modelsSettings: ModelSettings[]) => {
    set({ modelsSettings });
  },
  setActiveModelIndex: (index: number) => {
    set({ activeModelIndex: index });
  }
}));

export default useStore;
