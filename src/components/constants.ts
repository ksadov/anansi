import { Options } from "react-hotkeys-hook";
import { ModelSettings } from "./types";

export const HOTKEY_CONFIG: Options = {
  preventDefault: true,
  enableOnFormTags: true,
};

export const DEFAULT_NODE_TEXT = "Quickstart:\n\n1. Fill in API keys and model configurations in Settings > Models\n" +
  "2. Check the Hotkey menu for shortcuts\n3. Hit Generate to see how the selected model completes this node, or " +
  "edit it to generate continuations of your own text.\n4. If you notice dizziness, confusion or doubts that your " +
  "reality may itself be nothing more than one of many possible completions generated by some vast language model, " +
  "remember this helpful line: \""

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