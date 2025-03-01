"use client";

import { LinkFloatingToolbar } from "@/app/(front)/components/plate-ui/link-floating-toolbar";
import { LinkPlugin } from "@udecode/plate-link/react";

export const linkPlugin = LinkPlugin.extend({
  render: { afterEditable: () => <LinkFloatingToolbar /> },
});
