import React, { useEffect } from "react";
import { useShallow } from 'zustand/react/shallow';
import ReactFlow, { SelectionMode, Controls, MiniMap } from "reactflow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../@/components/ui/resizable"
import LoomList from "./LoomList";
import LoomMenu from "./LoomMenu";

import "reactflow/dist/style.css";

import useStore, { RFState } from './store';
import LoomGraphNode from "./LoomGraphNode"
import LayoutButton from "./LayoutButton";
import NodeDetails from "./NodeDetails";

import { LoomNode } from "./types";

import { on } from "events";

const selector = (state: RFState) => ({
  loomNodes: state.loomNodes,
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  dagreGraph: state.dagreGraph,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  spawnChildren: state.spawnChildren,
  layoutDagre: state.layoutDagre,
  focusedNodeId: state.focusedNodeId,
  setFocusedNodeId: state.setFocusedNodeId
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
  const { loomNodes, nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect, spawnChildren, layoutDagre,
    focusedNodeId, setFocusedNodeId } = useStore(
      useShallow(selector),
    );

  const focusedNode: LoomNode = loomNodes.find((node) => node.id === focusedNodeId) ?? loomNodes[0];

  useEffect(() => {
    setNodes(
      nodes.map((node) => {
        if (node.id === focusedNodeId) {
          node.data.loomNode.inFocus = true;
          node.data = {
            ...node.data,
          };
          console.log("Focused on node: ", node.id);
        }
        else if (node.data.loomNode.inFocus) {
          node.data.loomNode.inFocus = false;
          node.data = {
            ...node.data,
          };
        }
        return node;
      })
    );
  }, [focusedNodeId, setNodes]);

  function setFocusedNodeText(text: string) {
    setNodes(
      nodes.map((node) => {
        if (node.id === focusedNodeId) {
          node.data.loomNode.text = text;
          node.data = {
            ...node.data,
          };
        }
        return node;
      })
    );
  }

  function spawnChildrenForFocusedNode() {
    spawnChildren(focusedNodeId);
  }

  let onLayoutClick = () => {
    layoutDagre(); window.requestAnimationFrame(() => {
      myFitView();
    });
  };

  return (
    <div className="h-screen w-screen bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
      <ResizablePanelGroup direction="horizontal">
        < ResizablePanel defaultSize={15} >
          <LoomList root_node={loomNodes[0]} setFocusedNodeId={setFocusedNodeId} />
        </ResizablePanel >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55}>
          <LoomMenu></LoomMenu>
          <div className="h-[calc(100vh-40px)]">
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
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <NodeDetails
            loomNode={focusedNode}
            setFocusedNodeText={setFocusedNodeText}
            spawnChildren={spawnChildrenForFocusedNode}
          />
        </ResizablePanel>
      </ResizablePanelGroup >
    </div>
  );
}

export default Flow;