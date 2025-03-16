"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";
import { LoginForm } from "~/components/LoginForm";

export default function LoginPage() {
  const { status } = useSession();

  useLayoutEffect(() => {
    if (status === "authenticated") {
      redirect("/dashboard");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>
        <LoginForm />
      </div>
    </main>
  );
}
