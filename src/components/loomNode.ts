import { LoomNode } from "./types"

export function createLoomNode(
  id: string,
  text: string,
  parent?: { loomNode: LoomNode, version: number } | undefined,
  inFocus: boolean = false,
): LoomNode {
  return {
    id,
    timestamp: Date.now(),
    originalText: text,
    latestText: text,
    diffs: [],
    parent,
    children: [],
    inFocus
  }
}

export function addDiff(loomNode: LoomNode, edit: string, dmp: any) {
  const diff = dmp.diff_main(loomNode.latestText, edit)
  dmp.diff_cleanupSemantic(diff);
  const newDiff = {
    version: loomNode.diffs.length + 1,
    timestamp: Date.now(),
    content: diff
  }
  loomNode.diffs.push(newDiff)
  loomNode.latestText = edit
}

export function patchToVersion(loomNode: LoomNode, version: number, dmp: any) {
  // find index of corresponding diff
  const diffIndex = version - 1;
  if (diffIndex == -1) {
    return loomNode.originalText;
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

export function constructLineage(loomNode: LoomNode) {
  const lineage = []
  let current = loomNode.parent
  while (current) {
    lineage.push(current)
    current = current.loomNode.parent
  }
  return lineage
}