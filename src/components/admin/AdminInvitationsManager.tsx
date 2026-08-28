"use client";

import { FormEvent, useEffect, useState } from "react";

type InvitationRow = {
  id: string;
  email: string;
  contactName?: string;
  organizationType: string;
  roles: string[];
  status: string;
  expiresAt: string;
  createdAt: string;
};

const ORG_TYPES = [
  { value: "buyer", label: "Buyer organization" },
  { value: "supplier", label: "Supplier organization" },
  { value: "internal", label: "Internal (employee)" },
  { value: "banking_adviser", label: "Banking adviser" },
] as const;

const ROLE_OPTIONS: Record<string, { value: string; label: string }[]> = {
  buyer: [
    { value: "buyer_org_admin", label: "Buyer org admin" },
    { value: "buyer_member", label: "Buyer member" },
  ],
  supplier: [
    { value: "supplier_org_admin", label: "Supplier org admin" },
    { value: "supplier_member", label: "Supplier member" },
  ],
  internal: [
    { value: "employee_operations", label: "Operations" },
    { value: "trade_manager", label: "Trade manager" },
    { value: "finance", label: "Finance" },
    { value: "compliance_reviewer", label: "Compliance" },
    { value: "general_manager", label: "General manager" },
  ],
  banking_adviser: [{ value: "banking_advisor", label: "Banking adviser" }],
};

export function AdminInvitationsManager() {
  const [items, setItems] = useState<InvitationRow[]>([]);
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationType, setOrganizationType] = useState<string>("supplier");
  const [intendedLegalName, setIntendedLegalName] = useState("");
  const [roles, setRoles] = useState<string[]>(["supplier_org_admin"]);
  const [message, setMessage] = useState<string | null>(null);
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function load() {
    fetch("/api/admin/invitations", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setItems(json.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const defaults = ROLE_OPTIONS[organizationType] ?? [];
    setRoles(defaults[0] ? [defaults[0].value] : []);
  }, [organizationType]);

  function toggleRole(role: string) {
    setRoles((current) =>
      current.includes(role) ? current.filter((r) => r !== role) : [...current, role],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!roles.length) {
      setError("Select at least one role.");
      return;
    }
    setBusy(true);
    setMessage(null);
    setLastInviteUrl(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          email,
          contactName: contactName || undefined,
          phone: phone || undefined,
          organizationType,
          intendedLegalName: intendedLegalName || undefined,
          roles,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Unable to send invitation");
      setMessage("Invitation sent.");
      setLastInviteUrl(json.inviteUrl ?? null);
      setEmail("");
      setContactName("");
      setPhone("");
      setIntendedLegalName("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function invitationAction(id: string, action: "resend" | "revoke") {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/invitations/${id}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: action === "revoke" ? "revoke" : undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Action failed");
      setMessage(action === "revoke" ? "Invitation revoked." : "Invitation resent.");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  const roleChoices = ROLE_OPTIONS[organizationType] ?? [];

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-lg border border-[var(--line)] bg-white p-5 lg:grid-cols-2"
      >
        <h2 className="lg:col-span-2 font-semibold text-[var(--navy)]">Send invitation</h2>

        <label className="label">
          Email
          <input
            className="field mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="label">
          Contact name
          <input
            className="field mt-1"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />
        </label>

        <label className="label">
          Phone
          <input className="field mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <label className="label">
          Organization type
          <select
            className="field mt-1"
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
          >
            {ORG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="label lg:col-span-2">
          Intended legal name (new org)
          <input
            className="field mt-1"
            value={intendedLegalName}
            onChange={(e) => setIntendedLegalName(e.target.value)}
            placeholder="e.g. Quaid-E-Azam University Trading"
          />
        </label>

        <fieldset className="lg:col-span-2">
          <legend className="label text-sm">Roles</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {roleChoices.map((r) => (
              <label key={r.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={roles.includes(r.value)}
                  onChange={() => toggleRole(r.value)}
                />
                {r.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="lg:col-span-2">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Sending…" : "Send invitation"}
          </button>
        </div>
      </form>

      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
      {lastInviteUrl ? (
        <div className="rounded-md border border-[var(--line)] bg-[var(--cream)]/40 p-4 text-sm">
          <p className="font-medium text-[var(--navy)]">Development invite link</p>
          <p className="mt-1 text-xs text-[var(--stone)]">
            Copy this URL — the terminal <code>console_…</code> id is not the invite token.
          </p>
          <a href={lastInviteUrl} className="mt-2 block break-all text-[var(--navy)] underline">
            {lastInviteUrl}
          </a>
        </div>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <section>
        <h2 className="font-semibold text-[var(--navy)]">Recent invitations</h2>
        {items.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--stone)]">No invitations yet.</p>
        ) : (
          <div className="table-scroll mt-3 rounded-lg border border-[var(--line)] bg-white">
            <table className="min-w-full text-sm">
              <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase text-[var(--stone)]">
                <tr>
                  <th className="px-4 py-3 text-left">Invitee</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Roles</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{i.email}</p>
                      {i.contactName ? (
                        <p className="text-xs text-[var(--stone)]">{i.contactName}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 capitalize">{i.organizationType.replaceAll("_", " ")}</td>
                    <td className="px-4 py-3 text-xs">{i.roles.join(", ")}</td>
                    <td className="px-4 py-3 capitalize">{i.status}</td>
                    <td className="px-4 py-3">
                      {i.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn text-xs"
                            disabled={busy}
                            onClick={() => invitationAction(i.id, "resend")}
                          >
                            Resend
                          </button>
                          <button
                            type="button"
                            className="btn text-xs"
                            disabled={busy}
                            onClick={() => invitationAction(i.id, "revoke")}
                          >
                            Revoke
                          </button>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
