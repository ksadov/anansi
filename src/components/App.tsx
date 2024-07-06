import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import Flow from './Flow';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../@/components/ui/resizable"


function App() {
  return (
    <div className="App">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={15}>One</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={85}>
          <Flow />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default memo(App);