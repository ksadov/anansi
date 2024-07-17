import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LoomNode } from "utils/logic/types";

function LinprobHighlight({ token, lp }: { token: string, lp: number }) {
  const linprob = Math.exp(lp);
  const bgColor = `rgba(${Math.round(255 * (1 - linprob))},${Math.round(255 * linprob)},0, 0.5)`;
  const linprobStr = linprob < 0.01 ? "<0.01" : linprob > 0.99 ? ">0.99" : linprob.toFixed(2);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span style={{ backgroundColor: bgColor, borderRadius: 4 }}>
          {token}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <div>{token}: {linprobStr}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function LogprobView({ loomNode }: { loomNode: LoomNode }) {
  console.log("LOGPROBS", loomNode.generation?.logprobs);
  const highlightedText = loomNode.generation?.logprobs?.text.map((logprob, i) => {
    return <LinprobHighlight key={i} token={logprob.token} lp={logprob.lp} />
  });
  return (
    <TooltipProvider>
      <div className="rounded-md border p-2 overflow-scroll max-h-[65vh]">
        {highlightedText}
      </div>
    </TooltipProvider>
  );
}