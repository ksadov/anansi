"use client"

import { Moon, Sun } from "lucide-react"

import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "../@/components/ui/menubar"

export default function Themeswitch(
  { setTheme }: { setTheme: (theme: string) => void }
) {
  return (
    <div className="size-full flex justify-end">
      <MenubarMenu>
        <MenubarTrigger>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem
            onClick={() => setTheme("dark")}
          >
            Dark
          </MenubarItem>
          <MenubarItem
            onClick={() => setTheme("light")}
          >
            Light
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </div>
  );
}