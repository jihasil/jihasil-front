"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

export const signUpSchema = z.object({
  id: z
    .string({ required_error: "A unique ID is required" })
    .min(1, "A unique ID is required"),
  name: z
    .string({ required_error: "A unique name is required" })
    .min(1, "A valid name is required"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      id: "ID를 입력하세요.",
      name: "이름을 입력하세요.",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signUpSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
}
