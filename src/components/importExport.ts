import { toast } from "sonner";
import { nodeToJson } from "./loomNode";
import { LoomNode, SavedLoomNode, TreeSpecV0, ModelSettings } from "./types"

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
        toast.success('Import successful');
      } catch (e) {
        toast.error('Failed to read file');
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

export function triggerSettingsUpload(initSettings: (settings: ModelSettings[]) => void) {
  const dataHandler = (data: any) => {
    initSettings(data.settings);
  }
  triggerUpload(dataHandler);
}


export function dumpTreeToJson(loomNodes: LoomNode[]) {
  const timestamp = new Date().toISOString();
  const jsonList = loomNodes.map(nodeToJson);
  const metadata = { version: 0, created: timestamp };
  const data = { metadata: metadata, loomTree: jsonList };
  return data;
}

export function dumpToFile(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
}

export function dumpTreeToFile(loomNodes: LoomNode[]) {
  const data = dumpTreeToJson(loomNodes);
  dumpToFile(data, `loom-tree-${new Date().toISOString()}`);
}

export function dumpSettingsToFile(settings: ModelSettings[]) {
  const settingsDict = { settings: settings, created: new Date().toISOString() }
  dumpToFile(settingsDict, `loom-settings-${new Date().toISOString()}`);
}