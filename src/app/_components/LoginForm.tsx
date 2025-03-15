"use client";

import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/ui/components/card";
import { AutoForm } from "~/ui/forms/AutoForm/AutoForm";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginForm = () => {
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

  return (
    <Card>
      <CardTitle>Login</CardTitle>
      <CardDescription>Enter your credentials to login.</CardDescription>
      <CardContent>
        <AutoForm
          schema={loginSchema}
          fieldConfig={fieldConfig}
          onSubmitProps={(data) => {
            console.log("Login data:", data);
            // Handle login logic here
          }}
        />
      </CardContent>
    </Card>
  );
};
