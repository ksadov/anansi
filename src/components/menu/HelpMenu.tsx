import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { MenubarContent, MenubarItem } from "@/components/ui/menubar"

function HotkeyLine({ keyName, description }: { keyName: string, description: string }) {
  return (
    <div className="flex justify-between">
      <p>
        <span className="text-foreground">{keyName}</span>
        <span className="w-1" />
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
        Help
      </DialogTrigger>
      <MenubarContent>
        <MenubarItem>
          Help
        </MenubarItem>
      </MenubarContent>
      <DialogContent className="max-h-[90vh] overflow-auto" aria-describedby={undefined}>
        <DialogTitle>
          Help
        </DialogTitle>
        <Tabs defaultValue="hotkeys">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="hotkeys">Hotkeys</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          <div className="p-2">
            <TabsContent value="hotkeys">
              <div className="grid grid-cols-2 gap-2 p-2">
                {hotkeyLines}
              </div>
            </TabsContent>
            <TabsContent value="documentation">
              For documentation and source code, see <a className="underline" href="https://github.com/ksadov/anansi">GitHub</a>.
            </TabsContent>
          </div>
        </Tabs >
      </DialogContent >
    </Dialog >
  );
}