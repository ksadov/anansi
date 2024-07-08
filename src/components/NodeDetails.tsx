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

function readView(editEnabled: boolean, setEditEnabled: (enabled: boolean) => void, loomNode: LoomNode) {
  const previousRead = <span className={"previousRead"}>{constructReadTree(loomNode)}</span>
  if (editEnabled) {
    return (
      <div>
        {previousRead}
        <div>
          <input type="text" value={loomNode.text} />
          <div>
            <button onClick={() => setEditEnabled(false)}>Save</button>
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
        </div>
      </div >
    )
  }
}

export default function NodeDetails({ loomNode }: { loomNode: LoomNode }) {
  const [editEnabled, setEditEnabled] = useState(false)
  return (
    <Tabs defaultValue="read">
      <TabsList>
        <TabsTrigger value="read">Read</TabsTrigger>
        <TabsTrigger value="info">Info</TabsTrigger>
      </TabsList>
      <TabsContent value="read">
        {readView(editEnabled, setEditEnabled, loomNode)}
      </TabsContent>
      <TabsContent value="info">
        <div>
          <p>id: {loomNode.id}</p>
          <p>text: {loomNode.text}</p>
          <p>parent: {loomNode.parent?.text}</p>
          <p>children: {loomNode.children.map(child => child.text).join(", ")}</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}