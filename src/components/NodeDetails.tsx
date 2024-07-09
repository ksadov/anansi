import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../@/components/ui/tabs"
import { LoomNode } from "./types"
import { Button } from "../@/components/ui/button"

function constructReadTree(loomNode: LoomNode) {
  const lineage = []
  let current: LoomNode | undefined = loomNode.parent
  while (current) {
    lineage.push(current)
    if (current.parent) {
      current = current.parent
    }
    else {
      current = undefined
    }
  }
  const lineageText = lineage.map(node => node.text).join("")
  return lineageText
}

function readView(editEnabled: boolean, setEditEnabled: (enabled: boolean) => void, loomNode: LoomNode,
  setFocusedNodeText: (text: string) => void, spawnChildren: () => void) {
  const previousRead = <span>{constructReadTree(loomNode)}</span>

  const genButton = editEnabled ? <Button disabled> Generate </Button> : <Button onClick={() => spawnChildren()}> Generate </Button>

  const generateButton = <div
    className="flex p-1 generateDisabled"
  >
    {genButton}
  </div >

  if (editEnabled) {
    return (
      <div className="">
        <div className="">
          <div className="flex justify-end space-x-1 p-1">
            <Button onClick={() => {
              setEditEnabled(false);
              const text = (document.getElementById("editNodeText") as HTMLInputElement).value;
              setFocusedNodeText(text);
            }
            }>Save</Button>
            <Button
              variant="secondary"
              onClick={
                () => {
                  setEditEnabled(false);
                }
              }>Cancel</Button>
          </div>
          <div className="rounded-md border p-1">
            {previousRead}
            <div className="">
              <input
                type="textarea"
                defaultValue={loomNode.text}
                id="editNodeText"
                onChange={() => {
                }}
              ></input>
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
          <div className="flex justify-end space-x-1 p-1">
            <Button onClick={() => setEditEnabled(true)}>Edit</Button>
          </div>
          <div className="rounded-md border p-2">
            {previousRead}
            <span>{loomNode.text}</span>
          </div>
          {generateButton}
        </div>
      </div >
    )
  }
}

export default function NodeDetails({ loomNode, setFocusedNodeText, spawnChildren }:
  { loomNode: LoomNode, setFocusedNodeText: (text: string) => void, spawnChildren: () => void }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <div className="p-2">
      <Tabs defaultValue="read">
        <TabsList>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        <TabsContent className="p-2" value="read">
          {readView(editEnabled, setEditEnabled, loomNode, setFocusedNodeText, spawnChildren)}
        </TabsContent>
        <TabsContent className="p-2" value="info">
          <div>
            <p>id: {loomNode.id}</p>
            <p>text: {loomNode.text}</p>
            <p>parent: {loomNode.parent?.text}</p>
            <p>children: {loomNode.children.map(child => child.text).join(", ")}</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}