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

function HotkeyLine({ keyName, description }: { keyName: string, description: string }) {
  return (
    <div className="flex justify-between">
      <p>
        <span className="text-foreground">{keyName}</span>
        <div className="w-1" />
        <span className="text-muted-foreground">{description}</span>
      </p>
    </div >
  );
}

export default function HotkeyMenu({ hotkeys }: { hotkeys: { key: string, description: string }[] }) {
  const hotkeyLines = hotkeys.map(({ key, description }) => (
    <HotkeyLine key={key} keyName={key} description={description} />
  ));
  return (
    <Dialog >
      <DialogTrigger id="hotkey-menu-trigger" className="text-sm">
        Hotkeys
      </DialogTrigger>
      <MenubarContent>
        <MenubarItem>
          Hotkeys
        </MenubarItem>
      </MenubarContent>
      <DialogContent className="max-h-[90vh] overflow-auto" aria-describedby="hotkey menu">
        <DialogTitle>
          Hotkeys
        </DialogTitle>
        <DialogDescription>
          <div className="grid grid-cols-2 gap-2">
            {hotkeyLines}
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog >
  );
}