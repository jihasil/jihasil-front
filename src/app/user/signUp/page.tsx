"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";

import PreventRoute from "@/app/prevent-route";
import { requestSignIn } from "@/app/user/signIn/action";
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
import SubmitButton from "@/components/ui/submit-button";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const signUpSchema = z.object({
    id: z.string().min(1, "ID를 입력해주세요."),
    name: z.string().min(1, "이름을 입력해주세요."),
    password: z.string().min(1, "비밀번호를 입력해주세요."),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      id: "",
      name: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    if (isUploading) return;
    setIsUploading(true);

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    try {
      const signUpData = await signUpSchema.parseAsync(values);
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(signUpData),
      });
      const body = response.json();
      toast.info(body);
      setIsUploading(false);

      await requestSignIn(
        { id: signUpData.id, password: signUpData.password },
        "/",
      );
    } catch (error: any) {
      console.error(error);
      toast.error("회원가입 실패. 개발자에게 문의하세요.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="w-fit">
      <PreventRoute isUploading={isUploading} />
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="lg:space-y-6 md:space-y-5 space-y-4"
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  비밀번호는 개발자도 볼 수 없습니다. <br />
                  비밀번호 재발급은 개발자에게 문의하세요.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton isUploading={isUploading} text={"가입하기"} />
        </form>
      </Form>
    </div>
  );
}
