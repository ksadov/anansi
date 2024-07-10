import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../@/components/ui/tabs"
import { LoomNode } from "./types"
import { constructLineage, patchToVersion } from "./loomNode"
import { Button } from "../@/components/ui/button"
import { Textarea } from "../@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "../@/components/ui/select"
import NodeLink from "./NodeLink"

function constructReadTree(loomNode: LoomNode, dmp: any, setFocusedNodeId: (id: string) => void) {
  const lineage = constructLineage(loomNode);
  const ancestorLinks = lineage.map((node) =>
    <NodeLink
      text={patchToVersion(node.loomNode, node.version, dmp)}
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

function readView(
  editEnabled: boolean,
  setEditEnabled: (enabled: boolean) => void,
  loomNode: LoomNode, setVersion: number | null,
  editFocusedNode: (text: string) => void,
  setFocusedNodeVersion: (version: number) => void,
  setFocusedNodeId: (id: string) => void,
  spawnChildren: () => void,
  dmp: any) {
  const previousRead = <span className="opacity-65">{constructReadTree(loomNode, dmp, setFocusedNodeId)}</span>

  const genButton = editEnabled ? <Button disabled> Generate </Button> : <Button size="lg" onClick={() => spawnChildren()}> Generate </Button>

  const generateButton = <div
    className="flex p-3 generateDisabled place-content-center"
  >
    {genButton}
  </div >

  const version = (setVersion == null) ? loomNode.diffs.length : setVersion;
  const isLatest = version === loomNode.diffs.length;

  if (editEnabled) {
    return (
      <div className="">
        <div className="">
          <div className="rounded-md border p-2">
            {previousRead}
            <div className="m-2">
              <Textarea
                defaultValue={patchToVersion(loomNode, version, dmp)}
                id="editNodeText"
                onChange={() => {
                }}
              />
              <div className="flex justify-end space-x-1 pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditEnabled(false);
                    const text = (document.getElementById("editNodeText") as HTMLInputElement).value;
                    editFocusedNode(text);
                    setFocusedNodeVersion(version + 1);
                  }
                  }>Save</Button>
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
          {generateButton}
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
          <div className="rounded-md border p-2">
            {previousRead}
            <span>{patchToVersion(loomNode, version, dmp)}</span>
          </div>
        </div>
        {generateButton}
      </div >
    )
  }
}

export default function NodeDetails({ loomNode, setVersion, editFocusedNode, setFocusedNodeVersion, spawnChildren, setFocusedNodeId, dmp }:
  {
    loomNode: LoomNode,
    setVersion: number | null,
    editFocusedNode: (text: string) => void,
    setFocusedNodeVersion: (version: number) => void,
    spawnChildren: () => void,
    setFocusedNodeId: (id: string) => void,
    dmp: any
  }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="p-2">
      <Tabs defaultValue="read">
        <TabsList>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        <TabsContent className="p-2" value="read">
          {readView(
            editEnabled, setEditEnabled, loomNode, setVersion, editFocusedNode, setFocusedNodeVersion, setFocusedNodeId,
            spawnChildren, dmp
          )}
        </TabsContent>
        <TabsContent className="p-2" value="info">
          <div>
            <p>id: {loomNode.id}</p>
            <p>originalText: {loomNode.originalText}</p>
            <p>diffs: {loomNode.diffs.map(diff => diff.content).join(", ")}</p>
            <p>parent: {loomNode.parent?.loomNode.id + " (v" + loomNode.parent?.version + ")"}</p>
            <p>children: {loomNode.children.map(child => child.id).join(", ")}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}