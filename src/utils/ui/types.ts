
import { Node, Edge } from "reactflow"
import { LoomNode, ModelSettings, TreeSpecV0 } from "utils/logic/types";

export type NodeGraphData = {
  loomNode: LoomNode,
  focusNode: () => void
  invisible?: boolean
};

export type HistoryItem = {
  loomNodes: LoomNode[],
  nodes: Node[],
  edges: Edge[],
};

export type AppState = {
  modelsSettings: ModelSettings[],
  activeModelIndex: number,
  focusedNodeId: string,
  focusedNodeVersion: number | null,
  loomTree: TreeSpecV0,
};