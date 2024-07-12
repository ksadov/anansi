import { nodeToJson, fromSaveFile } from "./loomNode";
import { LoomNode, SavedLoomNode } from "./types"

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

export function triggerUpload(initFromSaveFile: (loomNodes: SavedLoomNode[]) => void, layoutFn: () => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const data = await getUploadedJson(file);
        initFromSaveFile(data);
        setTimeout(layoutFn, 10);
      } catch (e) {
        console.error(e);
      }
    }
  }
  input.click();
}

export function dumpToFile(loomNodes: LoomNode[]) {
  const timestamp = new Date().toISOString();
  const jsonList = loomNodes.map(nodeToJson);
  const metadata = { version: 0, created: timestamp };
  const data = { metadata: metadata, loomTree: jsonList };
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `loom-${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  console.log("dumped to file");
}