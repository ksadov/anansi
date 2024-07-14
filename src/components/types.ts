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
  inFocus: boolean,
  generation?: Generation
}

export type NodeGraphData = {
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
  generation?: Generation
}

export type TreeSpecV0 = {
  metadata: { version: number, created: string },
  loomTree: SavedLoomNode[]
};

export type ModelSettings = {
  name: string,
  id: string,
  apiURL: string,
  apiKey: string,
  maxLength: number,
  params: { [key: string]: any }
}

export type AppState = {
  modelsSettings: ModelSettings[],
  activeModelIndex: number,
  focusedNodeId: string,
  focusedNodeVersion: number | null,
  loomTree: TreeSpecV0,
}

export type Logit = {
  token: string,
  logprob: number
}

export type Generation = {
  text: string,
  timestamp: number,
  model: { name: string, apiURL: string, params: { [key: string]: any } }
  logits: Logit[][]
  finishReason: string
  rawResponse: string
  prompt: string
}