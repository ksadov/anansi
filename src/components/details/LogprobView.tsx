import { LoomNode } from "utils/logic/types";

function LinprobHighlight({ token, lp }: { token: string, lp: number }) {
  const linprob = Math.exp(lp);
  const bgColor = `rgba(${Math.round(255 * (1 - linprob))},${Math.round(255 * linprob)},0, 0.5)`;
  return (
    <span style={{ backgroundColor: bgColor, borderRadius: 4 }}>
      {token}
    </span>
  );
}

export default function LogprobView({ loomNode }: { loomNode: LoomNode }) {
  console.log("LOGPROBS", loomNode.generation?.logprobs);
  const highlightedText = loomNode.generation?.logprobs?.text.map((logprob, i) => {
    return <LinprobHighlight key={i} token={logprob.token} lp={logprob.lp} />
  });
  return (
    <div className="rounded-md border p-2 overflow-scroll max-h-[65vh]">
      {highlightedText}
    </div>
  );
}