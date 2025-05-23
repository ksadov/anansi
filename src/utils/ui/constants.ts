import { Options } from "react-hotkeys-hook";
import { v4 as uuid } from 'uuid';
import { getPlatformModifierKeyText } from "utils/ui/modkey";
import { ModelSettings } from "utils/logic/types";

export const HOTKEY_CONFIG: Options = {
  preventDefault: true,
  enableOnFormTags: false,
};

export const helpMenuKey = "h";
const helpMenuString = getPlatformModifierKeyText() + "+" + helpMenuKey;

export const DEFAULT_NODE_TEXT = "Quickstart:\n\n" +
  "1. Fill in API keys and model configurations in Settings > Models\n" +
  `2. Check the Help menu (${helpMenuString}) for shortcuts and documentation\n` +
  "3. Hit Generate to see how the selected model completes this node, or edit it to generate continuations " +
  "of your own text." +
  "\n4. If you notice dizziness, confusion or notions that your reality may itself be nothing more than one of many " +
  "possible completions generated by some vast language model, remember this helpful line: \""

export const DEFAULT_INIT_MODELS: ModelSettings[] = [
  {
    name: "davinci-002",
    id: uuid(),
    apiURL: "https://api.openai.com/v1/completions",
    apiKey: "",
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
    id: uuid(),
    apiURL: "https://api.together.xyz/v1/completions",
    apiKey: "",
    maxLength: 128000,
    params: {
      temperature: 1,
      n: 3,
      max_tokens: 64,
      logprobs: 1
    }
  },
  {
    name: "Meta-Llama-3-8B-Q4_5_M.gguf",
    id: uuid(),
    apiURL: "http://localhost:8009/v1/completions",
    apiKey: "",
    maxLength: 8192,
    params: {
      temperature: 1,
      max_tokens: 64,
      logprobs: 10
    }
  }
]

export const MAX_HISTORY_SIZE = 8;