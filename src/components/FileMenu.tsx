
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"
import { Import, ArrowRightFromLine } from "lucide-react"
import { LoomNode } from "./types"
import { nodeToJson } from "./loomNode";

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
        <MenubarItem>
          <span className="p-1"><Import size={16} /></span>  Import from savefile
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}