import { Options } from "react-hotkeys-hook";
import { ModelSettings } from "./types";

export const HOTKEY_CONFIG: Options = {
  preventDefault: true,
  enableOnFormTags: true,
};

export const DEFAULT_NODE_TEXT = "Best practices for looming:\n\n1. Save early, save often\n2. Have fun and be yourself\n3.";

export const DEFAULT_INIT_MODELS: ModelSettings[] = [
  {
    name: "davinci-002",
    id: "init0",
    apiURL: "https://api.openai.com/v1/completions",
    apiKey: "your-openai-api-key",
    maxLength: 16385,
    params: {
      temperature: 1,
      n: 3,
      max_tokens: 64,
      logprobs: 5
    }
  },
  {
    name: "mistralai/Mixtral-8x7B-v0.1",
    id: "init1",
    apiURL: "https://api.together.xyz/v1/completions",
    apiKey: "your-togetherai-api-key",
    maxLength: 128000,
    params: {
      temperature: 1,
      n: 3,
      max_tokens: 64,
      logprobs: 1
    }
  }
]