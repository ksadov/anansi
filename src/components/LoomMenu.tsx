import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"
import FileMenu from "./FileMenu";

export default function LoomMenu(
  { theme, setTheme }: { theme: string, setTheme: (theme: string) => void }
) {
  return (
    <Menubar>
      <MenubarMenu>
        <FileMenu />
        <div className="size-full flex justify-end">
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </MenubarMenu>
    </Menubar>
  );
}