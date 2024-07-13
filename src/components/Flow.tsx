import React, { useEffect, useState } from "react";
import { useShallow } from 'zustand/react/shallow';
import { diff_match_patch } from "diff-match-patch";
import ReactFlow, { SelectionMode, Controls, ReactFlowInstance, Node } from "reactflow";
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

import { LoomNode, AppState } from "./types";
import { addDiff } from "./loomNode"
import { initialThemePref, saveThemePref, getPlatformModifierKey, getPlatformModifierKeyText }
  from "./utils"
import { useHotkeys } from "react-hotkeys-hook";
import { useDebouncedEffect } from "./debounce";
import { HOTKEY_CONFIG } from "./constants";
import { navToParent, navToChild, navToSibling } from "./navigate"
import { dumpToFile, triggerUpload, dumpToJson } from "./treeSave"
import { loadAppStateLocal, writeAppStateLocal } from "./lstore";

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
  initFromSaveFile: state.initFromSaveFile,
  deleteNode: state.deleteNode,
  modelsSettings: state.modelsSettings,
  setModelsSettings: state.setModelsSettings,
  setActiveModelIndex: state.setActiveModelIndex,
  activeModelIndex: state.activeModelIndex
});

const nodeTypes = {
  custom: LoomGraphNode
};

function focusElement(id: string) {
  const searchBar = document.getElementById(id);
  if (searchBar) {
    searchBar.focus();
  }
}


function Flow() {
  const { loomNodes, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, spawnChildren,
    layoutDagre, focusedNodeId, setFocusedNodeId, focusedNodeVersion, setFocusedNodeVersion, initFromSaveFile,
    deleteNode, modelsSettings, setModelsSettings, activeModelIndex, setActiveModelIndex } = useStore(
      useShallow(selector),
    );

  const focusedNode: LoomNode = loomNodes.find((node) => node.id === focusedNodeId) ?? loomNodes[0];
  const [needsReveal, setNeedsReveal] = useState(false);
  const [reactFlow, setReactFlow] = useState<ReactFlowInstance | null>(null);

  function initFromLocal(rf: ReactFlowInstance) {
    loadAppStateLocal(initFromSaveFile);
    setReactFlow(rf);
    setTimeout(() =>
      window.requestAnimationFrame(() => {
        rf.fitView();
        setNeedsReveal(true);
      })
    );
  }

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
    const viewport = reactFlow?.getViewport();
    window.requestAnimationFrame(() => { reactFlow?.fitView({ nodes: n, duration: 0, maxZoom: viewport?.zoom }); });
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

  let autoLayout = () => {
    layoutDagre(); window.requestAnimationFrame(() => {
      reactFlow?.fitView();
    });
  };

  const [theme, setTheme] = useState(initialThemePref());
  // Use this solution for themes: https://stackoverflow.com/a/70480061
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveThemePref(theme);
  })
  const baseClasses = "h-full w-full";

  const [dmp] = useState(new diff_match_patch())

  const [editEnabled, setEditEnabled] = useState(false)

  function saveEdit() {
    const version = (focusedNodeVersion == null) ? focusedNode.diffs.length : focusedNodeVersion;
    setEditEnabled(false);
    const text = (document.getElementById("editNodeText") as HTMLInputElement).value;
    if (text != focusedNode.latestText) {
      editFocusedNode(text);
      setFocusedNodeVersion(version + 1);
    }
  }

  function exportCurrentTree() {
    dumpToFile(loomNodes);
  }

  function importTree() {
    triggerUpload(initFromSaveFile, () => { autoLayout(); setTimeout(() => setNeedsReveal(true), 50); });
  }

  /// Hotkey handling
  const modifierKey = getPlatformModifierKey();
  const modifierKeyText = getPlatformModifierKeyText();

  useHotkeys(`${modifierKey}+g`, spawnChildrenForFocusedNode, HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+up`, () => navToParent(focusedNode, setFocusedNodeId), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+down`, () => navToChild(focusedNode, setFocusedNodeId), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+left`, () => navToSibling(focusedNode, setFocusedNodeId, 'prev'), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+right`, () => navToSibling(focusedNode, setFocusedNodeId, 'next'), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+e`, () => { focusElement("read-tab"); setEditEnabled(true); focusElement("editNodeText"); }, HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+s`, saveEdit, HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+l`, autoLayout, HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+f`, () => focusElement("loom-search-input"), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+i`, () => focusElement("info-tab"), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+r`, () => focusElement("read-tab"), HOTKEY_CONFIG);
  useHotkeys(`${modifierKey}+d`, () => deleteNode(focusedNodeId), HOTKEY_CONFIG);
  const editCancelRef = useHotkeys<HTMLTextAreaElement>(`ctrl+c`, () => { setEditEnabled(false); }, HOTKEY_CONFIG);

  //// Saving

  const isSaving = useDebouncedEffect(
    () => {
      const appState: AppState = {
        modelsSettings: modelsSettings,
        activeModelIndex: activeModelIndex,
        focusedNodeId: focusedNodeId,
        focusedNodeVersion: focusedNodeVersion,
        loomTree: dumpToJson(loomNodes)
      };
      writeAppStateLocal(appState);
    },
    1000, // 1 second.
    [reactFlow, nodes, edges]
  );

  return (
    <div className={baseClasses}>
      <ResizablePanelGroup direction="horizontal">
        < ResizablePanel defaultSize={15} >
          <LoomList root_node={loomNodes[0]} setFocusedNodeId={setFocusedNodeWithViewport} />
        </ResizablePanel >
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55}>
          <LoomMenu
            theme={theme}
            setTheme={setTheme}
            importTree={importTree}
            exportCurrentTree={exportCurrentTree}
            modelsSettings={modelsSettings}
            setModelsSettings={setModelsSettings}
            setActiveModelIndex={setActiveModelIndex}
            activeModelIndex={activeModelIndex}
          />
          <div className="h-[calc(100vh-40px)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onInit={initFromLocal}
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
                <LayoutButton layoutCallback={autoLayout} />
              </Controls>
            </ReactFlow>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30}>
          <NodeDetails
            loomNode={focusedNode}
            setVersion={focusedNodeVersion}
            setFocusedNodeVersion={setFocusedNodeVersion}
            spawnChildren={spawnChildrenForFocusedNode}
            setFocusedNodeId={setFocusedNodeWithViewport}
            dmp={dmp}
            editEnabled={editEnabled}
            setEditEnabled={setEditEnabled}
            saveEdit={saveEdit}
            editCancelRef={editCancelRef}
            deleteNode={() => deleteNode(focusedNodeId)}
          />
        </ResizablePanel>
      </ResizablePanelGroup >
    </div>
  );
}

export default Flow;