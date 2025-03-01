import { z } from "zod";

import { CategoryUnion } from "@/app/global/enum/category";
import { IssueUnion } from "@/app/global/enum/issue";

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
  user_id?: string;
};

export type Post = {
  html: string;
  postMetadata: PostMetadata;
};

export type PostKey = {
  created_at: string;
  board: string;
};

export type PostResponseDTO = {
  postMetadataList: PostMetadata[];
  isLast: boolean;
  LastEvaluatedKey: PostKey;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const metadataSchema = (thumbnail_url: string | undefined) =>
  z.object({
    thumbnail_file: z
      .any()
      .refine((file: FileList) => {
        // 기본값 있으면 (있는 글 수정이면 파일 없어도 됨)
        if (thumbnail_url) return true;
        else {
          // 없으면 파일 있어야 함
          return file.length === 1;
        }
      }, "썸네일 파일을 입력해주세요.")
      .refine((file: FileList) => {
        return thumbnail_url || ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
      }, "jpg, png, webp 이미지를 입력해주세요."),
    title: z.string().min(1, "제목을 입력해주세요."),
    subtitle: z.string().min(1, "부제목을 입력해주세요."),
    category: z.union(
      [
        z.literal("magazine"),
        z.literal("column"),
        z.literal("podcast"),
        z.literal("curation"),
        z.literal("social"),
      ],
      {
        required_error: "카테고리를 선택하세요.",
      },
    ),
    author: z
      .string({ required_error: "글쓴이를 입력해주세요" })
      .min(1, "글쓴이를 입력하세요."),
    issue_id: z.union(
      [z.literal("issue_001"), z.literal("issue_002"), z.literal("none")],
      { required_error: "이슈를 선택하세요." },
    ),
    is_approved: z.boolean(),
    html: z.string().min(1, "내용을 입력하세요."),
    user_id: z.string(),
    post_id: z.string().optional(),
    thumbnail_url: z.string().optional(),
    board: z.string().optional(),
    created_at: z.string().optional(),
    is_deleted: z.boolean().optional(),
  });
