import { Diff } from 'diff-match-patch';

export type LoomNodeDiff = {
  version: number,
  timestamp: number,
  content: Diff
}

export type LoomNode = {
  id: string,
  timestamp: number,
  originalText: string,
  latestText: string,
  diffs: LoomNodeDiff[],
  parent: { loomNode: LoomNode, version: number } | undefined,
  children: LoomNode[],
  inFocus: boolean
}

export type NodeGraphData = {
  label: string,
  loomNode: LoomNode,
  focusNode: () => void
  invisible?: boolean
};

export type SavedLoomNode = {
  id: string,
  timestamp: number,
  originalText: string,
  latestText: string,
  diffs: LoomNodeDiff[],
  parent: { id: string, version: number } | null
  children: string[],
}

export type TreeSpecV0 = {
  metadata: { version: number, created: string },
  loomTree: SavedLoomNode[]
};