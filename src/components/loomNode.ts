import { Diff, patch_obj } from "diff-match-patch";
import { LoomNode } from "./types"

export function createLoomNode(
  id: string,
  text: string,
  parent?: LoomNode,
  inFocus: boolean = false,
): LoomNode {
  return {
    id,
    timestamp: Date.now(),
    originalText: text,
    diffs: [],
    parent,
    children: [],
    inFocus
  }
}

export function addDiff(loomNode: LoomNode, edit: string, dmp: any) {
  const rawDiff = dmp.diff_main(patchToLatest(loomNode, dmp), edit)
  const cleanDiff = dmp.diff_cleanupSemantic(rawDiff);
  loomNode.diffs.push(cleanDiff)
}

export function patchToLatest(loomNode: LoomNode, dmp: any) {
  return patchToId(loomNode, loomNode.diffs[-1].id, dmp)
}

export function patchToId(loomNode: LoomNode, diffId: string, dmp: any) {
  // find index of corresponding diff
  const diffIndex = loomNode.diffs.findIndex((diff) => diff.id == diffId);
  if (diffIndex == -1) {
    throw new Error(`Could not patch Loom node ${loomNode.id} to diff ${diffId}`)
  }
  else {
    return dmp.patch_apply(loomNode.originalText, dmp.patch_make(loomNode.diffs.slice(0, diffIndex)));
  }
}