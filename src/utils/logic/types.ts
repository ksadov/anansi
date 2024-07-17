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

export type Logprob = {
  token: string,
  lp: number
}

export type Generation = {
  text: string,
  timestamp: number,
  model: { name: string, apiURL: string, params: { [key: string]: any } }
  logprobs: {
    text: Logprob[],
    top: Logprob[][]
  } | null,
  finishReason: string
  rawResponse: string
  prompt: string
}