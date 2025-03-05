"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PlateEditor } from "@/app/(front)/components/editor/plate-editor";
import { Checkbox } from "@/app/(front)/components/plate-ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(front)/components/ui/form";
import { Input } from "@/app/(front)/components/ui/input";
import { Navigation } from "@/app/(front)/components/ui/navigation";
import SubmitButton from "@/app/(front)/components/ui/submit-button";
import { fetchR } from "@/app/(front)/shared/lib/request";
import { hasEnoughRole } from "@/app/(front)/shared/lib/utils";
import PreventRoute from "@/app/(front)/widgets/prevent-route";
import { CategoryUnion, categorySelection } from "@/app/global/enum/category";
import { IssueUnion, issueSelection } from "@/app/global/enum/issue";
import { ClientSession } from "@/app/global/types/auth-types";
import { PostResponseDTO, metadataSchema } from "@/app/global/types/post-types";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditPost(props: {
  post?: PostResponseDTO;
  session: ClientSession;
}) {
  const router = useRouter();
  const { post } = props;

  const plateEditorRef = useRef<{ getHtml: () => Promise<string | null> }>(
    null,
  );

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

  const schema = metadataSchema(post?.thumbnailUrl);

  // 1. Define your form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post?.title ?? "",
      subtitle: post?.subtitle ?? "",
      category: post?.category ?? categorySelection[0].value,
      author: post?.author ?? props.session.user.name,
      issueId: post?.issue_id ?? issueSelection[0].value,
      isApproved: post?.isApproved ?? true,
      html: post?.html ?? "",
      thumbnailUrl: post?.thumbnailUrl,
      postId: post?.post_id,
      board: post?.board,
      createdAt: post?.createdAt,
      userId: post?.userId ?? props.session.user.id,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof schema>) {
    if (isUploading) {
      return;
    }

    if (plateEditorRef.current) {
      const html = await plateEditorRef.current.getHtml();
      if (!html) {
        return null;
      }

      values.html = html;

      setIsUploading(true);

      try {
        const postId = await submit(values);
        if (postId) {
          router.push(`/post/view/${postId}`);
        }
      } catch (e) {
        // toast("업로드에 실패했습니다.");
        console.error(e);
      } finally {
        setIsUploading(false);
      }
    }
  }

  async function onError(values: any) {
    // toast.error(values);
    console.log(values);
  }

  const submit = async (values: z.infer<typeof schema>) => {
    if (values.thumbnailFile?.length === 1) {
      values.thumbnailUrl = (await uploadThumbnail(
        values.thumbnailFile[0] as File,
      )) as string;
      delete values.thumbnailFile;
    }

    const response = await fetchR("/api/post", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const body = await response.json();
    if (!response.ok) {
      toast.error(body.message);
      return null;
    }

    return body.postId;
  };

  const fileRef = form.register("thumbnailFile");

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
                      default={post?.category}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issueId"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>이슈</FormLabel>
                  <FormControl>
                    <Navigation
                      onValueChange={(value: IssueUnion) => {
                        form.setValue("issueId", value);
                      }}
                      selects={issueSelection}
                      default={post?.issue_id}
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
                    <PlateEditor html={post?.html} ref={plateEditorRef} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="subgrid my-gap">
            <FormField
              control={form.control}
              name="thumbnailFile"
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
              name="isApproved"
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
