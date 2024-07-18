import { NodeProps, Handle, Position } from 'reactflow';
import { NodeGraphData } from "utils/ui/types"
import { defaultLoomNodeWidth } from "utils/ui/layout"

function LoomGraphNode({ data }: NodeProps<NodeGraphData>) {
  const borderHighlight = data.loomNode.inFocus ? "ring" : "";
  const invisibleString = data.invisible ? "invisible" : "";
  return (
    <div className={invisibleString}>
      <Handle type="target" position={Position.Top} />
      <div
        className={"bg-accent text-accent-foreground rounded-md p-2 " + borderHighlight}
        onClick={data.focusNode}>
        <div className={`w-[200px] truncate`}>
          {data.loomNode.latestText}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

export default LoomGraphNode;