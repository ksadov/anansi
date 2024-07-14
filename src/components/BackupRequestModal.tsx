import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle
} from "../@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../@/components/ui/tabs"
import { Button } from "../@/components/ui/button"

export default function ResetModalContent({ backupFn, destructiveFn }:
  {
    backupFn: () => void,
    destructiveFn: () => void
  }) {
  return (
    <TabsContent value="reset">
      <DialogHeader className="p-2">
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This will clear all your data and reset the app to its initial state. Maybe you want to export your current tree data locally first?
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
    </TabsContent >
  );
}