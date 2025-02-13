export const CategoryKey = {
  매거진: "magazine",
  칼럼: "column",
  팟캐스트: "podcast",
  큐레이션: "curation",
  소셜: "social",
} as const;

export type CategoryUnion = (typeof CategoryKey)[keyof typeof CategoryKey];

function invertObject(obj: typeof CategoryKey): { [key: string]: string } {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return { ...acc, [value]: key };
  }, {});
}

export const CategoryValue = invertObject(CategoryKey);

// categorySelection을 동적으로 생성하는 함수
let cachedCategorySelection;

function createCategorySelection(categoryKey: typeof CategoryKey) {
  if (!cachedCategorySelection) {
    return Object.entries(categoryKey).map(([display, value]) => ({
      value,
      display,
    }));
  }
  return cachedCategorySelection;
}

// categorySelection을 생성
export const categorySelection = createCategorySelection(CategoryKey);
