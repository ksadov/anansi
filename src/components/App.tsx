import { useEffect, useState, memo } from "react";
import { useShallow } from 'zustand/react/shallow';
import { diff_match_patch } from "diff-match-patch";
import ReactFlow, { Controls, ReactFlowInstance, Node } from "reactflow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toaster, toast } from "sonner";
import NodeList from "components/searchlist/NodeList";
import Menubar from "components/menu/Menubar";
import "reactflow/dist/style.css";
import useStore, { RFState, disownedEdgeStyle } from '../utils/ui/store';
import LoomGraphNode from "components/graph/LoomGraphNode"
import LayoutButton from "components/graph/LayoutButton";
import NodeDetails from "components/details/NodeDetails";
import { AppState } from "utils/ui/types";
import { LoomNode } from "utils/logic/types";
import { addDiff } from "utils/logic/loomNode";
import { getPlatformModifierKey, getPlatformModifierKeyText } from "utils/ui/modkey";
import { initialThemePref, saveThemePref } from "utils/ui/theme";
import { useHotkeys } from "react-hotkeys-hook";
import { useDebouncedEffect } from "../utils/ui/debounce";
import { HOTKEY_CONFIG, helpMenuKey } from "utils/ui/constants";
import { navToParent, navToChild, navToSibling } from "utils/ui/navigate";
import {
  dumpTreeToFile,
  dumpSettingsToFile,
  triggerTreeUpload,
  triggerSettingsUpload,
  dumpTreeToJson
} from "utils/ui/importExport";
import { loadAppStateLocal, writeAppStateLocal } from "utils/ui/lstore";
import { debugGenerate, generate } from "utils/logic/callModel";

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
  initFromSavedTree: state.initFromSavedTree,
  initFromSaveAppState: state.initFromSavedAppState,
  deleteNode: state.deleteNode,
  modelsSettings: state.modelsSettings,
  setModelsSettings: state.setModelsSettings,
  setActiveModelIndex: state.setActiveModelIndex,
  activeModelIndex: state.activeModelIndex,
  createNewTreeSession: state.createNewTreeSession,
  takeSnapshot: state.takeSnapshot,
  undo: state.undo,
  redo: state.redo,
  canUndo: state.canUndo,
  canRedo: state.canRedo
});

const nodeTypes = {
  custom: LoomGraphNode
};

function focusElement(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.focus();
  }
}

function clickElement(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.click();
  }
}


function App() {
  const { loomNodes, nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, onConnect, spawnChildren,
    layoutDagre, focusedNodeId, setFocusedNodeId, focusedNodeVersion, setFocusedNodeVersion, initFromSavedTree,
    initFromSaveAppState, deleteNode, modelsSettings, setModelsSettings, activeModelIndex,
    setActiveModelIndex, createNewTreeSession, takeSnapshot, undo, redo, canUndo, canRedo } = useStore(
      useShallow(selector),
    );

  const focusedNode: LoomNode = loomNodes.find((node) => node.id === focusedNodeId) ?? loomNodes[0];
  const [needsReveal, setNeedsReveal] = useState(false);
  const [reactFlow, setReactFlow] = useState<ReactFlowInstance | null>(null);

  function initFromLocal(rf: ReactFlowInstance) {
    try {
      loadAppStateLocal(initFromSaveAppState);
      setReactFlow(rf);
      setTimeout(() =>
        window.requestAnimationFrame(() => {
          rf.fitView();
          setNeedsReveal(true);
        })
      );
    }
    catch (error) {
      toast.error(`Error restoring app state: ${error}. Starting new tree.`);
    }
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

  const [editEnabled, setEditEnabled] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false);
  const allowGenerate = !isGenerating && !editEnabled && activeModelIndex != null;

  async function spawnChildrenForFocusedNode() {
    if (allowGenerate) {
      const parentNode = focusedNode;
      const parentVersion = focusedNodeVersion ?? parentNode.diffs.length;
      setIsGenerating(true);
      try {
        const generation = await generate(focusedNode, modelsSettings[activeModelIndex], dmp);
        setIsGenerating(false);
        const newNodes = spawnChildren(parentNode.id, parentVersion, generation);
        window.requestAnimationFrame(() => {
          setViewForNodes(newNodes);
          setTimeout(() => {
            setNeedsReveal(true);
          }, 20);
        }
        );
      } catch (error) {
        setIsGenerating(false);
        toast.error("Generation failed: " + error);
      }
    }
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

  function saveEdit() {
    const version = (focusedNodeVersion == null) ? focusedNode.diffs.length : focusedNodeVersion;
    setEditEnabled(false);
    const text = (document.getElementById("editNodeText") as HTMLInputElement).value;
    if (text !== focusedNode.latestText) {
      editFocusedNode(text);
      setFocusedNodeVersion(version + 1);
    }
    // visually disown existing children by making edge between them dotted
    setEdges(
      edges.map((edge) => {
        if (edge.source === focusedNodeId) {
          edge.style = disownedEdgeStyle;
        }
        return edge;
      })
    );
  }

  function exportCurrentTree() {
    dumpTreeToFile(loomNodes);
  }

  function importTree() {
    takeSnapshot();
    triggerTreeUpload(initFromSavedTree, () => { autoLayout(); setTimeout(() => setNeedsReveal(true), 50); });
  }

  function exportSettings() {
    dumpSettingsToFile(modelsSettings);
  }

  function importSettings() {
    triggerSettingsUpload(setModelsSettings);
  }

  function newTree() {
    takeSnapshot();
    createNewTreeSession();
    setTimeout(autoLayout, 10);
    setTimeout(() => setNeedsReveal(true), 50);
  }

  /// Hotkey handling
  const modifierKey = getPlatformModifierKey();
  const modifierKeyText = getPlatformModifierKeyText();

  function useHotkeyWithDesc(key: string, description: string, callback: () => void) {
    const hotkey = `${modifierKey}+${key}`;
    const hotkeyText = `${modifierKeyText}+${key}`;
    useHotkeys(hotkey, callback, HOTKEY_CONFIG);
    return { key: hotkeyText, description: description };
  }

  const hotkeys = [];
  hotkeys.push(useHotkeyWithDesc("g", "Generate children for focused node", spawnChildrenForFocusedNode));
  hotkeys.push(useHotkeyWithDesc("d", "Delete focused node", () => deleteNode(focusedNodeId)));
  hotkeys.push(useHotkeyWithDesc("e", "Edit focused node",
    () => { focusElement("read-tab"); setEditEnabled(true); focusElement("editNodeText"); }));
  hotkeys.push(useHotkeyWithDesc("s", "Save focused node edit", saveEdit));
  hotkeys.push(useHotkeyWithDesc("up", "Navigate to parent of focused node",
    () => navToParent(focusedNode, setFocusedNodeId)));
  hotkeys.push(useHotkeyWithDesc("down", "Navigate to child of focused node",
    () => navToChild(focusedNode, setFocusedNodeId)));
  hotkeys.push(useHotkeyWithDesc("left", "Navigate to previous sibling of focused node",
    () => navToSibling(focusedNode, setFocusedNodeId, 'prev')));
  hotkeys.push(useHotkeyWithDesc("right", "Navigate to next sibling of focused node",
    () => navToSibling(focusedNode, setFocusedNodeId, 'next')));
  const exportDesc = useHotkeyWithDesc("s+shift", "export tree to file", exportCurrentTree);
  hotkeys.push(exportDesc);
  const importDesc = useHotkeyWithDesc("o+shift", "import tree from file", importTree);
  hotkeys.push(importDesc);
  hotkeys.push(useHotkeyWithDesc("l", "Auto-layout", autoLayout));
  hotkeys.push(useHotkeyWithDesc("0", "Reset zoom", () => reactFlow?.fitView()));
  hotkeys.push(useHotkeyWithDesc("f", "Focus search bar", () => focusElement("loom-search-input")));
  const newTreeDesc = useHotkeyWithDesc("k", "new tree (deletes current tree)", newTree);
  hotkeys.push(newTreeDesc);
  const undoDesc = useHotkeyWithDesc("z", "Undo", undo);
  hotkeys.push(undoDesc);
  const redoDesc = useHotkeyWithDesc("z+shift", "Redo", redo);
  hotkeys.push(redoDesc);
  hotkeys.push(useHotkeyWithDesc(helpMenuKey, "show hotkeys", () => clickElement("hotkey-menu-trigger")));

  const editCancelRef = useHotkeys<HTMLTextAreaElement>(`ctrl+c`, () => { setEditEnabled(false); }, HOTKEY_CONFIG);

  const [canSave, setCanSave] = useState(true);
  useDebouncedEffect(
    () => {
      if (canSave) {
        const appState: AppState = {
          modelsSettings: modelsSettings,
          activeModelIndex: activeModelIndex,
          focusedNodeId: focusedNodeId,
          focusedNodeVersion: focusedNodeVersion,
          loomTree: dumpTreeToJson(loomNodes)
        };
        const error = writeAppStateLocal(appState);
        if (error) {
          toast.error("Suspending local saving due to error: " + error);
          setCanSave(false);
        }
      }
    },
    1000, // 1 second.
    [nodes, edges, modelsSettings, activeModelIndex, focusedNodeId, focusedNodeVersion]
  );

  return (
    <div className="App">
      <div className={baseClasses}>
        <ResizablePanelGroup direction="horizontal">
          < ResizablePanel defaultSize={15} >
            <NodeList root_node={loomNodes[0]} setFocusedNodeId={setFocusedNodeWithViewport} />
          </ResizablePanel >
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={55}>
            <Menubar
              theme={theme}
              setTheme={setTheme}
              importTree={importTree}
              exportCurrentTree={exportCurrentTree}
              modelsSettings={modelsSettings}
              setModelsSettings={setModelsSettings}
              setActiveModelIndex={setActiveModelIndex}
              activeModelIndex={activeModelIndex}
              newTree={newTree}
              exportSettings={exportSettings}
              importSettings={importSettings}
              isGenerating={isGenerating}
              hotkeys={hotkeys}
              canUndo={canUndo}
              canRedo={canRedo}
              undo={undo}
              redo={redo}
              importKey={importDesc.key}
              exportKey={exportDesc.key}
              newTreeKey={newTreeDesc.key}
              undoKey={undoDesc.key}
              redoKey={redoDesc.key}
            />
            <div className="h-[calc(100vh-40px)]">
              <ReactFlow
                className="bg-card"
                nodes={nodes}
                edges={edges}
                onInit={initFromLocal}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                minZoom={0.01}
                fitView
                nodesConnectable={false}
                edgesFocusable={false}
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
              isGenerating={isGenerating}
            />
          </ResizablePanel>
        </ResizablePanelGroup >
        <Toaster />
      </div>
    </div>
  );
}

export default memo(App);