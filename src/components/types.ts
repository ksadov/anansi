import { Diff, patch_obj } from 'diff-match-patch';

export type LoomNodeDiff = {
  id: string,
  timestamp: number,
  content: Diff
}

export type LoomNode = {
  id: string,
  timestamp: number,
  originalText: string,
  diffs: LoomNodeDiff[],
  parent?: LoomNode,
  children: LoomNode[],
  inFocus: boolean
}

export type NodeGraphData = {
  label: string,
  loomNode: LoomNode,
  focusNode: () => void
};