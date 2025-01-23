"use client";

import { useRef } from "react";
import { Toaster } from "sonner";

import AdditionalInfo from "@/app/newPost/additional-info";
import { PlateEditor } from "@/components/editor/plate-editor";
import { Button } from "@/components/ui/button";

export default function WriteNewPost() {
  const plateEditorRef = useRef<{ exportToHtml: () => Promise<void> }>(null);

  const handleExport = async () => {
    console.log(`value: ${plateEditorRef.current}`);
    if (plateEditorRef.current) {
      await plateEditorRef.current.exportToHtml();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-lg border h-full w-full dark"
        data-registry="plate"
      >
        <PlateEditor ref={plateEditorRef} />
        <Toaster />
      </div>
      <AdditionalInfo />
      <Button className="w-fit" onClick={handleExport}>
        버튼
      </Button>
    </div>
  );
}
