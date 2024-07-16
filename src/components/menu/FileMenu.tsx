
import { useState } from "react";
import { Import, ArrowRightFromLine, FilePlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar"
import BackupRequestModal from "components/common/BackupRequestModal";

export default function FileMenu({ importTree, exportCurrentTree, newTree }:
  {
    importTree: () => void,
    exportCurrentTree: () => void
    newTree: () => void
  }) {
  const [destructiveOpen, setDestructiveOpen] = useState(false);
  return (
    <Dialog open={destructiveOpen} onOpenChange={setDestructiveOpen}>
      <MenubarMenu>
        <MenubarTrigger>
          File
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={exportCurrentTree}>
            <span className="p-1"><ArrowRightFromLine size={16} /></span> Export to savefile
          </MenubarItem>
          <MenubarItem onClick={importTree}>
            <span className="p-1"><Import size={16} /></span>  Import from savefile
          </MenubarItem>
          <DialogTrigger className="w-full">
            <MenubarItem>
              <span className="p-1"><FilePlus size={16} /></span> New tree
            </MenubarItem>
          </DialogTrigger>
        </MenubarContent>
      </MenubarMenu >
      <DialogContent>
        <BackupRequestModal
          destructiveDesc="delete the current tree"
          backupFn={exportCurrentTree}
          destructiveFn={() => { newTree(); setDestructiveOpen(false); }}
        />
      </DialogContent>
    </Dialog>
  );
}