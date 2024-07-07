export type LoomNode = {
  id: string,
  text: string,
  parent?: LoomNode,
  children: LoomNode[]
}

export type NodeGraphData = {
  label: string,
  loomNode: LoomNode,
  generateCallback: () => void;
};