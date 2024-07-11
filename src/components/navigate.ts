import { LoomNode } from './types';

export function navToParent(focusedNode: LoomNode, setFocusedNodeId: (id: string) => void) {
  if (focusedNode.parent == undefined) {
    return;
  }
  else {
    setFocusedNodeId(focusedNode.parent?.loomNode.id);
  }
}