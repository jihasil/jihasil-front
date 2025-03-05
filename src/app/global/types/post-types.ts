import { z } from "zod";

import { CategoryUnion } from "@/app/global/enum/category";
import { IssueUnion } from "@/app/global/enum/issue";
import { Filter, Key } from "@/app/global/types/page-types";

export type CreatePostRequestDTO = {
  postId?: string;
  createdAt?: string;
  board?: string;
  thumbnailUrl?: string;
  title: string;
  subtitle: string;
  category: CategoryUnion;
  author: string;
  issueId: IssueUnion;
  isApproved: boolean;
  isDeleted?: boolean;
  userId?: string;
  html?: string;
};

export type PostResponseDTO = {
  post_id: string;
  createdAt: string;
  board: string;
  thumbnailUrl: string;
  title: string;
  subtitle: string;
  category: CategoryUnion;
  author: string;
  issue_id: IssueUnion;
  isApproved: boolean;
  isDeleted: boolean;
  userId: string;
  html: string;
};

export interface PostKey extends Key {
  created_at: string;
  board: string;
}

export interface PostFilter extends Filter {
  user_id?: string;
  issue_id?: IssueUnion;
}

export type PostEntry = {
  postId: string;
  thumbnailUrl: string;
  title: string;
  subtitle: string;
  category: CategoryUnion;
  author: string;
  issueId: IssueUnion;
  isApproved: boolean;
};

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const metadataSchema = (thumbnailUrl: string | undefined) =>
  z.object({
    thumbnailFile: z
      .any()
      .refine((file: FileList) => {
        // 기본값 있으면 (있는 글 수정이면 파일 없어도 됨)
        if (thumbnailUrl) return true;
        else {
          // 없으면 파일 있어야 함
          return file.length === 1;
        }
      }, "썸네일 파일을 입력해주세요.")
      .refine((file: FileList) => {
        return thumbnailUrl || ACCEPTED_IMAGE_TYPES.includes(file[0]?.type);
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
    issueId: z.union(
      [z.literal("issue_001"), z.literal("issue_002"), z.literal("none")],
      { required_error: "이슈를 선택하세요." },
    ),
    isApproved: z.boolean(),
    html: z.string().optional(),
    userId: z.string(),
    postId: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    board: z.string().optional(),
    createdAt: z.string().optional(),
    isDeleted: z.boolean().optional(),
  });
