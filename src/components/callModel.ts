import { patchToVersion } from './loomNode';
import { LoomNode, ModelSettings, Generation } from './types';
export async function callModel(apiURL: string, modelName: string, apiKey: string | null, prompt: string, genParams: any) {
  return fetch(apiURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey ? `Bearer ${apiKey}` : ''
    },
    body: JSON.stringify({
      model: modelName,
      prompt: prompt,
      stream: false,
      echo: false,
      ...genParams
    })
  }).then(response => response.json());
}

export async function debugGenerate(loomNode: LoomNode, modelSettings: ModelSettings, dmp: any): Promise<Generation[]> {
  const prompt = patchToVersion(loomNode, loomNode.diffs.length, dmp);
  const dummyGeneration = {
    text: "Debug generation " + Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    model: { name: modelSettings.name, apiURL: modelSettings.apiURL, params: modelSettings.params },
    logits: [],
    prompt: prompt,
    finishReason: "debug",
    rawResponse: "debug"
  }
  return [dummyGeneration];
}

export async function generate(loomNode: LoomNode, modelSettings: ModelSettings, dmp: any): Promise<Generation[]> {
  const prompt = patchToVersion(loomNode, loomNode.diffs.length, dmp);
  const response = await callModel(modelSettings.apiURL, modelSettings.name, modelSettings.apiKey, prompt,
    modelSettings.params);
  return response.choices.map((choice: any) => {
    return {
      text: choice.text,
      timestamp: response.created,
      model: { name: modelSettings.name, apiURL: modelSettings.apiURL, params: modelSettings.params },
      logits: choice.logprobs.map((logprob: number, index: number) => {
        return { token: choice.tokens[index], logprob: logprob }
      }),
      prompt: prompt,
      finishReason: response.finish_reason,
      rawResponse: JSON.stringify(response)
    }
  }
  );
}