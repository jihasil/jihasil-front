import { cache } from "react";

import { NavigationSelection } from "@/shared/types/navigation";

export const createNavigationSelection = cache(
  (obj: Record<string, string>): NavigationSelection[] => {
    let cached: NavigationSelection[] = [];
    Object.entries(obj).forEach(([display, value]) => {
      cached = [...cached, { value, display }];
    });
    return cached;
  },
);

export const invertObject = cache(
  (obj: Record<string, string>): Record<string, string> => {
    const cached: Record<string, string> = {};
    if (Object.entries(cached).length === 0) {
      Object.entries(obj).forEach(([key, value]) => {
        cached[value] = key;
      });
    }
    return cached;
  },
);
