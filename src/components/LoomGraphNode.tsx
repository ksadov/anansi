import React from "react";
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeGraphData } from "./types"

function textPreview(text: string): string {
  return text.length > 10 ? text.slice(0, 10) + "..." : text;
}

function LoomGraphNode({ data }: NodeProps<NodeGraphData>) {
  const borderHighlight = data.loomNode.inFocus ? "2px solid red" : "";
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={{ border: borderHighlight }} onClick={data.focusNode}>
        <div>
          {textPreview(data.loomNode.text)}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default LoomGraphNode;