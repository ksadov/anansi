import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"
import { Dialog } from "../@/components/ui/dialog"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";
import SettingsMenu from "./SettingsMenu";
import { LoomNode, SavedLoomNode } from "./types"


export default function LoomMenu({ theme, setTheme, importTree, exportCurrentTree }:
  {
    theme: string,
    setTheme: (theme: string) => void,
    importTree: () => void,
    exportCurrentTree: () => void,
  }
) {
  return (
    <Menubar>
      <MenubarMenu >
        <FileMenu importTree={importTree} exportCurrentTree={exportCurrentTree} />
        <SettingsMenu exportCurrentTree={exportCurrentTree} />
        <div className="size-full flex justify-end">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}