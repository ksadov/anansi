export type LoomNode = {
  text: string,
}

export type NodeGraphData = {
  label: string,
  loomNode: LoomNode,
  generateCallback: () => void;
};