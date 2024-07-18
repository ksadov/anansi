import { readLocalStorage, writeLocalStorage } from "utils/ui/lstore";

export function saveThemePref(theme: string) {
  const themeJson = `{"pref":"${theme}"}`;
  writeLocalStorage("theme", themeJson);
}

export function initialThemePref() {
  try {
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
  catch (error) {
    console.log('Error reading theme preference from local storage, setting to light');
    console.error(error);
    return 'light';
  }
}