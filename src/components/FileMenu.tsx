
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"
import { Import, ArrowRightFromLine } from "lucide-react"
import { LoomNode } from "./types"
import { nodeToJson, fromSaveFile } from "./loomNode";
import { json } from "stream/consumers";

function dumpToFile(loomNodes: LoomNode[]) {
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

function triggerUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      try {
        const data = await getUploadedJson(file);
        console.log(fromSaveFile(data));
      } catch (e) {
        console.error(e);
      }
    }
  }
  input.click();
}

export default function FileMenu({ loomNodes }: { loomNodes: LoomNode[] }) {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        File
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={() => dumpToFile(loomNodes)}>
          <span className="p-1"><ArrowRightFromLine size={16} /></span> Export to savefile
        </MenubarItem>
        <MenubarItem onClick={triggerUpload}>
          <span className="p-1"><Import size={16} /></span>  Import from savefile
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}