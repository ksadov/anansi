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
import { toast } from "sonner"
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

function ModelSettingsDisplay({ modelSettings, updateModelSettings, addModelSettings, deleteModelSettings }:
  {
    modelSettings: ModelSettings, updateModelSettings: (modelSetting: ModelSettings) => void,
    addModelSettings: (modelSetting: ModelSettings) => void, deleteModelSettings: (modelId: string) => void
  }) {
  var setModel = modelSettings;
  return (
    <div className="p-2">
      <div className="p-3 border rounded-md grid w-full items-center gap-2">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            defaultValue={modelSettings.name}
            placeholder="mistralai/Mixtral-8x7B-v0.1"
            onChange={(e) => {
              setModel = { ...setModel, name: e.target.value };
            }}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">API URL</Label>
          <Input id="api-url"
            defaultValue={modelSettings.apiURL}
            placeholder="https://api.together.xyz/v1/completions"
            onChange={(e) => {
              setModel = { ...setModel, apiURL: e.target.value };
            }}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">API Key</Label>
          <Input
            id="api-key"
            defaultValue={modelSettings.apiKey}
            placeholder="your-api-key"
            onChange={(e) => {
              setModel = { ...setModel, apiKey: e.target.value };
            }}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="name">Parameters</Label>
          <Textarea
            id="api-url"
            defaultValue={JSON.stringify(modelSettings.params)}
            placeholder="Name of your project"
            onChange={(e) => {
              setModel = { ...setModel, params: JSON.parse(e.target.value) };
            }}
          />
        </div>
        <div className="flex justify-end mt-2">
          <div className="p-1">
            <Button
              onClick={() => { updateModelSettings(setModel); toast.success(`Updated ${setModel.name}.`) }}
            >
              Save
            </Button>
          </div>
          <div className="p-1">
            <Button variant="destructive" onClick={() => deleteModelSettings(modelSettings.id)}>Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelModalContent({ modelsSettings, updateModelSettings, addModelSettings, deleteModelSettings }:
  {
    modelsSettings: ModelSettings[],
    updateModelSettings: (modelSetting: ModelSettings) => void,
    addModelSettings: (modelSetting: ModelSettings) => void,
    deleteModelSettings: (modelId: string) => void
  }) {
  const modelSettingsDisplay = modelsSettings.map((modelSetting, index) => (
    <ModelSettingsDisplay
      key={index}
      modelSettings={modelSetting}
      updateModelSettings={updateModelSettings}
      addModelSettings={addModelSettings}
      deleteModelSettings={deleteModelSettings}
    />));
  return (
    <TabsContent value="models">
      {modelSettingsDisplay}
    </TabsContent>
  );
}

function SettingsModal({ exportCurrentTree, modelsSettings, setModelsSettings }:
  {
    exportCurrentTree: () => void,
    modelsSettings: ModelSettings[],
    setModelsSettings: (modelsSettings: ModelSettings[]) => void
  }) {
  const updateModelSettings = (updatedModel: ModelSettings) => {
    setModelsSettings(modelsSettings.map(model => model.id === updatedModel.id ? updatedModel : model)
    );
  };

  const addModelSettings = (newModel: ModelSettings) => {
    setModelsSettings([...modelsSettings, newModel]);
  };

  const deleteModelSettings = (modelId: string) => {
    setModelsSettings(modelsSettings.filter(model => model.id !== modelId)
    );
  };
  return (
    <DialogContent className="max-h-[90vh] overflow-auto">
      <Tabs defaultValue="models">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="reset">Reset</TabsTrigger>
        </TabsList>
        <div className="p-2">
          <ResetModalContent exportCurrentTree={exportCurrentTree} />
          <TabsContent value="models">
            <ModelModalContent
              modelsSettings={modelsSettings}
              updateModelSettings={updateModelSettings}
              addModelSettings={addModelSettings}
              deleteModelSettings={deleteModelSettings}
            />
            <div>
              <Button onClick={() => addModelSettings({
                id: Math.random().toString(36).substring(2),
                name: "New Model",
                apiURL: "https://api.together.xyz/v1/completions",
                apiKey: "your-api-key",
                params: {}
              })}>Add Model</Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </DialogContent >
  );
}

export default function SettingsMenu({ exportCurrentTree, modelsSettings, setModelsSettings }:
  {
    exportCurrentTree: () => void, modelsSettings: ModelSettings[],
    setModelsSettings: (modelsSettings: ModelSettings[]) => void,
  }) {
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
      <SettingsModal
        exportCurrentTree={exportCurrentTree}
        modelsSettings={modelsSettings}
        setModelsSettings={setModelsSettings}
      />
    </Dialog >
  );
}