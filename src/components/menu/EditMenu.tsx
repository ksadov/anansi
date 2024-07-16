import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"

export default function EditMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        Edit
      </MenubarTrigger>
      < MenubarContent >
        <MenubarItem>Undo </MenubarItem>
        < MenubarItem > Redo </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}