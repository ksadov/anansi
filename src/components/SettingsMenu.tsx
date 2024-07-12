import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../@/components/ui/dialog"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"

export default function SettingsMenu() {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        Settings
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem className="text-red-500">
          Hard Reset
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu >
  );
}