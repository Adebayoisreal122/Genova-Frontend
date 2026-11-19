"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "./AuthShell";
import Field from "./Field";
import { useAuthForm } from "./useAuthForm";
import { primaryBtn } from "@/components/home/styles";

export default function LoginForm() {
  const { submit, loading, error } = useAuthForm("/api/auth/login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="text-indigo-300 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit({ email, password });
        }}
        className="space-y-4"
      >
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className={`${primaryBtn} w-full disabled:opacity-60`}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
