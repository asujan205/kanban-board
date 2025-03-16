"use client";

import * as z from "zod";
import { AutoForm } from "~/ui/forms/AutoForm/AutoForm";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();

  const fieldConfig = {
    email: {
      fieldType: "input" as const,
      inputProps: {
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
      },
    },
    password: {
      fieldType: "input" as const,
      inputProps: {
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
      },
    },
  };

  const handleSubmit = async (values: LoginFormType) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Logged in successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast.error(error?.message ?? "An error occurred");
    }
  };

  return (
    <>
      <AutoForm
        schema={loginSchema}
        fieldConfig={fieldConfig}
        onSubmitProps={handleSubmit}
      />
      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}; 