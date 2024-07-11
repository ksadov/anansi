export function textPreview(text: string): string {
  return text.length > 16 ? text.slice(0, 16) + "..." : text;
}

export function initialThemePref() {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  else if (window.matchMedia('(prefers-color-scheme: light)')
    .matches) {
    return 'light';
  }
  else return 'light';
}

export function getPlatformModifierKey() {
  return window.navigator.platform === "MacIntel" ? "meta" : "ctrl";
}

export function getPlatformModifierKeyText() {
  return window.navigator.platform === "MacIntel" ? "⌘" : " Ctrl ";
}