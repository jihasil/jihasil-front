import { cache } from "react";

import { NavigationSelection } from "@/shared/types/navigation";

export const createNavigationSelection = cache(
  <T extends string>(obj: Record<string, T>): NavigationSelection<T>[] =>
    Object.entries(obj).reduce((acc, [display, value]) => {
      acc.push({ value, display });
      return acc;
    }, [] as NavigationSelection<T>[]),
);

export const invertObject = cache(
  <T extends string>(obj: Record<string, T>): Record<T, string> =>
    Object.entries(obj).reduce(
      (acc, [key, value]) => {
        acc[value] = key;
        return acc;
      },
      {} as Record<T, string>,
    ),
);

export const getOrdinal = cache(
  <T extends string>(obj: Record<string, T>): Record<T, number> =>
    Object.entries(obj).reduce(
      (acc, [, value], currentIndex) => {
        acc[value] = currentIndex;
        return acc;
      },
      {} as Record<T, number>,
    ),
);
