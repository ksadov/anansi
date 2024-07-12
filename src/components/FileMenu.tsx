
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"
import { Import, ArrowRightFromLine } from "lucide-react"
import { LoomNode, SavedLoomNode } from "./types"
import { nodeToJson, fromSaveFile } from "./loomNode";

export default function FileMenu({ importTree, exportCurrentTree }:
  {
    importTree: () => void,
    exportCurrentTree: () => void
  }) {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        File
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem onClick={exportCurrentTree}>
          <span className="p-1"><ArrowRightFromLine size={16} /></span> Export to savefile
        </MenubarItem>
        <MenubarItem onClick={importTree}>
          <span className="p-1"><Import size={16} /></span>  Import from savefile
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}