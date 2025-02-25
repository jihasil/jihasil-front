"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Toaster } from "@/components/ui/sonner";
import SubmitButton from "@/components/ui/submit-button";
import { changePassword } from "@/features/change-password";
import { signOut } from "@/features/sign-out";
import { Session } from "@/shared/types/auth-types";
import { changePasswordSchema } from "@/shared/types/user-types";
import PreventRoute from "@/widgets/prevent-route";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditUser(props: { session: Session }) {
  const searchParams = useSearchParams();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof changePasswordSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (isUploading) return;

    setIsUploading(true);
    const redirectTo = searchParams.get("from") ?? "/";

    const result = await changePassword(values);

    if (result) {
      toast.success("비밀번호를 변경했습니다. 다시 로그인해주세요");
      await signOut(props.session);
      router.push(redirectTo);
    } else {
      toast.error("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
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
            name="newPassword"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>새 비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="새 비밀번호를 입력해주세요"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>기존 비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="기존 비밀번호를 입력해주세요."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton isUploading={isUploading} text={"변경하기"} />
        </form>
      </Form>
    </div>
  );
}
