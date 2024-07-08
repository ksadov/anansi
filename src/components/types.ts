export type LoomNode = {
  id: string,
  text: string,
  parent?: LoomNode,
  children: LoomNode[],
  inFocus: boolean
}

export type NodeGraphData = {
  label: string,
  loomNode: LoomNode,
  generateCallback: () => void;
  focusNode: () => void;
};