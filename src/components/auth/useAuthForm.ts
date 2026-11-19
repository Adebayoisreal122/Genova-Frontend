"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, setToken } from "@/lib/api";

interface AuthResponse {
  token: string;
}

/** Shared submit logic for the sign-in and register forms. */
export function useAuthForm(endpoint: "/api/auth/login" | "/api/auth/register") {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Already signed in? Skip the form. Otherwise warm up the dashboard bundle for after sign-in.
    if (getToken()) router.replace("/dashboard");
    else router.prefetch("/dashboard");
  }, [router]);

  const submit = async (body: Record<string, string>) => {
    setLoading(true);
    setError("");
    try {
      const data = await api<AuthResponse>(endpoint, { method: "POST", json: body });
      setToken(data.token);
      router.replace("/dashboard");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return { submit, loading, error };
}
