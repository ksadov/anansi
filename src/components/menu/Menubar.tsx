import {
  Menubar,
  MenubarMenu,
} from "@/components/ui/menubar"
import Loader from "@/components/ui/loadingspinner"
import ThemeSwitch from "components/menu/ThemeSwitch"
import FileMenu from "components/menu/FileMenu";
import SettingsMenu from "components/menu/SettingsMenu";
import ModelSelect from "components/menu/ModelSelect";
import HelpMenu from "components/menu/HelpMenu"
import EditMenu from "components/menu/EditMenu"
import { ModelSettings } from "utils/logic/types"


export default function LoomMenu({ theme, modelsSettings, setTheme, importTree, exportCurrentTree, setModelsSettings,
  activeModelIndex, setActiveModelIndex, newTree, exportSettings, importSettings, isGenerating, hotkeys,
  canUndo, canRedo, undo, redo }: {
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
    isGenerating: boolean,
    hotkeys: { key: string, description: string }[],
    canUndo: () => boolean,
    canRedo: () => boolean,
    undo: () => void,
    redo: () => void,
  }
) {
  const loadSpinner = isGenerating ? <Loader className="w-8" /> : null;
  return (
    <Menubar>
      <MenubarMenu >
        <FileMenu
          importTree={importTree}
          exportCurrentTree={exportCurrentTree}
          newTree={newTree}
        />
        <EditMenu
          canUndo={canUndo}
          canRedo={canRedo}
          undo={undo}
          redo={redo}
        />
        <div className="p-2">
          <SettingsMenu
            exportCurrentTree={exportCurrentTree}
            modelsSettings={modelsSettings}
            setModelsSettings={setModelsSettings}
            exportSettings={exportSettings}
            importSettings={importSettings}
          />
        </div>
        <div className="p-2">
          <HelpMenu hotkeys={hotkeys} />
        </div>
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