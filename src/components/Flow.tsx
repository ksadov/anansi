import React, { useEffect, useState } from "react";
import { useShallow } from 'zustand/react/shallow';
import { diff_match_patch } from "diff-match-patch";
import ReactFlow, { SelectionMode, Controls, Rect } from "reactflow";
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
import { addDiff } from "./loomNode"
import { initialThemePref } from "./utils"

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
  setFocusedNodeId: state.setFocusedNodeId,
  focusedNodeVersion: state.focusedNodeVersion,
  setFocusedNodeVersion: state.setFocusedNodeVersion,
  initFromSaveFile: state.initFromSaveFile
});

// TODO: somehow manage view state in store
var myFitView = () => { };
var myFitBounds = (bounds: Rect, padding: number) => { }

const onInit = (reactFlowInstance: any) => {
  myFitView = () => reactFlowInstance.fitView();
  myFitBounds = (bounds: Rect, padding: number) => reactFlowInstance.fitBounds(bounds, padding);
};

const nodeTypes = {
  custom: LoomGraphNode
};

function Flow() {
  const { loomNodes, nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect, spawnChildren, layoutDagre,
    focusedNodeId, setFocusedNodeId, focusedNodeVersion, setFocusedNodeVersion, initFromSaveFile } = useStore(
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

  function editFocusedNode(text: string) {
    setNodes(
      nodes.map((node) => {
        if (node.id === focusedNodeId) {
          addDiff(node.data.loomNode, text, dmp);
          node.data = {
            ...node.data,
          };
        }
        return node;
      })
    );
  }

  function getBoundingRect(positions: { x: number, y: number }[]): Rect {
    let minX = positions[0].x;
    let minY = positions[0].y;
    let maxX = positions[0].x;
    let maxY = positions[0].y;
    for (let i = 1; i < positions.length; i++) {
      if (positions[i].x < minX) {
        minX = positions[i].x;
      }
      if (positions[i].y < minY) {
        minY = positions[i].y;
      }
      if (positions[i].x > maxX) {
        maxX = positions[i].x;
      }
      if (positions[i].y > maxY) {
        maxY = positions[i].y;
      }
    }
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }

  function spawnChildrenForFocusedNode() {
    const nodePositions = spawnChildren(focusedNodeId, (focusedNodeVersion == null) ? focusedNode.diffs.length : focusedNodeVersion);
    const boundingRect: Rect = getBoundingRect(nodePositions);
    window.requestAnimationFrame(() => {
      myFitBounds(boundingRect, 0.1);
    }
    );
  }

  let onLayoutClick = () => {
    layoutDagre(); window.requestAnimationFrame(() => {
      myFitView();
    });
  };

  const [theme, setTheme] = useState(initialThemePref());
  // Use this solution for themes: https://stackoverflow.com/a/70480061
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  })
  const baseClasses = "h-full w-full";

  const [dmp] = useState(new diff_match_patch())

  return (
    <div className={baseClasses}>
      <ResizablePanelGroup direction="horizontal">
        < ResizablePanel defaultSize={15} >
          <LoomList root_node={loomNodes[0]} setFocusedNodeId={setFocusedNodeId} />
        </ResizablePanel >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55}>
          <LoomMenu
            loomNodes={loomNodes}
            theme={theme}
            setTheme={setTheme}
            initFromSaveFile={initFromSaveFile}
          />
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
            setVersion={focusedNodeVersion}
            editFocusedNode={editFocusedNode}
            setFocusedNodeVersion={setFocusedNodeVersion}
            spawnChildren={spawnChildrenForFocusedNode}
            setFocusedNodeId={setFocusedNodeId}
            dmp={dmp}
          />
        </ResizablePanel>
      </ResizablePanelGroup >
    </div>
  );
}

export default Flow;