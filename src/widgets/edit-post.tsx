"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PlateEditor } from "@/components/editor/plate-editor";
import { Checkbox } from "@/components/plate-ui/checkbox";
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
import SubmitButton from "@/components/ui/submit-button";
import { hasEnoughRole } from "@/entities/user";
import { CategoryUnion, categorySelection } from "@/shared/enum/category";
import { IssueUnion, issueSelection } from "@/shared/enum/issue";
import { fetchR } from "@/shared/lib/request";
import { Session } from "@/shared/types/auth-types";
import { Post, metadataSchema } from "@/shared/types/post-types";
import PreventRoute from "@/widgets/prevent-route";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditPost(props: { post?: Post; session: Session }) {
  const router = useRouter();
  const { post } = props;

  const uploadThumbnail = async (thumbnail: File): Promise<string> => {
    // thumbnail 업로드
    const { presignedUrl, fileUrl } = await fetchR("/api/upload", {
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

  const [isUploading, setIsUploading] = useState<boolean>(false);

  const schema = metadataSchema(post?.postMetadata.thumbnail_url);

  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.postMetadata?.title ?? "",
      subtitle: post?.postMetadata?.subtitle ?? "",
      category: post?.postMetadata?.category ?? categorySelection[0].value,
      author: post?.postMetadata?.author ?? props.session.user.name,
      issue_id: post?.postMetadata?.issue_id ?? issueSelection[0].value,
      is_approved: post?.postMetadata?.is_approved ?? true,
      html: post?.html,
      thumbnail_url: post?.postMetadata?.thumbnail_url,
      post_id: post?.postMetadata?.post_id,
      board: post?.postMetadata?.board,
      created_at: post?.postMetadata?.created_at,
      user_id: post?.postMetadata?.user_id ?? props.session.user.id,
      is_deleted: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof schema>) {
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      const postId = await submit(values);

      router.push(`/post/view/${postId}`);
    } catch (e) {
      toast("업로드에 실패했습니다.");
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }

  async function onError(values: any) {
    // toast.error(values);
    console.log(values);
  }

  const submit = async (values: z.infer<typeof schema>) => {
    if (values.thumbnail_file?.length === 1) {
      values.thumbnail_url = (await uploadThumbnail(
        values.thumbnail_file[0] as File,
      )) as string;
    }

    const response = await fetchR("/api/post", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error("Failed to upload");
    }

    const { postId } = await response.json();
    return postId;
  };

  const fileRef = form.register("thumbnail_file");

  return (
    <div className="subgrid">
      <PreventRoute isUploading={isUploading} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="subgrid my-gap"
        >
          <div className="subgrid my-gap">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="lg:col-span-2 col-span-4">
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
                <FormItem className="col-span-4">
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
                        form.setValue("category", value);
                      }}
                      selects={categorySelection}
                      default={post?.postMetadata?.category}
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
                        form.setValue("issue_id", value);
                      }}
                      selects={issueSelection}
                      default={post?.postMetadata?.issue_id}
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
                      readOnly={
                        !hasEnoughRole("ROLE_ADMIN", props.session.user.role)
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="html"
            render={() => (
              <FormItem className="col-span-full dark" data-registry="plate">
                <FormLabel>본문</FormLabel>
                <FormControl>
                  <div className="rounded-lg border ">
                    <PlateEditor
                      html={post?.html}
                      onChange={(value: string) => {
                        form.setValue("html", value);
                      }}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="subgrid my-gap">
            <FormField
              control={form.control}
              name="thumbnail_file"
              render={() => (
                <FormItem className="col-span-4 col-start-1">
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
                <FormItem className="col-span-4 col-start-1 flex gap-x-3 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>
                      발행하기 (해제하면 전체 사용자에게 보이지 않습니다.)
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton
              isUploading={isUploading}
              text={"제출하기"}
              className="col-start-1"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
