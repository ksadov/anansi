import React from "react";
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeData } from "./types"

function LoomNode({ data }: NodeProps<NodeData>) {

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div >
        <div>
          <textarea
            name="text"
            defaultValue={data.text}
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

export default LoomNode;