"use client";

import Link from "next/link";
import { useState } from "react";
import AuthShell from "./AuthShell";
import Field from "./Field";
import { useAuthForm } from "./useAuthForm";
import { primaryBtn } from "@/components/home/styles";

export default function RegisterForm() {
  const { submit, loading, error } = useAuthForm("/api/auth/register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Create your account"
      subtitle="Ten free generations are included."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-300 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit({ name, email, password });
        }}
        className="space-y-4"
      >
        <Field
          id="name"
          label="Name"
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
        />
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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          minLength={8}
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
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
