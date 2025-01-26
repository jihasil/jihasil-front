import { CategoryUnion } from "@/const/category";
import { IssueUnion } from "@/const/issue";

export type Metadata = {
  thumbnail?: string | undefined;
  partition_key?: string;
  "created_at#issue_id"?: string;
  uuid?: string;

  thumbnail_url?: string;
  thumbnail_file?: FileList;
  title: string;
  subtitle: string;
  category: CategoryUnion;
  author: string;
  issue_id: IssueUnion;
  is_approved: boolean;
  is_deleted?: boolean;

  imageUrl?: string;
};

export type PostInput = {
  html: string;
  metadata: Metadata;
};

export type Post = {
  imageUrl?: string;
  metadata?: Metadata;
  html: string;
  "created_at#issue_id": string;
};

export type LastPostKey = {
  "created_at#issue_id": string;
  partition_key: string;
};

export type PostResponseDTO = {
  posts: Metadata[];
  isLast: boolean;
  LastEvaluatedKey: LastPostKey;
};
