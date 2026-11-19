export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

const TOKEN_KEY = "token";
export const getToken = () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY));
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

interface Options {
  method?: "GET" | "POST" | "DELETE";
  json?: unknown;
  form?: FormData;
  signal?: AbortSignal;
}

/** Small fetch wrapper: adds the token, parses JSON and throws readable errors. */
export async function api<T>(path: string, { method = "GET", json, form, signal }: Options = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (json !== undefined) headers["Content-Type"] = "application/json";

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: form ?? (json !== undefined ? JSON.stringify(json) : undefined),
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    /* empty or non-JSON body */
  }

  if (!res.ok) {
    // An expired token anywhere in the app sends the user back to sign in.
    if (res.status === 401 && token) {
      clearToken();
      window.location.assign("/login");
    }
    const body = data as { error?: string; message?: string } | null;
    throw new ApiError(body?.error ?? body?.message ?? "Something went wrong. Please try again.", res.status);
  }
  return data as T;
}
