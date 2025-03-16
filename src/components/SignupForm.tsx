"use client";

import * as z from "zod";
import { AutoForm } from "~/ui/forms/AutoForm/AutoForm";
import { UseFormReturn } from "react-hook-form";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const baseSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
});

type SignupFormValues = z.infer<typeof baseSchema>;

type FieldConfigType = {
  [K in keyof SignupFormValues]: {
    fieldType: "input";
    inputProps: {
      label: string;
      type: string;
      placeholder: string;
    };
  };
};

export const SignupForm = () => {
  const router = useRouter();
  const signup = api.auth.signup.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/login");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const fieldConfig: FieldConfigType = {
    email: {
      fieldType: "input",
      inputProps: {
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
      },
    },
    password: {
      fieldType: "input",
      inputProps: {
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
      },
    },
    confirmPassword: {
      fieldType: "input",
      inputProps: {
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm your password",
      },
    },
  };

  const handleSubmit = async (
    values: SignupFormValues,
    form: UseFormReturn<SignupFormValues>
  ) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords don't match" });
      return;
    }

    try {
      await signup.mutateAsync({
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Sign Up</h2>
        <AutoForm<typeof baseSchema>
          schema={baseSchema}
          fieldConfig={fieldConfig}
          onSubmitProps={handleSubmit}
        />
      </div>
    </main>
  );
};
