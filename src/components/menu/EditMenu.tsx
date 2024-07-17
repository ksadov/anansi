import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger, MenubarShortcut } from "@/components/ui/menubar"
import { Menubar } from "@radix-ui/react-menubar";
import { Menu } from "lucide-react";

export default function EditMenu({ canUndo, canRedo, undo, redo, undoKey, redoKey }: {
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
  undoKey: string;
  redoKey: string;
}) {
  const undoItem = canUndo() ?
    <MenubarItem onClick={undo}>Undo<MenubarShortcut>{undoKey}</MenubarShortcut></MenubarItem> :
    <MenubarItem disabled>Undo<MenubarShortcut>{undoKey}</MenubarShortcut></MenubarItem>;
  const redoItem = canRedo() ?
    <MenubarItem onClick={redo}>Redo<MenubarShortcut>{redoKey}</MenubarShortcut></MenubarItem> :
    <MenubarItem disabled>Redo<MenubarShortcut>{redoKey}</MenubarShortcut></MenubarItem>;
  return (
    <MenubarMenu>
      <MenubarTrigger>
        Edit
      </MenubarTrigger>
      <MenubarContent>
        {undoItem}
        {redoItem}
      </MenubarContent>
    </MenubarMenu >
  );
}