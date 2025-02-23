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
    Object.entries(obj).forEach(([key, value]) => {
      cached[value] = key;
    });
    return cached;
  },
);

export const getOrdinal = cache(
  (obj: Record<string, string>): Record<string, number> => {
    const cached: Record<string, number> = {};
    Object.entries(obj).forEach(([key, value], index) => {
      cached[value] = index;
    });
    return cached;
  },
);
