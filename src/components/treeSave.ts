import { nodeToJson } from "./loomNode";
import { LoomNode, SavedLoomNode, TreeSpecV0 } from "./types"

function getUploadedJson(file: File): Promise<any> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    }
    reader.readAsText(file);
  });
}

export function triggerUpload(dataHandler: (data: any) => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const data = await getUploadedJson(file);
        dataHandler(data);
      } catch (e) {
        console.error(e);
      }
    }
  }
  input.click();
}

export function triggerTreeUpload(initFromSaveFile: (loomNodes: SavedLoomNode[]) => void, layoutFn: () => void) {
  const dataHandler = (data: TreeSpecV0) => {
    initFromSaveFile(data.loomTree);
    setTimeout(layoutFn, 50);
  }
  triggerUpload(dataHandler);
}

export function dumpToJson(loomNodes: LoomNode[]) {
  const timestamp = new Date().toISOString();
  const jsonList = loomNodes.map(nodeToJson);
  const metadata = { version: 0, created: timestamp };
  const data = { metadata: metadata, loomTree: jsonList };
  return data;
}

export function dumpToFile(loomNodes: LoomNode[], prefix: string) {
  const data = dumpToJson(loomNodes);
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${prefix}-${data.metadata.created}.json`;
  document.body.appendChild(a);
  a.click();
}

export function dumpTreeToFile(loomNodes: LoomNode[]) {
  dumpToFile(loomNodes, "loom-tree");
}