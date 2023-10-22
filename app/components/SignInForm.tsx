"use client";

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
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GoogleSignInButton from "./GoogleSignInButton";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { FcGoogle } from "react-icons/fc";

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

function SignInForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
      });

      console.log("signInData:", signInData); // Add this line for debugging

      if (signInData?.ok) {
        router.push("/dashboard");
      } else {
        toast({
          title: "Error",
          description: "Oops! Something went wrong",
        });
      }

      // if (signInData?.error) {
      // } else {
      //   console.log("Successful login, redirecting...");
      //   router.push("/dashboard");
      // }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault(); // Prevent the default form submission behavior
          form.handleSubmit(onSubmit)(e); // Continue with your form submission logic
        }}
        className="w-full"
      >
        <div className=" space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="youremail@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className=" w-full mt-6" type="submit">
          Sign In
        </Button>
      </form>

      <div
        className="mx-auto my-4 flex w-full items-center justify-evenly
        before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400
        after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400"
      >
        or
      </div>
      <GoogleSignInButton>
        <div className="flex gap-2 items-center">
          <p className=" text-lg">
            <FcGoogle />
          </p>
          <p>Sign in with Google</p>
        </div>
      </GoogleSignInButton>

      <p className="text-center text-sm Otext-gray-600 mt-2">
        If you don&apos;t have an account, please{" "}
        <Link className=" text-orange-500 hover:underline" href={"/sign-up"}>
          Sign up
        </Link>
      </p>
    </Form>
  );
}

export default SignInForm;
