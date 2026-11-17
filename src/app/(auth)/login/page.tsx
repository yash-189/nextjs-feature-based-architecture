import type { Metadata } from "next";
import { LoginForm } from "@/features/auth";
import { env } from "@/lib/env";
import { DEMO_CREDENTIALS } from "@/mocks/constants";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6">
      <h1 className="font-semibold text-2xl tracking-tight">Sign in</h1>
      {env.isMocking && (
        <p className="rounded-md border bg-muted px-3 py-2 text-muted-foreground text-sm">
          Demo account: <strong>{DEMO_CREDENTIALS.email}</strong> /{" "}
          <strong>{DEMO_CREDENTIALS.password}</strong>
        </p>
      )}
      <LoginForm />
    </main>
  );
}
