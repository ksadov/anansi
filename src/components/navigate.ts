import { LoomNode } from './types';

export function navToParent(focusedNode: LoomNode, setFocusedNodeId: (id: string) => void) {
  if (focusedNode.parent == undefined) {
    return;
  }
  else {
    setFocusedNodeId(focusedNode.parent?.loomNode.id);
  }
}

export function navToChild(focusedNode: LoomNode, setFocusedNodeId: (id: string) => void) {
  if (focusedNode.children.length === 0) {
    return;
  }
  else {
    setFocusedNodeId(focusedNode.children[0].id);
  }
}

export function navToSibling(focusedNode: LoomNode, setFocusedNodeId: (id: string) => void, direction: 'next' | 'prev') {
  const siblings = focusedNode.parent?.loomNode.children;
  if (siblings == undefined) {
    return;
  }
  const idx = siblings.findIndex((sibling) => sibling.id === focusedNode.id);
  if (idx === -1) {
    return;
  }
  if (direction === 'next') {
    if (idx + 1 < siblings.length) {
      setFocusedNodeId(siblings[idx + 1].id);
    }
  }
  else {
    if (idx - 1 >= 0) {
      setFocusedNodeId(siblings[idx - 1].id);
    }
  }
}