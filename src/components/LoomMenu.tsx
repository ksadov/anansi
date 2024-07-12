import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";
import SettingsMenu from "./SettingsMenu";
import { LoomNode, SavedLoomNode } from "./types"


export default function LoomMenu({ theme, setTheme, loomNodes, initFromSaveFile }:
  {
    theme: string,
    setTheme: (theme: string) => void,
    loomNodes: LoomNode[],
    initFromSaveFile: (loomNodes: SavedLoomNode[]) => void
  }
) {
  return (
    <Menubar>
      <MenubarMenu>
        <FileMenu loomNodes={loomNodes} initFromSaveFile={initFromSaveFile} />
        <SettingsMenu />
        <div className="size-full flex justify-end">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}