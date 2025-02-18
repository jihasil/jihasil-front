import {
  createNavigationSelection,
  invertObject,
} from "@/shared/enum/enum-util";
import { NavigationSelection } from "@/shared/types/navigation";

export const CategoryKey = {
  매거진: "magazine",
  칼럼: "column",
  팟캐스트: "podcast",
  큐레이션: "curation",
  소셜: "social",
} as const;

export type CategoryUnion = (typeof CategoryKey)[keyof typeof CategoryKey];

const cachedCategorySelection: NavigationSelection[] = [];
const cachedCategoryValue: Record<string, string> = {};

export const categorySelection = createNavigationSelection(
  cachedCategorySelection,
  CategoryKey,
);

export const CategoryValue = invertObject(cachedCategoryValue, CategoryKey);
