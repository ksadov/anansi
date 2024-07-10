
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"

export default function FileMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        File
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          Download savefile
        </MenubarItem>
        <MenubarItem>
          Load from savefile
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}