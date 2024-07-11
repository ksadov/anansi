import React, { useEffect, useState } from "react";
import { useShallow } from 'zustand/react/shallow';
import { diff_match_patch } from "diff-match-patch";
import ReactFlow, { SelectionMode, Controls, Rect, Viewport, Node } from "reactflow";
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
import { initialThemePref, getPlatformModifierKey, getPlatformModifierKeyText }
  from "./utils"
import { useHotkeys } from "react-hotkeys-hook";
import { HOTKEY_CONFIG } from "./constants";

import { on } from "events";
import { get } from "http";

const selector = (state: RFState) => ({
  loomNodes: state.loomNodes,
  nodes: state.nodes,
  edges: state.edges,
  setNodes: state.setNodes,
  setEdges: state.setEdges,
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

var myFitView = (options?: any) => { };
var myGetViewport = () => { { return { x: 0, y: 0, zoom: 1 }; } };

const onInit = (reactFlowInstance: any) => {
  myFitView = (options?) => reactFlowInstance.fitView(options);
  myGetViewport = () => reactFlowInstance.getViewport();
};

const nodeTypes = {
  custom: LoomGraphNode
};

function Flow() {
  const { loomNodes, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, spawnChildren, layoutDagre,
    focusedNodeId, setFocusedNodeId, focusedNodeVersion, setFocusedNodeVersion, initFromSaveFile } = useStore(
      useShallow(selector),
    );

  const focusedNode: LoomNode = loomNodes.find((node) => node.id === focusedNodeId) ?? loomNodes[0];
  const [needsReveal, setNeedsReveal] = useState(false);

  // Reveal nodes and edges after view for newly-generated nodes has been set
  // otherwise we get a flash of the nodes and edges in their initial positions
  useEffect(() => {
    if (needsReveal) {
      setNodes(
        nodes.map((node) => {
          node.data.invisible = false;
          node.data = {
            ...node.data
          };
          return node;
        })
      );
      setEdges(
        edges.map((edge) => {
          edge.hidden = false;
          return edge;
        })
      );
      setNeedsReveal(false);
    }
  }, [needsReveal, setNodes, setEdges]);

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

  function setViewForNodes(n: Node[]) {
    const viewport = myGetViewport();
    window.requestAnimationFrame(() => { myFitView({ nodes: n, duration: 0, maxZoom: viewport.zoom }); });
  }

  function spawnChildrenForFocusedNode() {
    const newNodes = spawnChildren(focusedNodeId, (focusedNodeVersion == null) ? focusedNode.diffs.length : focusedNodeVersion);
    window.requestAnimationFrame(() => {
      setViewForNodes(newNodes);
      setTimeout(() => {
        setNeedsReveal(true);
      }, 20);
    }
    );
  }

  function setFocusedNodeWithViewport(nodeId: string) {
    setFocusedNodeId(nodeId);
    window.requestAnimationFrame(() => {
      const focusedNode = nodes.find((node) => node.id === nodeId);
      if (focusedNode) {
        setViewForNodes([focusedNode]);
      }
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

  /// Hotkey handling
  const modifierKey = getPlatformModifierKey();
  const modifierKeyText = getPlatformModifierKeyText();

  useHotkeys(`${modifierKey}+g`, spawnChildrenForFocusedNode, HOTKEY_CONFIG);

  return (
    <div className={baseClasses}>
      <ResizablePanelGroup direction="horizontal">
        < ResizablePanel defaultSize={15} >
          <LoomList root_node={loomNodes[0]} setFocusedNodeId={setFocusedNodeWithViewport} />
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
            setFocusedNodeId={setFocusedNodeWithViewport}
            dmp={dmp}
          />
        </ResizablePanel>
      </ResizablePanelGroup >
    </div>
  );
}

export default Flow;