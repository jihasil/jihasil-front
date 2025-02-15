import { CategoryUnion } from "@/shared/enum/category";
import { IssueUnion } from "@/shared/enum/issue";

export type PostMetadata = {
  post_id?: string;
  created_at?: string;
  board?: string;
  thumbnail_url?: string;
  thumbnail_file?: FileList;
  title: string;
  subtitle: string;
  category: CategoryUnion;
  author: string;
  issue_id: IssueUnion;
  is_approved: boolean;
  is_deleted?: boolean;
};

export type PostInput = {
  html: string;
  metadata: PostMetadata;
};

export type Post = {
  postMetadata: PostMetadata;
  html: string;
};

export type LastPostKey = {
  created_at: string;
  board: string;
};

export type PostResponseDTO = {
  postMetadataList: PostMetadata[];
  isLast: boolean;
  LastEvaluatedKey: LastPostKey;
};
