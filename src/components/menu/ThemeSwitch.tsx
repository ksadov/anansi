import { Moon, Sun, Sparkles, Earth, TentTree } from "lucide-react"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"

function themeIcon(theme: string) {
  const className = "h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all"
  if (theme === "dark") {
    return <Moon className={className} />
  }
  if (theme === 'greenhouse') {
    return <Earth className={className} />
  }
  if (theme === 'wilderness') {
    return <TentTree className={className} />
  }
  if (theme == 'dream') {
    return <Sparkles className={className} />
  }
  else {
    return <Sun className={className} />
  }
}

export default function Themeswitch(
  { theme, setTheme }: { theme: string, setTheme: (theme: string) => void }
) {
  return (
    <MenubarMenu>
      <MenubarTrigger>
        {themeIcon(theme)}
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
        <MenubarItem
          onClick={() => setTheme("greenhouse")}
        >
          Greenhouse
        </MenubarItem>
        <MenubarItem
          onClick={() => setTheme("wilderness")}
        >
          Wilderness
        </MenubarItem>
        <MenubarItem
          onClick={() => setTheme("dream")}
        >
          Dream
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
}