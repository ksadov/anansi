import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"

export default function LoomMenu(
  { theme, setTheme }: { theme: string, setTheme: (theme: string) => void }
) {
  return (
    <Menubar>
      <MenubarMenu>
        <ThemeSwitch theme={theme} setTheme={setTheme} />
      </MenubarMenu>
    </Menubar>
  );
}