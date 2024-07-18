import { useState, useEffect } from "react";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { AppState } from "utils/ui/types";

// modified from https://github.com/paradigmxyz/flux/blob/main/src/utils/lstore.ts

export function clearLocalStorage() {
  localStorage.clear();
  window.location.reload();
}

export function readLocalStorage<T>(key: string): T | null {
  const storedValue = localStorage.getItem(key);
  const decompressed = storedValue ? decompressFromUTF16(storedValue) : null;
  return decompressed ? JSON.parse(decompressed) : null;
}

export function writeLocalStorage(key: string, value: any) {
  const compressed = compressToUTF16(JSON.stringify(value));
  localStorage.setItem(key, compressed);
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
  try {
    writeLocalStorage("appState", state);
    return null;
  }
  catch (error) {
    return error;
  }
}

export function loadAppStateLocal(initFromSaveFile: (appState: AppState) => void): void {
  const state = readLocalStorage<AppState>("appState");
  if (state) {
    initFromSaveFile(state);
  }
}