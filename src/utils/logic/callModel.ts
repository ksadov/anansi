import { toast } from "sonner"
import { patchToVersion } from 'utils/logic/loomNode';
import { LoomNode, ModelSettings, Generation, Logprob } from 'utils/logic/types';

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
      ...genParams
    })
  }).then(response => response.json());
}

export async function debugGenerate(loomNode: LoomNode, modelSettings: ModelSettings, dmp: any): Promise<Generation[]> {
  const patchedText = patchToVersion(loomNode, loomNode.diffs.length, dmp);
  const sliceStartIndex = Math.max(0, patchedText.length - modelSettings.maxLength);
  const prompt = patchedText.slice(sliceStartIndex);
  const dummyGeneration = {
    text: "Debug generation " + Math.random().toString(36).substring(7),
    timestamp: Date.now(),
    model: { name: modelSettings.name, apiURL: modelSettings.apiURL, params: modelSettings.params },
    logprobs: null,
    prompt: prompt,
    finishReason: "debug",
    rawResponse: "debug"
  }
  return [dummyGeneration];
}

export async function generate(loomNode: LoomNode, modelSettings: ModelSettings, dmp: any): Promise<Generation[]> {
  const patchedText = patchToVersion(loomNode, loomNode.diffs.length, dmp);
  const sliceStartIndex = Math.max(0, patchedText.length - modelSettings.maxLength);
  const prompt = patchedText.slice(sliceStartIndex);
  const response = await callModel(modelSettings.apiURL, modelSettings.name, modelSettings.apiKey, prompt,
    modelSettings.params);
  if (response.error) {
    const failMessage = `Model ${modelSettings.name} generation failed with code ${response.error.code}: ${response.error.message}`;
    throw new Error(failMessage);
  }
  else if (!response.choices || response.choices.length === 0) {
    const fail_reason = response.detail ? response.detail.toString() : "No choices returned";
    const failMessage = `Model ${modelSettings.name} generation failed: ${fail_reason}`;
    throw new Error(failMessage);
  }
  else {
    return response.choices.map((choice: any) => {
      const textLogprobs: Logprob[] = choice.logprobs ? choice.logprobs.tokens.map((token: string, i: number) => {
        return { token: token, lp: choice.logprobs.token_logprobs[i] }
      }) : null;
      const topLogprobDictArray: any[] = choice.logprobs ? choice.logprobs.top_logprobs : null;
      const topLogprobs: Logprob[][] | null = topLogprobDictArray ? topLogprobDictArray.map((topLogprobDict: any) => {
        return Object.keys(topLogprobDict).map((token: string) => {
          return { token: token, lp: topLogprobDict[token] }
        });
      }) : null;
      const logprobs = choice.logprobs ? { text: textLogprobs, top: topLogprobs } : null;
      return {
        text: choice.text,
        timestamp: response.created,
        model: { name: modelSettings.name, apiURL: modelSettings.apiURL, params: modelSettings.params },
        logprobs: logprobs,
        prompt: prompt,
        finishReason: response.finish_reason,
        rawResponse: JSON.stringify(response)
      }
    }
    );
  }
}