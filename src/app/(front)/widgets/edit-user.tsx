"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { signOut } from "@/app/(back)/application/model/sign-out";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/(front)/components/ui/form";
import { Input } from "@/app/(front)/components/ui/input";
import SubmitButton from "@/app/(front)/components/ui/submit-button";
import { fetchR } from "@/app/(front)/shared/lib/request";
import PreventRoute from "@/app/(front)/widgets/prevent-route";
import { Session } from "@/app/global/types/auth-types";
import { changePasswordSchema } from "@/app/global/types/user-types";
import { zodResolver } from "@hookform/resolvers/zod";

export default function EditUser(props: { session: Session }) {
  const searchParams = useSearchParams();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();
  const { session } = props;

  const userId = searchParams.get("userId") ?? session.user.id;

  // 1. Define your form.
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      id: userId,
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

    const result = await fetchR("/api/user/password", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const body = await result.json();

    if (result.ok) {
      if (userId === session.user.id) {
        toast.success(body.message);
        await signOut(session);
      } else {
        toast.success(body.message);
      }
      router.push(redirectTo);
    } else {
      toast.error(body.message);
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
