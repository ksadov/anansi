import { toast } from "sonner"
import { patchToVersion } from './loomNode';
import { LoomNode, ModelSettings, Generation, Logit } from './types';

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

function constructLogits(tokens: string[], tokenLogprobs: number[], topLogprobs: { string: number }): Logit[][] {
  const responseLogprobs: Logit[] = tokens.map((token: string, i: number) => {
    return {
      token: token,
      logprob: tokenLogprobs[i]
    }
  });
  const logitList: Logit[] = Object.entries(topLogprobs).map(([token, logprob]: [string, number]) => {
    return {
      token: token,
      logprob: logprob
    }
  });
  const allLogits = logitList.map((logit: Logit) => {
    return [logit, ...responseLogprobs];
  }
  );
  return allLogits;
}

export async function generate(loomNode: LoomNode, modelSettings: ModelSettings, dmp: any): Promise<Generation[]> {
  const prompt = patchToVersion(loomNode, loomNode.diffs.length, dmp);
  const response = await callModel(modelSettings.apiURL, modelSettings.name, modelSettings.apiKey, prompt,
    modelSettings.params);
  if (response.error) {
    const failMessage = `Model ${modelSettings.name} generation failed with code ${response.error.code}: ${response.error.message}`;
    toast.error(failMessage);
    return [];
  }
  return response.choices.map((choice: any) => {
    return {
      text: choice.text,
      timestamp: response.created,
      model: { name: modelSettings.name, apiURL: modelSettings.apiURL, params: modelSettings.params },
      logits: constructLogits(choice.logprobs.tokens, choice.logprobs.token_logprobs, choice.logprobs.top_logprobs),
      prompt: prompt,
      finishReason: response.finish_reason,
      rawResponse: JSON.stringify(response)
    }
  }
  );
}