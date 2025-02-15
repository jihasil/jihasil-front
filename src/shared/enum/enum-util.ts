import { NavigationSelection } from "@/shared/types/navigation";

export function createNavigationSelection(
  cached: NavigationSelection[],
  obj: Record<string, string>,
): NavigationSelection[] {
  if (cached.length === 0) {
    Object.entries(obj).forEach(([display, value]) => {
      cached = [...cached, { value, display }];
    });
  }
  return cached;
}

export function invertObject(
  cached: Record<string, string>,
  obj: Record<string, string>,
): Record<string, string> {
  if (Object.entries(cached).length === 0) {
    Object.entries(obj).forEach(([key, value]) => {
      cached[value] = key;
    });
  }
  return cached;
}
