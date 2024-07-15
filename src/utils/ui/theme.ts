import { readLocalStorage, writeLocalStorage } from "utils/ui/lstore";

export function saveThemePref(theme: string) {
  const themeJson = `{"pref":"${theme}"}`;
  writeLocalStorage("theme", themeJson);
}

export function initialThemePref() {
  const storedPref: string | null = readLocalStorage("theme");
  if (storedPref !== null) {
    return JSON.parse(storedPref).pref;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  else if (window.matchMedia('(prefers-color-scheme: light)')
    .matches) {
    return 'light';
  }
  else return 'light';
}