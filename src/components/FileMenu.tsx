
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"
import { Import, ArrowRightFromLine } from "lucide-react"

export default function FileMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        File
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <span className="p-1"><ArrowRightFromLine size={16} /></span> Export to savefile
        </MenubarItem>
        <MenubarItem>
          <span className="p-1"><Import size={16} /></span>  Import from savefile
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}