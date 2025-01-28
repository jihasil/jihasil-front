"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { z } from "zod";

import { requestSignIn } from "@/app/user/signIn/action";
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
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  id: z
    .string({ required_error: "A unique ID is required" })
    .min(1, "A unique ID is required."),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required."),
});

export default function SignIn() {
  const searchParams = useSearchParams();

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
    console.log(values);
    const signInData = await signInSchema.parseAsync(values);
    const next = searchParams.get("from") ?? "/";
    const result = await requestSignIn(signInData, next);
    if (!result) {
      toast.error("아이디와 비밀번호를 확인해주세요.");
    }
  }

  return (
    <div className="flex w-fit flex-col my-gap">
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
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">로그인</Button>
        </form>
      </Form>
      <div className="flex flex-col my-gap">
        혹은
        <Button type="submit" className="w-fit">
          <Link href="/user/signUp">회원가입</Link>
        </Button>
      </div>
      <Toaster />
    </div>
  );
}
