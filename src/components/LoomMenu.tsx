import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";
import { LoomNode } from "./types"


export default function LoomMenu(
  { theme, setTheme, loomNodes }: { theme: string, setTheme: (theme: string) => void, loomNodes: LoomNode[] }
) {
  return (
    <Menubar>
      <MenubarMenu>
        <FileMenu loomNodes={loomNodes} />
        <div className="size-full flex justify-end">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}