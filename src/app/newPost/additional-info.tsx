"use client";

import { notFound } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/ui/navigation";
import { categorySelection } from "@/const/category";
import { issueOnNewPost } from "@/const/issue";
import { zodResolver } from "@hookform/resolvers/zod";

export default function AdditionalInfo() {
  const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const signUpSchema = z.object({
    thumbnail: z
      .any()
      .optional()
      .refine(
        (file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
        "Invalid file. choose either jpg, webp, or png image",
      ),
    title: z
      .string({ required_error: "제목을 입력해주세요." })
      .min(1, "A valid title is required."),
    subtitle: z
      .string({ required_error: "부제목을 입력해주세요." })
      .min(1, "A valid subtitle is required."),
    category: z.enum(
      ...categorySelection.map((value) => {
        return value.display;
      }),
      { required_error: "카테고리를 선택하세요." },
    ),
    author: z
      .string({ required_error: "글쓴이를 입력하세요" })
      .min(1, "글쓴이를 입력하세요."),
    issue_id: z.enum(
      ...issueOnNewPost.map((value) => {
        return value.display;
      }),
      { required_error: "이슈를 선택하세요." },
    ),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      thumbnail: "",
      title: "",
      subtitle: "",
      category: "",
      author: "",
      issue_id: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div className="w-1/2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="thumbnail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>썸네일</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
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
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <FormControl>
                  <Navigation
                    onValueChange={(category: string) => {
                      form.setValue("category", category);
                    }}
                    selects={categorySelection}
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
              <FormItem>
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

          <FormField
            control={form.control}
            name="issue_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이슈</FormLabel>
                <FormControl>
                  <Navigation
                    onValueChange={(issueFilter: string) => {
                      form.setValue("issue_id", issueFilter);
                    }}
                    selects={issueOnNewPost}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
