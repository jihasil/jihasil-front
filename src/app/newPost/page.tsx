import { Toaster } from "sonner";

import { PlateEditor } from "@/components/editor/plate-editor";
import { Button } from "@/components/ui/button";

export default function writeNewPost() {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-lg border h-full w-full dark"
        data-registry="plate"
      >
        <PlateEditor />
        <Toaster />
      </div>
      <div>
        <Button>버튼</Button>
      </div>
    </div>
  );
}
