import { memo } from "react";
import Flow from './Flow';
import { Toaster } from "@/components/ui/sonner"


function App() {
  return (
    <div className="App">
      <Flow />
      <Toaster />
    </div>
  );
}

export default memo(App);