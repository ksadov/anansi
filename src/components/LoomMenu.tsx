import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";
import SettingsMenu from "./SettingsMenu";
import ModelSelect from "./ModelSelect";
import { ModelSettings } from "./types"


export default function LoomMenu({ theme, modelsSettings, setTheme, importTree, exportCurrentTree, setModelsSettings,
  activeModelIndex, setActiveModelIndex }:
  {
    theme: string,
    modelsSettings: ModelSettings[],
    setTheme: (theme: string) => void,
    importTree: () => void,
    exportCurrentTree: () => void,
    setModelsSettings: (modelsSettings: ModelSettings[]) => void,
    activeModelIndex: number,
    setActiveModelIndex: (index: number) => void
  }
) {
  return (
    <Menubar>
      <MenubarMenu >
        <FileMenu importTree={importTree} exportCurrentTree={exportCurrentTree} />
        <SettingsMenu
          exportCurrentTree={exportCurrentTree}
          modelsSettings={modelsSettings}
          setModelsSettings={setModelsSettings}
        />
        <div className="size-full flex justify-end">
          <ModelSelect modelsSettings={modelsSettings} activeModelIndex={activeModelIndex} setActiveModelIndex={setActiveModelIndex} />
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}