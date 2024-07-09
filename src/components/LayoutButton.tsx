import ReactFlow, { Controls, ControlButton } from 'reactflow'
import { ImTree } from "react-icons/im";

export default function LayoutButton(layoutCallback: { layoutCallback: () => void }) {
  return (
    <ControlButton className="text-black"
      onClick={layoutCallback.layoutCallback}
    >
      <ImTree />
    </ControlButton>
  )
}