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