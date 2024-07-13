import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import Flow from './Flow';
import { Toaster } from "../@/components/ui/sonner"


function App() {
  return (
    <div className="App">
      <Flow />
      <Toaster />
    </div>
  );
}

export default memo(App);