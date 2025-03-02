import { PostEntry, PostKey } from "@/app/global/types/post-types";

export type Key = object;
export type Filter = object;

export type PageRequest<T extends Key> = {
  pageSize: number;
  lastKey?: T;
};

export type Page<T, R extends Key> = {
  data: T[];
  isLast: boolean;
  lastKey?: R;
};
