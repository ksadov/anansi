import {
  Menubar,
  MenubarMenu,
} from "../@/components/ui/menubar"

import ThemeSwitch from "./ThemeSwitch"

export default function LoomMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <ThemeSwitch />
      </MenubarMenu>
    </Menubar>
  );
}