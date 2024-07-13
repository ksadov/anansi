import { useState, useEffect } from "react";
import { AppState, SavedLoomNode } from "./types";

// modified from https://github.com/paradigmxyz/flux/blob/main/src/utils/lstore.ts

export function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}

export function readLocalStorage<T>(key: string): T | null {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : null;
}

export function writeLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useLocalStorage<T>(
  key: string
): [T | null, React.Dispatch<React.SetStateAction<T | null>>] {
  const [value, setValue] = useState<T | null>(() => readLocalStorage(key));

  useEffect(() => setValue(readLocalStorage(key)), [key]);

  useEffect(() => writeLocalStorage(key, value), [key, value]);

  return [value, setValue];
}

export function writeAppStateLocal(state: AppState) {
  writeLocalStorage("appState", state);
}

export function loadAppStateLocal(initFromSaveFile: (loomNodes: SavedLoomNode[]) => void): void {
  const state = readLocalStorage<AppState>("appState");
  if (state) {
    initFromSaveFile(state.loomTree.loomTree);
  }
}