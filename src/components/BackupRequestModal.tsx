import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle
} from "../@/components/ui/dialog"
import { Button } from "../@/components/ui/button"

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
          Export and reset
        </Button>
        <Button className="text-red-500" variant="ghost" onClick={destructiveFn}>
          Reset without export
        </Button>
      </DialogFooter>
    </>
  );
}