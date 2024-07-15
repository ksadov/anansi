import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";

export default function ResetModalContent({ destructiveDesc, backupFn, destructiveFn }:
  {
    destructiveDesc: string,
    backupFn: () => void,
    destructiveFn: () => void
  }) {
  return (
    <>
      <DialogHeader className="p-2">
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This will {destructiveDesc}. Maybe you want to export your current data locally first?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="p-2">
        <Button variant="outline" onClick={() => { backupFn(); destructiveFn(); }}>
          Export and continue
        </Button>
        <Button className="text-red-500" variant="ghost" onClick={destructiveFn}>
          Continue without export
        </Button>
      </DialogFooter>
    </>
  );
}