A React-based implementation of the [Loom](https://generative.ink/posts/loom-interface-to-the-multiverse/) interface for LLM completion inference. You can try it out [here](https://www.ksadov.com/anansi/).

## Docs
Real documentation coming soon, hopefully. In the meantime, some pointers:
- Graph view uses [ReactFlow's default viewport controls](https://reactflow.dev/learn/concepts/the-viewport#default-viewport-controls)
- Model inference is designed for compatibility with [OpenAI v1 completion API](https://platform.openai.com/docs/api-reference/completions). It should work with non-OpenAI URLs (like [Together AI](https://docs.together.ai/reference/completions)) as long as the implement the above API.
- That being said, every v1 completion API provider seems to have weird idiosyncratic quirks in which arguments they'll allow. In order to avoid having to keep track of which provider does what, the Settings menu allows you to specify generation parameters (like temperature and number of completions) on a per-model basis as a JSON dict.
- The interface will automatically save tree data and settings to localStorage every second. But don't rely on this: download your trees (File > Export to savefile) and model settings (Settings > Models > Export settings) locally when you can.

## Run locally

1. cd into the project directory and run `npm install`
2. `npm start`
3. Open [http://localhost:3000](http://localhost:3000) in your browser. Changes to the code will be automatically reflected 

If you want to mess with the CSS, [install tailwind](https://tailwindcss.com/docs/installation) and run `npx tailwindcss -i ./src/input.css -o ./src/output.css --watch`

I used the [Create React App](https://github.com/facebook/create-react-app) to make this thing, so it should obey the commands outlined there. 

## To do
- logprob view
- edges between edited node and pre-edit children should look different
- less ugly color scheme(s?)
- undo button
- compress state stored to localStorage
- navigate graph view via keybindings
- llama.cpp compatability

## Acknowledgements 
* https://github.com/socketteer/loom: inspiration for GUI and features
* https://github.com/paradigmxyz/flux: inspiration for interactive graph view and localStorage autosave
* https://github.com/JD-P/minihf: inspiration for [diff-match-patch](https://github.com/google/diff-match-patch)-based version control for tree nodes