import { Toaster } from "sonner";

import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";

export default function writeNewPost() {
  return (
    <div className="rounded-lg border w-full">
      <SettingsProvider>
        <PlateEditor />
      </SettingsProvider>
      <Toaster />
    </div>
  );
}
