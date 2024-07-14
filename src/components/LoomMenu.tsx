import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"
import Loader from "../@/components/ui/loadingspinner"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";
import SettingsMenu from "./SettingsMenu";
import ModelSelect from "./ModelSelect";
import { ModelSettings } from "./types"


export default function LoomMenu({ theme, modelsSettings, setTheme, importTree, exportCurrentTree, setModelsSettings,
  activeModelIndex, setActiveModelIndex, newTree, exportSettings, importSettings, isGenerating }: {
    theme: string,
    modelsSettings: ModelSettings[],
    setTheme: (theme: string) => void,
    importTree: () => void,
    exportCurrentTree: () => void,
    setModelsSettings: (modelsSettings: ModelSettings[]) => void,
    activeModelIndex: number,
    setActiveModelIndex: (index: number) => void
    newTree: () => void
    exportSettings: () => void,
    importSettings: () => void,
    isGenerating: boolean
  }
) {
  const loadSpinner = isGenerating ? <Loader className="w-8" /> : null
  return (
    <Menubar>
      <MenubarMenu >
        <FileMenu
          importTree={importTree}
          exportCurrentTree={exportCurrentTree}
          newTree={newTree}
        />
        <SettingsMenu
          exportCurrentTree={exportCurrentTree}
          modelsSettings={modelsSettings}
          setModelsSettings={setModelsSettings}
          exportSettings={exportSettings}
          importSettings={importSettings}
        />
        <div className="size-full flex justify-end">
          {loadSpinner}
          <ModelSelect
            modelsSettings={modelsSettings}
            activeModelIndex={activeModelIndex}
            setActiveModelIndex={setActiveModelIndex}
            isGenerating={isGenerating}
          />
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}