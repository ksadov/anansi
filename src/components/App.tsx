import { memo } from "react";
import { NodeProps, Position } from "reactflow";
import Flow from './Flow';


function App() {
  return (
    <div className="App">
      <Flow />
    </div>
  );
}

export default memo(App);