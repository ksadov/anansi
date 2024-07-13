import { Options } from "react-hotkeys-hook";
import { ModelSettings } from "./types";

export const HOTKEY_CONFIG: Options = {
  preventDefault: true,
  enableOnFormTags: true,
};

export const DEFAULT_NODE_TEXT = "Best practices for looming:\n\n1. Save early, save often\n2. Have fun and be yourself\n3.";

export const DEBUG_MODEL: ModelSettings = {
  name: "Debug",
  id: "debug",
  apiURL: "http://localhost:5000",
  apiKey: "",
  params: {
    logprobs: 3,
    max_tokens: 16,
  }
}