"use client";

import { FixedToolbar } from "@/app/(front)/components/plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "@/app/(front)/components/plate-ui/fixed-toolbar-buttons";
import { createPlatePlugin } from "@udecode/plate/react";

export const FixedToolbarPlugin = createPlatePlugin({
  key: "fixed-toolbar",
  render: {
    beforeEditable: () => (
      <FixedToolbar>
        <FixedToolbarButtons />
      </FixedToolbar>
    ),
  },
});
