import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../@/components/ui/tabs"
import { LoomNode } from "./types"

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
  const previousRead = <span className={"previousRead"}>{constructReadTree(loomNode)}</span>

  if (editEnabled) {
    return (
      <div>
        {previousRead}
        <div>
          <input type="text"
            defaultValue={loomNode.text}
            id="editNodeText"
            onChange={() => {
            }}
          ></input>
          <div>
            <button onClick={() => {
              setEditEnabled(false);
              const text = (document.getElementById("editNodeText") as HTMLInputElement).value;
              loomNode.text = text;
            }
            }>Save</button>
            <button onClick={
              () => {
                setEditEnabled(false);
              }
            }>Cancel</button>
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div>
        {previousRead}
        <div>
          <span>{loomNode.text}</span>
          <div>
            <button onClick={() => setEditEnabled(true)}>Edit</button>
          </div>
          <div>
            <button
              onClick={() => spawnChildren()}
            >
              Generate
            </button>
          </div>
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