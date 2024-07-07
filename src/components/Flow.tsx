import React from "react";
import { useShallow } from 'zustand/react/shallow';
import ReactFlow, { SelectionMode, Controls, MiniMap } from "reactflow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../@/components/ui/resizable"
import LoomList from "./LoomList";

import "reactflow/dist/style.css";

import useStore, { RFState } from './store';
import LoomGraphNode from "./LoomGraphNode"
import LayoutButton from "./LayoutButton";
import { on } from "events";

const selector = (state: RFState) => ({
  loomNodes: state.loomNodes,
  nodes: state.nodes,
  edges: state.edges,
  dagreGraph: state.dagreGraph,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  layoutDagre: state.layoutDagre
});

// TODO: somehow manage view state in store
var myFitView = () => { };

const onInit = (reactFlowInstance: any) => {
  myFitView = () => reactFlowInstance.fitView();
};

const nodeTypes = {
  custom: LoomGraphNode
};

function Flow() {
  const { loomNodes, nodes, edges, onNodesChange, onEdgesChange, onConnect, layoutDagre } = useStore(
    useShallow(selector),
  );

  let onLayoutClick = () => {
    layoutDagre(); window.requestAnimationFrame(() => {
      myFitView();
    });
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={15}>
        <LoomList root_node={loomNodes[0]} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={85}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onInit={onInit}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          minZoom={0.01}
          fitView
          panOnScroll
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          panOnDrag={[1, 2]}
        >
          <Controls>
            <LayoutButton layoutCallback={onLayoutClick} />
          </Controls>
        </ReactFlow>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default Flow;