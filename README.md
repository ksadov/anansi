A React-based implementation of the [Loom](https://generative.ink/posts/loom-interface-to-the-multiverse/) interface for LLM completion inference.

## Run locally

I used the [Create React App](https://github.com/facebook/create-react-app) to make this thing, so it should obey the commands outlined there. 

### Development mode
1. cd into the project directory and run
2. `npm start`
3. Open [http://localhost:3000](http://localhost:3000) in your browser. Changes to the code will be automatically reflected 

If you want to mess with the CSS, [install tailwind](https://tailwindcss.com/docs/installation) and run `npx tailwindcss -i ./src/input.css -o ./src/output.css --watch`

### Build
TODO

## To do
- logprob view
- edges between edited node and pre-edit children should look different
- less ugly color scheme(s?)
- navigate graph view via keybindings
- compress state stored to localStorage

## Acknowledgements 
* https://github.com/socketteer/loom: inspiration for GUI and features
* https://github.com/paradigmxyz/flux: inspiration for interactive graph view and localStorage autosave
* https://github.com/JD-P/minihf: inspiration for [diff-match-patch](https://github.com/google/diff-match-patch)-based version control for tree nodes