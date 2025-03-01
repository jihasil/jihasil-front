"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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
import SubmitButton from "@/app/(front)/components/ui/submit-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/(front)/components/ui/tooltip";
import { cn } from "@/app/(front)/shared/lib/utils";
import PreventRoute from "@/app/(front)/widgets/prevent-route";
import { signInSchema } from "@/app/global/types/user-types";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignIn() {
  const searchParams = useSearchParams();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

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
    const redirectTo = searchParams.get("from") ?? "/";

    const result = await fetch("/api/signIn", {
      method: "POST",
      body: JSON.stringify({ ...signInData }),
    });

    console.log(result);
    const body = await result.json();

    if (!result.ok) {
      toast.error(body.message);
    } else {
      toast.success(body.message);
      router.push(redirectTo);
      router.refresh();
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("col-start-1 col-span-2 text-sm")}>
                  <p>비밀번호를 잊어버렸어요.</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>관리자에게 연락하세요.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </Form>
    </div>
  );
}
