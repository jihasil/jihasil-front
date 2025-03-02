export type Key = object;
export type Filter = object;

export type PageRequest<T extends Key> = {
  pageSize: number;
  lastKey?: T;
};
