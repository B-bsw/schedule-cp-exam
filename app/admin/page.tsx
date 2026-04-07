"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Login failed");
      setIsLoading(false);
      return;
    }

    router.push("/admin/schedule");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-gray-900">Admin Login</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
