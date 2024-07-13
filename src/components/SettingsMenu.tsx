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
          <div>
            Name: {modelSettings.name}
          </div>
          <div>
            API URL: {modelSettings.apiURL}
          </div>
          <div>
            API Key: {modelSettings.apiKey}
          </div>
          <div>
            Parameters: {JSON.stringify(modelSettings.params)}
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