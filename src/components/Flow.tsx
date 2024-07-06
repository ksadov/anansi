import React from "react";
import { useShallow } from 'zustand/react/shallow';
import ReactFlow, { SelectionMode, Controls, MiniMap } from "reactflow";

import "reactflow/dist/style.css";

import useStore, { RFState } from './store';
import LoomNode from "./LoomNode"
import LayoutButton from "./LayoutButton";
import { on } from "events";

const selector = (state: RFState) => ({
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
  custom: LoomNode
};

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, layoutDagre } = useStore(
    useShallow(selector),
  );

  let onLayoutClick = () => {
    layoutDagre(); window.requestAnimationFrame(() => {
      myFitView();
    });
  };

  return (
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
  );
}

export default Flow;