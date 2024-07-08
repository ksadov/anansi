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

export default function NodeDetails({ loomNode }: { loomNode: LoomNode }) {
  return (
    <Tabs defaultValue="read">
      <TabsList>
        <TabsTrigger value="read">Read</TabsTrigger>
        <TabsTrigger value="info">Info</TabsTrigger>
      </TabsList>
      <TabsContent value="read">
        <div>
          <span className={"previousRead"}>{constructReadTree(loomNode)}</span>
          <span className={"currentRead"}>{loomNode.text}</span>
        </div>
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