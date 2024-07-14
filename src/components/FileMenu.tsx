
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"
import { Import, ArrowRightFromLine, FilePlus } from "lucide-react"

export default function FileMenu({ importTree, exportCurrentTree, newTree }:
  {
    importTree: () => void,
    exportCurrentTree: () => void
    newTree: () => void
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
        <MenubarItem onClick={newTree}>
          <span className="p-1"><FilePlus size={16} /></span> New tree
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}