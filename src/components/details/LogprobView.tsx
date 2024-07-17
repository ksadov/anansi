import { LoomNode } from "utils/logic/types";

function LinprobHighlight({ token, lp }: { token: string, lp: number }) {
  const linProb = Math.exp(lp);
  return (
    <span className="inline-block px-1" style={{ backgroundColor: `rgba(0, 0, 255, ${linProb})` }}>
      {token}
    </span>
  );
}

export default function LogprobView({ loomNode }: { loomNode: LoomNode }) {
  const highlightedText = loomNode.generation?.logprobs?.text.map((logprob, i) => {
    return <LinprobHighlight key={i} token={logprob.token} lp={logprob.lp} />
  });
  return (
    <div className="rounded-md border p-2 overflow-scroll max-h-[65vh]">
      {highlightedText}
    </div>
  );
}