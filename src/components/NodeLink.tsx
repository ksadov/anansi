export default function NodeLink({ text, nodeId, version, setFocusedNodeId }:
  {
    text: string,
    nodeId: string,
    version?: number
    setFocusedNodeId: (nodeId: string, version?: number) => void
  }
) {
  return (
    <span
      className="hover:underline cursor-pointer"
      onClick={() => setFocusedNodeId(nodeId, version)}
    >
      {text}
    </span>
  );
}