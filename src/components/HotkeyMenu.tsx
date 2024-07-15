import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle
} from "../@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs"
import { MenubarContent, MenubarItem } from "../@/components/ui/menubar"

export default function HotkeyMenu() {
  return (
    <Dialog >
      <DialogTrigger className="text-sm">
        Hotkeys
      </DialogTrigger>
      <MenubarContent>
        <MenubarItem>
          <DialogTrigger>
            Hotkeys
          </DialogTrigger>
        </MenubarItem>
      </MenubarContent>
    </Dialog >
  );
}