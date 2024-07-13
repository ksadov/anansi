import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"
import { Dialog } from "../@/components/ui/dialog"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";
import SettingsMenu from "./SettingsMenu";
import { ModelSettings } from "./types"


export default function LoomMenu({ theme, modelsSettings, setTheme, importTree, exportCurrentTree, updateModelSettings,
  addModelSettings, deleteModelSettings }:
  {
    theme: string,
    modelsSettings: ModelSettings[],
    setTheme: (theme: string) => void,
    importTree: () => void,
    exportCurrentTree: () => void,
    updateModelSettings: (modelSetting: ModelSettings) => void,
    addModelSettings: (modelSetting: ModelSettings) => void,
    deleteModelSettings: (modelId: string) => void
  }
) {
  return (
    <Menubar>
      <MenubarMenu >
        <FileMenu importTree={importTree} exportCurrentTree={exportCurrentTree} />
        <SettingsMenu
          exportCurrentTree={exportCurrentTree}
          modelsSettings={modelsSettings}
          updateModelSettings={updateModelSettings}
          addModelSettings={addModelSettings}
          deleteModelSettings={deleteModelSettings}
        />
        <div className="size-full flex justify-end">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}