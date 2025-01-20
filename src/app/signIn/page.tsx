"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { requestSignIn } from "@/app/signIn/action";
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
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  id: z
    .string({ required_error: "A unique ID is required" })
    .min(1, "A unique ID is required."),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required."),
});

export default function SignInPage() {
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

    const result = await requestSignIn(signInData);
    if (!result) {
      alert("아이디와 비밀번호를 확인해주세요.");
    }
  }

  return (
    <div className="w-1/2 flex flex-col gap-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {process.env.NEXT_PUBLIC_ENV === "development" ? (
        <div className="flex flex-col gap-5">
          <Separator />
          or
          <Button type="submit" className="w-fit">
            <Link href="/signUp">Sign Up</Link>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
