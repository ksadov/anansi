import React from "react";
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeGraphData } from "./types"

function LoomGraphNode({ data }: NodeProps<NodeGraphData>) {

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div >
        <div>
          <textarea
            name="text"
            defaultValue={data.loomNode.text}
          />
        </div>
        <div>
          <button
            onClick={data.generateCallback}
          >
            Generate
          </button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
};

export default LoomGraphNode;