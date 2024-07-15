import { NodeProps, Handle, Position } from 'reactflow';
import { NodeGraphData } from "./types"
import { textPreview } from "./utils"

function LoomGraphNode({ data }: NodeProps<NodeGraphData>) {
  const borderHighlight = data.loomNode.inFocus ? "ring" : "";
  const invisibleString = data.invisible ? "invisible" : "";
  return (
    <div className={invisibleString}>
      <Handle type="target" position={Position.Top} />
      <div
        className={"border-2 rounded-md p-2 " + borderHighlight}
        onClick={data.focusNode}>
        <div>
          {textPreview(data.loomNode.latestText)}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default LoomGraphNode;