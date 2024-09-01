"use client";

import { SignInFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import CustomInputSignIn from "./CustomInputSignIn";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/actions/user.actions";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // 1. Define your form.
  // SignInFormSchema is the schema we defined in utils.ts
  const form = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      const response = await signIn(values);

      if (response) {
        console.log(response);
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    console.log(values);
  }

  return (
    <div className="p-10 bg-white shadow-xl rounded-xl flex flex-col items-center space-y-8">
      <div className="flex justify-center items-center flex-col space-y-2">
        <h1 className="text-4xl">Raysume 🔮</h1>
        <span className="text-muted-foreground">Make Resumes Faster Than EVER with AI!</span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4 w-[400px] flex justify-center flex-col">
            <CustomInputSignIn control={form.control} label={"Email"} name={"email"} placeholder={"Enter your email"} />
            <CustomInputSignIn
              control={form.control}
              label={"Password"}
              name={"password"}
              placeholder={"Enter your password"}
            />
            <Link href="/sign-up">Don't have an account?</Link>
            <div className="pt-2 flex justify-center">
              <Button type="submit" disabled={isLoading ? true : false}>
                {!isLoading && "Sign In"}
                {isLoading && <Loader2 className="animate-spin" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
