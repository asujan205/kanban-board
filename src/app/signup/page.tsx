"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";

import { SignupForm } from "~/components/SignupForm";

export default function SignupPage() {
  const { data: session, status } = useSession();

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
    <div>
      <SignupForm />
    </div>
  );
}
