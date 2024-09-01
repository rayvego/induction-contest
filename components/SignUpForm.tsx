"use client";

import { SignUpFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "./ui/form";
import CustomInputSignUp from "./CustomInputSignUp";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/user.actions";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // 1. Define your form.
  // SignUpFormSchema is the schema we defined in utils.ts
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    try {
      const newUser = await signUp(values);
      console.log(newUser);
      router.push("/");
    } catch (error : any) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
            <CustomInputSignUp
              control={form.control}
              label={"Username"}
              name={"username"}
              placeholder={"Enter your username"}
            />
            <CustomInputSignUp control={form.control} label={"Email"} name={"email"} placeholder={"Enter your email"} />
            <CustomInputSignUp
              control={form.control}
              label={"Password"}
              name={"password"}
              placeholder={"Enter your password"}
            />
            <Link href="/sign-in">Already have an account?</Link>
            <div className="pt-2 flex justify-center">
              <Button type="submit" disabled={isLoading ? true : false}>
                {!isLoading && "Sign Up"}
                {isLoading && <Loader2 className="animate-spin" />}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
