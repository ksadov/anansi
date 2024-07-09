import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"

export default function LoomMenu(
  { setTheme }: { setTheme: (theme: string) => void }
) {
  return (
    <Menubar>
      <MenubarMenu>
        <ThemeSwitch setTheme={setTheme} />
      </MenubarMenu>
    </Menubar>
  );
}