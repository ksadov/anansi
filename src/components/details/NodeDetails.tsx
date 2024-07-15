import { useRef, useEffect } from "react"
import { ChevronsUpDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoomNode } from "components/types"
import { constructLineage, patchToVersion } from "components/loomNode"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Loader from "@/components/ui/loadingspinner"
import NodeLink from "components/common/NodeLink"

function addBreaks(text: string) {
  const split = text.split('\n')
  // don't add a break after the last line
  return split.map((str, index) => {
    return <span key={index}>{str}{index == split.length - 1 ? null : <br />}</span>
  })
}
function constructReadTree(loomNode: LoomNode, dmp: any, setFocusedNodeId: (id: string, version?: number) => void) {
  const lineage = constructLineage(loomNode);
  const ancestorLinks = lineage.map((node) =>
    <NodeLink
      text={addBreaks(patchToVersion(node.loomNode, node.version, dmp))}
      nodeId={node.loomNode.id}
      version={node.version}
      setFocusedNodeId={setFocusedNodeId}
      key={node.loomNode.id + node.version}
    />
  )
  return (
    <span>
      {ancestorLinks}
    </span>
  )

}

function VersionSelectContent(loomNode: LoomNode) {
  const options = [];
  for (let i = -1; i < loomNode.diffs.length; i++) {
    const valueString = (i + 1).toString();
    options.push(<SelectItem key={valueString} value={valueString}>{"v" + valueString}</SelectItem>)
  }
  return (
    <SelectContent>
      {options}
    </SelectContent>
  )
}

function ReadView(
  editEnabled: boolean,
  setEditEnabled: (enabled: boolean) => void,
  loomNode: LoomNode, setVersion: number | null,
  setFocusedNodeVersion: (version: number) => void,
  setFocusedNodeId: (id: string) => void,
  dmp: any,
  saveEdit: () => void,
  editCancelRef: React.RefObject<HTMLTextAreaElement>
) {
  const setFocusedNode = (id: string, version?: number) => { setFocusedNodeId(id); setFocusedNodeVersion(version ?? 0) }
  const previousRead = <span className="opacity-65">{constructReadTree(loomNode, dmp, setFocusedNode)}</span>
  const version = (setVersion == null) ? loomNode.diffs.length : setVersion;
  const isLatest = version === loomNode.diffs.length;

  const bottomRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'auto' });
    }
  });

  if (editEnabled) {
    return (
      <div className="">
        <div className="">
          <div className="rounded-md border p-2 overflow-scroll max-h-[65vh]">
            {previousRead}
            <span ref={bottomRef}></span>
          </div>
          <div className="m-2">
            <Textarea
              ref={editCancelRef}
              defaultValue={patchToVersion(loomNode, version, dmp)}
              id="editNodeText"
              autoFocus
              onChange={() => {
              }}
            />
            <div className="flex justify-end space-x-1 pt-2">
              <Button
                size="sm"
                onClick={saveEdit}
              >Save</Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={
                  () => {
                    setEditEnabled(false);
                  }
                }>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="">
        <div className="">
          <div className="flex justify-end items-center m-0.5">
            {isLatest ? <Button variant="ghost" size="xs" onClick={() => setEditEnabled(true)}>Edit</Button> : null}
            <Select
              value={version.toString()}
              onValueChange={(value) => { setFocusedNodeVersion(parseInt(value)) }}
            >
              <SelectTrigger className="w-16">
                <SelectValue placeholder={"v" + version} />
              </SelectTrigger>
              {VersionSelectContent(loomNode)}
            </Select>
          </div>
          <div className="rounded-md border p-2 overflow-scroll max-h-[65vh]">
            {previousRead}
            <span ref={bottomRef}></span>
            <span>{addBreaks(patchToVersion(loomNode, version, dmp))}</span>
          </div>
        </div>
      </div >
    )
  }
}

function infoLabel(text: string) {
  return <span className="font-semibold">{text}:</span>
}

function collapsibleInfo(label: string, content: string) {
  return (
    <Collapsible>
      <CollapsibleTrigger className="flex items-center cursor-pointer">
        <span className="font-semibold">{label}</span><ChevronsUpDown className="size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-2 border rounded-md font-mono">
          {addBreaks(content)}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

function infoCard(loomNode: LoomNode, setFocusedNodeId: (id: string) => void) {
  var parentLine = null
  if (loomNode.parent != null) {
    const parent = loomNode.parent.loomNode;
    const parentIdText = parent.id + " (v" + loomNode.parent.version + ")";
    parentLine = <p>{infoLabel("parent")} <NodeLink
      text={parentIdText}
      nodeId={parent.id}
      version={loomNode.parent.version}
      setFocusedNodeId={setFocusedNodeId}
    /></p>
  }
  var childrenList = null
  if (loomNode.children.length > 0) {
    const children = loomNode.children.map((child) => {
      const childIdText = child.id
      return <li key={child.id + "-li"} className="ml-4"><NodeLink
        text={childIdText}
        nodeId={child.id}
        setFocusedNodeId={setFocusedNodeId}
        key={child.id}
      /></li>
    });
    childrenList = <ul className="list-disc list-inside">{infoLabel("children")} {children}</ul >
  }
  const modelLine = loomNode.generation?.model ? <p>{infoLabel("model")} {loomNode.generation.model.name}</p> : null
  const apiURLLine = loomNode.generation?.model ? <p>{infoLabel("API")} {loomNode.generation.model.apiURL}</p> : null
  const finishReasonLine = loomNode.generation?.finishReason ? <p>{infoLabel("finish reason")} {loomNode.generation.finishReason}</p> : null
  const promptLine = loomNode.generation?.model ? collapsibleInfo("prompt", loomNode.generation.prompt) : null
  const rawResponseLine = loomNode.generation?.rawResponse ? collapsibleInfo("raw response", JSON.stringify(JSON.parse(loomNode.generation.rawResponse), null, 2)) : null
  return (
    <div className="p-2 border rounded-md overflow-scroll max-h-[65vh]">
      <p>{infoLabel("id")} {loomNode.id}</p>
      <p>{infoLabel("timestamp")} {new Date(loomNode.timestamp).toUTCString()}</p>
      {parentLine}
      {childrenList}
      {modelLine}
      {apiURLLine}
      {finishReasonLine}
      {promptLine}
      {rawResponseLine}
    </div>
  )
}

export default function NodeDetails({ loomNode, setVersion, setFocusedNodeVersion, spawnChildren, setFocusedNodeId, dmp,
  editEnabled, setEditEnabled, saveEdit, editCancelRef, deleteNode, isGenerating }:
  {
    loomNode: LoomNode,
    setVersion: number | null,
    setFocusedNodeVersion: (version: number) => void,
    spawnChildren: () => void,
    setFocusedNodeId: (id: string) => void,
    dmp: any
    editEnabled: boolean,
    setEditEnabled: (enabled: boolean) => void
    saveEdit: () => void
    editCancelRef: React.RefObject<HTMLTextAreaElement>
    deleteNode: (nodeId: string) => void
    isGenerating: boolean
  }) {

  const disableGen = isGenerating || editEnabled

  const loadSpinner = isGenerating ? <Loader className="w-16" /> : null

  const genButton = disableGen ? <Button disabled>{loadSpinner}Generate </Button> : <Button size="lg" onClick={() => spawnChildren()}> Generate </Button>

  const generateButton = <div
    className="flex justify-center items-center p-1 generateDisabled"
  >
    {genButton}
  </div >


  const delButton = editEnabled ? <Button variant="ghost" disabled> Delete </Button> : <Button variant="ghost" onClick={() => deleteNode(loomNode.id)}> Delete </Button>

  const deleteButton = <div
    className="flex p-1 generateDisabled place-content-center text-red-500"
  >
    {delButton}
  </div >

  return (
    <div className="p-2">
      <Tabs defaultValue="read">
        <TabsList>
          <TabsTrigger id="read-tab" value="read">Read</TabsTrigger>
          <TabsTrigger id="info-tab" value="info">Info</TabsTrigger>
        </TabsList>
        <TabsContent className="p-2" value="read">
          {ReadView(
            editEnabled, setEditEnabled, loomNode, setVersion, setFocusedNodeVersion, setFocusedNodeId,
            dmp, saveEdit, editCancelRef
          )}
          {generateButton}
          {deleteButton}
        </TabsContent>
        <TabsContent className="p-2" value="info">
          {infoCard(loomNode, setFocusedNodeId)}
          {generateButton}
          {deleteButton}
        </TabsContent>
      </Tabs>
    </div>
  )
}