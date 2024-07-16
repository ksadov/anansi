import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import { Menu } from "lucide-react";

export default function EditMenu({ canUndo, canRedo, undo, redo }: {
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => void;
  redo: () => void;
}) {
  const undoItem = canUndo() ? <MenubarItem onClick={undo}>Undo</MenubarItem> : <MenubarItem disabled>Undo</MenubarItem>;
  const redoItem = canRedo() ? <MenubarItem onClick={redo}>Redo</MenubarItem> : <MenubarItem disabled>Redo</MenubarItem>;
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