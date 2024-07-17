import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { LoomNode, Logprob } from "utils/logic/types";

function clampedProbString(prob: number) {
  return prob < 0.01 ? "<0.01" : prob > 0.99 ? ">0.99" : prob.toFixed(2);
}

function LinprobHighlight({ token, lp, top }: { token: string, lp: number, top: Logprob[] | null }) {
  const linprob = Math.exp(lp);
  const bgColor = `rgba(${Math.round(255 * (1 - linprob))},${Math.round(255 * linprob)},0,0.5)`;
  const tops = top?.map((top, i) => {
    return <div key={i}>{top.token}: {clampedProbString(Math.exp(top.lp))}</div>
  });
  const wrappedTop = top ? <div>{tops}</div> : null;
  const sep = top ? <Separator className="my-1" orientation="horizontal" /> : null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span style={{ backgroundColor: bgColor, borderRadius: 4 }}>
          {token}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <div>
          <div>{token}: {clampedProbString(linprob)}</div>
          {sep}
          {wrappedTop}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function LogprobView({ loomNode }: { loomNode: LoomNode }) {
  const top: Logprob[][] | null = loomNode.generation?.logprobs?.top ?? null;
  const highlightedText = loomNode.generation?.logprobs?.text.map((logprob, i) => {
    return <LinprobHighlight key={i} token={logprob.token} lp={logprob.lp} top={top ? top[i] : null} />
  });
  return (
    <TooltipProvider>
      <div className="rounded-md border p-2 overflow-scroll max-h-[65vh]">
        {highlightedText}
      </div>
    </TooltipProvider>
  );
}