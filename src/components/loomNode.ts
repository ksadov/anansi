import { LoomNode, SavedLoomNode, Generation } from "./types"

export function createLoomNode(
  id: string,
  text: string,
  parent: { loomNode: LoomNode, version: number } | undefined,
  generation: Generation | undefined,
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
    inFocus: inFocus,
    generation
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
  return lineage.reverse()
}

export function getSubTree(loomNode: LoomNode) {
  const subTree = [loomNode]
  const queue = loomNode.children
  while (queue.length > 0) {
    const current = queue.shift()!
    subTree.push(current)
    queue.push(...current.children)
  }
  return subTree
}


export function nodeToJson(loomNode: LoomNode) {
  const json = {
    id: loomNode.id,
    timestamp: loomNode.timestamp,
    originalText: loomNode.originalText,
    latestText: loomNode.latestText,
    diffs: loomNode.diffs,
    parent: loomNode.parent ? { id: loomNode.parent.loomNode.id, version: loomNode.parent.version } : null,
    children: loomNode.children.map((child) => child.id),
    generation: loomNode.generation
  }
  console.log("JSON GENERATION", json.generation)
  return json
}

function jsonToNode(json: any, parent: { loomNode: LoomNode, version: number } | undefined): LoomNode {
  const loomNode = {
    id: json.id,
    timestamp: json.timestamp,
    originalText: json.originalText,
    latestText: json.latestText,
    diffs: json.diffs,
    parent: parent,
    children: [],
    inFocus: false,
    generation: json.generation
  }
  return loomNode
}

export function fromSavedTree(nodeList: SavedLoomNode[]): LoomNode[] {
  console.log(nodeList)
  // sort nodes by timestamp, oldest first
  const nodeListSorted = nodeList.sort((a, b) => a.timestamp - b.timestamp)
  const createdNodes: LoomNode[] = []
  for (const node of nodeListSorted) {
    if (node.parent == null) {
      createdNodes.push(jsonToNode(node, undefined));
    }
    else {
      const parentNodeId = node.parent.id;
      const parentVersion = node.parent.version;
      const parentNode = createdNodes.find((n) => n.id === parentNodeId);
      createdNodes.push(jsonToNode(node, { loomNode: parentNode!, version: parentVersion }));
      parentNode!.children.push(createdNodes[createdNodes.length - 1]);
    }
  }
  return createdNodes;
}
