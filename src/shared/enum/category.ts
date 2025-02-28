import {
  createNavigationSelection,
  invertObject,
} from "@/shared/enum/enum-util";

export const CategoryKey = {
  매거진: "magazine",
  칼럼: "column",
  팟캐스트: "podcast",
  큐레이션: "curation",
  소셜: "social",
} as const;

export type CategoryUnion = (typeof CategoryKey)[keyof typeof CategoryKey];

export const categorySelection =
  createNavigationSelection<CategoryUnion>(CategoryKey);

export const categoryValue = invertObject<CategoryUnion>(CategoryKey);
