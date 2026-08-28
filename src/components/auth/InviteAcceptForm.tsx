"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InviteInfo = {
  valid: boolean;
  email?: string;
  contactName?: string;
  organizationType?: string;
  intendedLegalName?: string;
  reason?: string;
};

export function InviteAcceptForm({ token, invite }: { token: string; invite: InviteInfo }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(invite.contactName?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(
    invite.contactName?.split(" ").slice(1).join(" ") ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!invite.valid) {
    return (
      <p className="mt-4 text-sm text-red-600">
        This invitation is {invite.reason ?? "no longer valid"}. Contact Finekarts for a new invite.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/invite/${encodeURIComponent(token)}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, firstName, lastName }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Unable to accept invitation.");
      return;
    }
    router.push(data.redirectTo ?? "/login");
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-4 max-w-md">
      <p className="text-sm text-[var(--stone)]">
        {invite.intendedLegalName
          ? `Organization: ${invite.intendedLegalName}`
          : `Role: ${invite.organizationType}`}
      </p>
      <p className="text-sm font-medium text-[var(--navy)]">{invite.email}</p>
      <input
        className="input w-full"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        className="input w-full"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        className="input w-full"
        type="password"
        placeholder="Password (min 12 chars)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={12}
        required
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Creating account…" : "Accept invitation"}
      </button>
    </form>
  );
}
