import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "../@/components/ui/dialog"
import { Button } from "../@/components/ui/button"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"

function SettingsModalContent() {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This will clear all your data and reset the app to its initial state. Maybe you want to export your current tree data locally first?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Export and reset</Button>
        <Button className="text-red-500" variant="ghost">Reset without export</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default function SettingsMenu() {
  return (
    <Dialog >
      <MenubarTrigger>
        Settings
      </MenubarTrigger>
      <MenubarContent>
        <MenubarItem className="text-red-500">
          <DialogTrigger>
            Hard Reset
          </DialogTrigger>
        </MenubarItem>
      </MenubarContent>
      <SettingsModalContent />
    </Dialog>
  );
}