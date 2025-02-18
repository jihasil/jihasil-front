"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { requestSignIn } from "@/features/request-sign-in";
import PreventRoute from "@/widgets/prevent-route";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignIn() {
  const searchParams = useSearchParams();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const signInSchema = z.object({
    id: z
      .string({ required_error: "A unique ID is required" })
      .min(1, "A unique ID is required."),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required."),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (isUploading) return;

    setIsUploading(true);
    const signInData = await signInSchema.parseAsync(values);
    const next = searchParams.get("from") ?? "/";

    const result = await requestSignIn(signInData, next);

    if (!result) {
      toast.error("아이디와 비밀번호를 확인해주세요.");
    }
    setIsUploading(false);
  }

  return (
    <div className="md:col-span-4 col-span-2 lg:col-start-5 md:col-start-3 col-start-2 w-full grid grid-cols-subgrid">
      <PreventRoute isUploading={isUploading} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="col-span-full grid grid-cols-subgrid my-gap"
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID를 입력해주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton isUploading={isUploading} text={"로그인"} />
        </form>
      </Form>
      <Toaster />
    </div>
  );
}
