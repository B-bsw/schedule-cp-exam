"use client";

import { FormEvent, useState } from "react";

export default function AdminSchedulePage() {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const response = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        url: link,
      }),
    });

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      setError(data.error ?? "Failed to add source");
      setIsLoading(false);
      return;
    }

    setName("");
    setLink("");
    setSuccess("Added source successfully");
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Schedule</h1>
          <p className="mt-2 text-sm text-gray-600">
            เพิ่มแหล่งข้อมูลสำหรับ dropdown โดยกรอก name และ link
          </p>
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Name"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              type="text"
              placeholder="Link"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {success ? <p className="text-sm text-green-700">{success}</p> : null}
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Add source"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
