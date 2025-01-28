"use client";

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { className } from "postcss-selector-parser";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";

import { Post, PostInput } from "@/app/utils/post";
import { PlateEditor } from "@/components/editor/plate-editor";
import { Checkbox } from "@/components/plate-ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Navigation } from "@/components/ui/navigation";
import { CategoryUnion, categorySelection } from "@/const/category";
import { IssueUnion, issueOnNewPost } from "@/const/issue";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditPost() {
  const router = useRouter();
  const postUuid = useSearchParams().get("postUuid");
  const [post, setPost] = useState<Post>();
  const [initiated, setInitiated] = useState<boolean>(false);

  const initiatePost = () => {
    if (!postUuid || initiated) return;

    fetch(`/api/post?postUuid=${postUuid}`, {
      method: "GET",
    })
      .then((res) => {
        res.json().then((data: Post) => {
          console.log(data);
          setPost(data);
        });
      })
      .finally(() => {
        setInitiated(true);
      });
  };

  useEffect(initiatePost, []);

  const uploadThumbnail = async (thumbnail: File): Promise<string> => {
    // thumbnail 업로드
    const { presignedUrl, fileUrl } = await fetch("/api/upload", {
      method: "POST",
      body: JSON.stringify({
        filename: thumbnail.name,
        contentType: thumbnail.type,
      }),
    }).then((r) => r.json());

    await axios.put(presignedUrl, thumbnail, {
      headers: { "Content-Type": thumbnail.type },
    });

    return fileUrl;
  };

  const submit = async (values: PostInput) => {
    if (values.metadata.thumbnail_file?.length === 1) {
      values.metadata.thumbnail_url = (await uploadThumbnail(
        values.metadata.thumbnail_file[0] as File,
      )) as string;
    }

    const response = await fetch("/api/post", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Failed to upload");
    }
  };

  const plateEditorRef = useRef<{ exportToHtml: () => Promise<string> }>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const metadataSchema = z.object({
    thumbnail_file: z
      .any()
      .refine((file: FileList) => {
        // 기본값 있으면 (있는 글 수정이면 파일 없어도 됨)
        if (post?.metadata?.thumbnail_url) return true;
        else {
          // 없으면 파일 있어야 함
          return file.length === 1;
        }
      }, "썸네일 파일을 입력해주세요.")
      .refine((file: FileList) => {
        return (
          post?.metadata?.thumbnail_url ||
          ACCEPTED_IMAGE_TYPES.includes(file[0]?.type)
        );
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
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof metadataSchema>>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: post?.metadata?.title ?? "",
      subtitle: post?.metadata?.subtitle ?? "",
      category:
        post?.metadata?.category ??
        (categorySelection[0].value as CategoryUnion),
      author: post?.metadata?.author ?? "",
      issue_id:
        post?.metadata?.issue_id ?? (issueOnNewPost[0].value as IssueUnion),
      is_approved: post?.metadata?.is_approved ?? true,
    },
    mode: "onChange",
    values: post?.metadata,
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof metadataSchema>) {
    if (isUploading) {
      return;
    }

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (plateEditorRef.current) {
      const html = await plateEditorRef.current.exportToHtml();

      if (html.length > 0) {
        setIsUploading(true);

        try {
          await submit({
            html,
            metadata: {
              ...values,
              post_uuid: post?.metadata?.post_uuid,
              thumbnail_url: post?.metadata?.thumbnail_url,
              partition_key: post?.metadata?.partition_key,
              "created_at#issue_id": post?.metadata?.["created_at#issue_id"],
            },
          });

          await router.push("/");
        } catch (e) {
          toast("업로드에 실패했습니다.");
          console.error(e);
        } finally {
          setIsUploading(false);
        }
      } else {
        toast("글 내용을 입력해주세요.");
      }
    }
  }

  const fileRef = form.register("thumbnail_file");

  return (
    <div className="flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="w-full justify-items-stretch grid lg:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel>제목</FormLabel>
                  <FormControl>
                    <Input placeholder="길 위에서 나를 찾다" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 col-span-4">
                  <FormLabel>부제목</FormLabel>
                  <FormControl>
                    <Input placeholder="돌아오는 로드무비 5편" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>카테고리</FormLabel>
                  <FormControl>
                    <Navigation
                      onValueChange={(value: CategoryUnion) => {
                        setPost({
                          ...post,
                          // @ts-expect-error 기본값 설정해서 undefined 될 일 없음
                          metadata: {
                            ...post?.metadata,
                            category: value,
                          },
                        });
                      }}
                      selects={categorySelection}
                      default={post?.metadata?.category}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issue_id"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>이슈</FormLabel>
                  <FormControl>
                    <Navigation
                      onValueChange={(value: IssueUnion) => {
                        setPost({
                          ...post,
                          // @ts-expect-error 기본값 설정해서 undefined 될 일 없음
                          metadata: {
                            ...post?.metadata,
                            issue_id: value,
                          },
                        });
                      }}
                      selects={issueOnNewPost}
                      default={post?.metadata?.issue_id}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 col-span-4">
                  <FormLabel>글쓴이</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="도현, 준, 나우, 나무, ...etc"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div
            className="rounded-lg border h-full w-full dark"
            data-registry="plate"
          >
            <PlateEditor ref={plateEditorRef} data={post?.html} />
            <Toaster />
          </div>

          <div className="w-fit flex flex-col gap-5">
            <FormField
              control={form.control}
              name="thumbnail_file"
              render={() => (
                <FormItem>
                  <FormLabel>썸네일</FormLabel>
                  <FormControl>
                    <Input type="file" {...fileRef} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_approved"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      발행하기 (해제하면 전체 사용자에게 보이지 않습니다.)
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isUploading} type="submit">
            {isUploading ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("animate-spin", className)}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            ) : (
              "제출"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
