import React from "react";
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeGraphData } from "./types"

function textPreview(text: string): string {
  return text.length > 16 ? text.slice(0, 16) + "..." : text;
}

function LoomGraphNode({ data }: NodeProps<NodeGraphData>) {
  const borderHighlight = data.loomNode.inFocus ? "ring" : "";
  return (
    <div>
      <Handle type="target" position={Position.Top} />
      <div
        className={"border-2 border-slate-500 rounded-md p-2 " + borderHighlight}
        onClick={data.focusNode}>
        <div>
          {textPreview(data.loomNode.text)}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default LoomGraphNode;