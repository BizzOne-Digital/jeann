import { beforeEach, describe, expect, it, vi } from "vitest";

const created: Record<string, unknown>[] = [];
const notify = vi.fn();

vi.mock("@/lib/api/require-api-auth", () => ({
  requireApiAuth: vi.fn(async () => ({
    ctx: {
      userId: "u1",
      memberships: [{ organizationId: "org1", roles: ["agent_org_admin"], status: "active" }],
    },
    sessionUserId: "u1",
  })),
  handleApiError: (e: unknown) => {
    throw e;
  },
}));
vi.mock("@/lib/db/mongoose", () => ({ tryConnectMongo: vi.fn(async () => true) }));
vi.mock("@/lib/audit/log", () => ({ writeAuditEvent: vi.fn(async () => undefined) }));
vi.mock("@/lib/api/request-meta", () => ({ auditRequestMeta: () => ({}) }));
vi.mock("@/lib/notifications/service", () => ({ notifyAdmins: (...a: unknown[]) => notify(...a) }));
vi.mock("@/models", () => ({
  AgentDeal: {
    create: vi.fn(async (d: Record<string, unknown>) => {
      created.push(d);
      return { _id: "deal1", ...d };
    }),
  },
}));

import { POST } from "@/app/api/portal/agent/deals/route";

function req(fields: Record<string, string>, file?: File) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  if (file) form.set("file", file);
  return { formData: async () => form } as never;
}

const base = { buyerCompanyName: "Buyer Co", productName: "Rice", documentType: "loi", buyerEmail: "", quantity: "" };

describe("agent deal submission", () => {
  beforeEach(() => {
    created.length = 0;
    notify.mockClear();
  });

  it("stores the buyer's LOI against the agent organization and notifies staff", async () => {
    const res = await POST(req(base, new File(["%PDF-1.4"], "loi.pdf", { type: "application/pdf" })));
    expect(res.status).toBe(200);
    expect(created).toHaveLength(1);
    expect(created[0]).toMatchObject({ agentOrganizationId: "org1", documentType: "loi", buyerCompanyName: "Buyer Co" });
    expect(created[0].buyerEmail).toBeUndefined();
    expect(notify).toHaveBeenCalledOnce();
  });

  it("rejects a missing file, a bad file type and a missing buyer", async () => {
    expect((await POST(req(base))).status).toBe(422);
    expect((await POST(req(base, new File(["x"], "run.exe")))).status).toBe(422);
    expect((await POST(req({ ...base, buyerCompanyName: "" }, new File(["x"], "a.pdf")))).status).toBe(422);
    expect(created).toHaveLength(0);
  });
});
