"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  id: z
    .string({ required_error: "A unique ID is required" })
    .min(1, "A unique ID is required."),
  name: z
    .string({ required_error: "A unique name is required" })
    .min(1, "A valid name is required."),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required."),
});

export default function SignUpPage() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    try {
      const signUpData = await signUpSchema.parseAsync(values);
      const response = await fetch("/api/user", {
        method: "POST",
        body: JSON.stringify(signUpData),
      });

      if (response.status === 200) {
        alert("회원가입 성공!");
      } else if (response.status === 400) {
        alert("이미 있는 ID입니다.");
      } else {
        alert("회원가입 실패. 개발자에게 문의하세요.");
      }
    } catch (error: any) {
      console.error(error);
      alert("회원가입 실패. 개발자에게 문의하세요.");
    }
  }

  return (
    <div className="w-1/2">
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
                <FormDescription>
                  This a unique ID to make a new account.
                </FormDescription>
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
                <FormDescription>
                  This is your public display name.
                </FormDescription>
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
                  This is your password. This is neither changeable or findable.
                  <br />
                  Even the developer cannot restore the password.
                  <br />
                  You should contact the developer if you forget this and
                  he&#39;ll make a new one for you.
                  <br />
                  And <strong>THAT GON MAKE HIM MAD</strong>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
