import React from "react";
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeGraphData } from "./types"
import { textPreview } from "./utils"

function LoomGraphNode({ data }: NodeProps<NodeGraphData>) {
  const borderHighlight = data.loomNode.inFocus ? "ring" : "";
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div
        className={"border-2 rounded-md p-2 " + borderHighlight}
        onClick={data.focusNode}>
        <div>
          {textPreview(data.loomNode.originalText)}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default LoomGraphNode;