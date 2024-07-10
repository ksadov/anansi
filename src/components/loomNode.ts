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
  const latestPatch = patchToLatest(loomNode, dmp);
  const diff = dmp.diff_main(latestPatch, edit)
  dmp.diff_cleanupSemantic(diff);
  const cleanDiffId = Math.floor(Math.random() * 100).toString();
  const newDiff = {
    id: cleanDiffId,
    timestamp: Date.now(),
    content: diff
  }
  loomNode.diffs.push(newDiff)
}

export function patchToLatest(loomNode: LoomNode, dmp: any) {
  if (loomNode.diffs.length == 0) {
    return loomNode.originalText;
  }
  const lastElement = loomNode.diffs[loomNode.diffs.length - 1];
  return patchToId(loomNode, lastElement.id, dmp);
}

export function patchToId(loomNode: LoomNode, diffId: string, dmp: any) {
  // find index of corresponding diff
  const diffIndex = loomNode.diffs.findIndex((diff) => diff.id == diffId);
  if (diffIndex == -1) {
    throw new Error(`Could not patch Loom node ${loomNode.id} to diff ${diffId}`)
  }
  else {
    const diffContent = loomNode.diffs.slice(0, diffIndex + 1).map(diff => diff.content);
    let text = loomNode.originalText;
    let results;
    for (let i = 0; i < diffContent.length; i++) {
      const patch = dmp.patch_make(text, diffContent[i]);
      [text, results] = dmp.patch_apply(patch, text);
    }
    return text;
  }
}