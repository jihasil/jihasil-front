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
  id: z.string().min(1, "ID를 입력해주세요."),
  name: z.string().min(1, "이름을 입력해주세요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export default function SignUpPage() {
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
    <div className="w-fit">
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

          <Button type="submit">회원가입</Button>
        </form>
      </Form>
    </div>
  );
}
