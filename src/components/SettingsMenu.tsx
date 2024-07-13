import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "../@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs"
import { Button } from "../@/components/ui/button"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"
import { Input } from "../@/components/ui/input"
import { Label } from "../@/components/ui/label"
import { Textarea } from "../@/components/ui/textarea"
import { clearLocalStorage } from "./lstore";
import { ModelSettings } from "./types";

function ResetModalContent({ exportCurrentTree }: { exportCurrentTree: () => void }) {
  return (
    <TabsContent value="reset">
      <DialogHeader className="p-2">
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This will clear all your data and reset the app to its initial state. Maybe you want to export your current tree data locally first?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="p-2">
        <Button variant="outline" onClick={() => { exportCurrentTree(); clearLocalStorage(); }}>
          Export and reset
        </Button>
        <Button className="text-red-500" variant="ghost" onClick={clearLocalStorage}>
          Reset without export
        </Button>
      </DialogFooter>
    </TabsContent >
  );
}

function ModelSettingsDisplay({ modelSettings }: { modelSettings: ModelSettings }) {
  return (
    <div className="p-3 border rounded-md">
      <form>
        <div className="grid w-full items-center gap-2">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={modelSettings.name} placeholder="mistralai/Mixtral-8x7B-v0.1" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">API URL</Label>
            <Input id="api-url" defaultValue={modelSettings.apiURL} placeholder="https://api.together.xyz/v1/completions" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">API Key</Label>
            <Input id="api-key" defaultValue={modelSettings.apiKey} />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Parameters</Label>
            <Textarea id="api-url" defaultValue={JSON.stringify(modelSettings.params)} placeholder="Name of your project" />
          </div>
        </div>
      </form>
    </div>
  );
}

function ModelModalContent({ modelsSettings }: { modelsSettings: ModelSettings[] }) {
  const modelSettingsDisplay = modelsSettings.map((modelSetting, index) => (
    <ModelSettingsDisplay key={index} modelSettings={modelSetting} />
  ));
  return (
    <TabsContent value="models">
      {modelSettingsDisplay}
    </TabsContent>
  );
}

function SettingsModal({ exportCurrentTree, modelsSettings }: { exportCurrentTree: () => void, modelsSettings: ModelSettings[] }) {
  return (
    <DialogContent>
      <Tabs defaultValue="models">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>
        <div className="p-2">
          <ResetModalContent exportCurrentTree={exportCurrentTree} />
          <TabsContent value="models">
            <ModelModalContent modelsSettings={modelsSettings} />
          </TabsContent>
        </div>
      </Tabs>
    </DialogContent >
  );
}

export default function SettingsMenu({ exportCurrentTree, modelsSettings }: { exportCurrentTree: () => void, modelsSettings: ModelSettings[] }) {
  return (
    <Dialog >
      <DialogTrigger className="text-sm">
        Settings
      </DialogTrigger>
      <MenubarContent>
        <MenubarItem className="text-red-500">
          <DialogTrigger>
            Hard Reset
          </DialogTrigger>
        </MenubarItem>
      </MenubarContent>
      <SettingsModal exportCurrentTree={exportCurrentTree} modelsSettings={modelsSettings} />
    </Dialog >
  );
}