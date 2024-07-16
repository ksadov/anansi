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
import Dagre from '@dagrejs/dagre';
import { v4 as uuid } from 'uuid';
import { DEFAULT_NODE_TEXT, DEFAULT_INIT_MODELS, MAX_HISTORY_SIZE } from "utils/ui/constants";
import { dagreLayout, basicLayout } from 'utils/ui/layout';
import { NodeGraphData, AppState, HistoryItem } from "utils/ui/types";
import { LoomNode, SavedLoomNode, ModelSettings, Generation } from "utils/logic/types";
import { createLoomNode, fromSavedTree, getSubTree, nodeToJson } from "utils/logic/loomNode";

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
  spawnChildren: (nodeId: string, version: number, generations: Generation[]) => Node[];
  layoutDagre: () => void;
  focusedNodeId: string;
  setFocusedNodeId: (nodeId: string) => void;
  focusedNodeVersion: number | null;
  setFocusedNodeVersion: (version: number) => void;
  initFromSavedTree: (savedLoomNodes: SavedLoomNode[]) => void;
  initFromSavedAppState: (appState: AppState) => void;
  deleteNode: (nodeId: string) => void;
  modelsSettings: ModelSettings[];
  setModelsSettings: (modelsSettings: ModelSettings[]) => void;
  activeModelIndex: number;
  setActiveModelIndex: (index: number) => void;
  createNewTreeSession: () => void;
  past: HistoryItem[];
  future: HistoryItem[];
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  setLegalFocusedNode: () => void;
};

const initialEdges: Edge[] = [];

function getNodeId() {
  return uuid();
}
function getEdgeId() {
  return uuid();
}

const defaultLoomNode: LoomNode = createLoomNode(getNodeId(), DEFAULT_NODE_TEXT, undefined, undefined, true);

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

export const disownedEdgeStyle = { strokeDasharray: "5,5" };

function disownEdges(edges: Edge[], loomNodes: LoomNode[]) {
  edges.map((edge) => {
    const sourceNode = loomNodes.find(loomNode => loomNode.id === edge.source);
    const sourceNodeVersion = sourceNode?.diffs.length;
    const parentVersion = sourceNode?.parent?.version;
    if (sourceNodeVersion !== parentVersion) {
      edge.style = disownedEdgeStyle;
    }
    return edge;
  });
}

// this is our useStore hook that we can use in our components to get parts of the store and call actions
const useStore = create<RFState>((set, get) => ({
  loomNodes: [defaultLoomNode],
  nodes: defaultNodes,
  edges: initialEdges,
  dagreGraph: g,
  viewPort: { x: 0, y: 0, zoom: 1 },
  focusedNodeId: defaultLoomNode.id,
  focusedNodeVersion: 0,
  modelsSettings: DEFAULT_INIT_MODELS,
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
  spawnChildren: (nodeId: string, version: number, generations: Generation[]) => {
    get().takeSnapshot();
    let nodes = get().nodes;
    let edges = get().edges;
    let newLoomNodes: LoomNode[] = [];
    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];
    let parentNode = get().loomNodes.find(loomNode => loomNode.id === nodeId);
    for (let i = 0; i < generations.length; i++) {
      let new_node_id = getNodeId();
      let parentDict = parentNode ? { loomNode: parentNode, version: version } : undefined;
      let newLoomNode: LoomNode = createLoomNode(
        new_node_id,
        generations[i].text,
        parentDict,
        generations[i],
      )
      // update parent node
      if (parentNode) {
        parentNode.children.push(newLoomNode);
      }
      newLoomNodes.push(newLoomNode);
      newNodes.push({
        id: new_node_id,
        type: "custom",
        data: {
          loomNode: newLoomNode,
          focusNode: () => useStore.getState().setFocusedNodeId(new_node_id)
        },
        position: { x: 0, y: 0 }
      });
      newEdges.push({
        id: getEdgeId(),
        source: nodeId,
        target: newNodes[i].id
      });
    }
    // layout nodes and edges
    const parent_node = nodes.find(node => node.id === nodeId);
    const parent_x = parent_node ? parent_node.position.x ?? 0 : 0;
    const parent_y = parent_node ? parent_node.position.y ?? 0 : 0;
    const existing_children = (nodes.filter(node => edges.some(
      edge => edge.source === nodeId && edge.target === node.id)
    )).length;
    const formattedNew = basicLayout(
      newNodes,
      existing_children,
      parent_x,
      parent_y
    );
    let layoutedNodes = nodes.concat(formattedNew);
    let layoutedEdges = edges.concat(newEdges);
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
  initFromSavedTree: (savedLoomNodes: SavedLoomNode[]) => {
    const loomNodes = fromSavedTree(savedLoomNodes);
    const graphNodes = initGraphNodesFromLoomNodes(loomNodes);
    const edges = initEdgesFromGraphNodes(graphNodes);
    disownEdges(edges, loomNodes);
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
    set({ focusedNodeVersion: loomNodes[0].diffs.length });
  },
  initFromSavedAppState: (appState: AppState) => {
    get().initFromSavedTree(appState.loomTree.loomTree);
    const modelsSettings = appState.modelsSettings;
    const activeModelIndex = appState.activeModelIndex;
    const focusedNodeVersion = appState.focusedNodeVersion;
    const focusedNodeId = appState.focusedNodeId;
    set({ modelsSettings });
    set({ activeModelIndex });
    set({ focusedNodeId });
    set({ focusedNodeVersion });
  },
  deleteNode: (nodeId: string) => {
    // take snapshot
    get().takeSnapshot();
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
  },
  createNewTreeSession: () => {
    set({ loomNodes: [defaultLoomNode] });
    set({ nodes: defaultNodes });
    set({ edges: initialEdges });
    set({ focusedNodeId: defaultLoomNode.id });
    set({ focusedNodeVersion: 0 });
  },
  past: [],
  future: [],
  takeSnapshot: () => {
    // we need to deepcopy the loomnodes to prevent delete from disowning every node's child
    let loomNodes = fromSavedTree(get().loomNodes.map(loomNode => nodeToJson(loomNode)));
    let nodes = get().nodes;
    let edges = get().edges;
    let past = get().past;
    let newPast = [...past.slice(past.length - MAX_HISTORY_SIZE + 1, past.length),
    { loomNodes, nodes, edges }];
    set({ past: newPast });
    set({ future: [] });
  },
  setLegalFocusedNode: () => {
    // check if focused node id and version exist
    const focusedNode = get().loomNodes.find(loomNode => get().focusedNodeId === loomNode.id);
    if (focusedNode) {
      const focusedNodeVersion = get().focusedNodeVersion
      if (focusedNodeVersion && focusedNodeVersion > focusedNode.diffs.length) {
        set({ focusedNodeVersion: null });
      }
    }
    else {
      set({ focusedNodeId: get().loomNodes[0].id })
    }
  },
  undo: () => {
    let past = get().past;
    let future = get().future;
    let loomNodes = get().loomNodes;
    let nodes = get().nodes;
    let edges = get().edges;
    if (past.length > 0) {
      future.push({ loomNodes, nodes, edges });
      let lastPast = past.pop();
      if (lastPast) {
        set({ loomNodes: lastPast.loomNodes });
        set({ nodes: lastPast.nodes });
        set({ edges: lastPast.edges });
        get().setLegalFocusedNode()
      }
    }
  },
  redo: () => {
    let past = get().past;
    let future = get().future;
    let loomNodes = get().loomNodes;
    let nodes = get().nodes;
    let edges = get().edges;
    if (future.length > 0) {
      past.push({ loomNodes, nodes, edges });
      let lastFuture = future.pop();
      if (lastFuture) {
        set({ loomNodes: lastFuture.loomNodes });
        set({ nodes: lastFuture.nodes });
        set({ edges: lastFuture.edges });
      }
    }
    get().setLegalFocusedNode()
  },
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0
}));

export default useStore;
