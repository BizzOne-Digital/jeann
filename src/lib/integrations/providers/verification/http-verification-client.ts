import { getEnv } from "@/lib/config/env";

export type VerificationChannel = "kyb" | "tic";

function channelConfig(channel: VerificationChannel) {
  const env = getEnv();
  if (channel === "kyb") {
    return {
      apiKey: env.KYB_VERIFICATION_API_KEY?.trim(),
      baseUrl: env.KYB_VERIFICATION_API_BASE_URL?.replace(/\/$/, ""),
      label: "KYB",
    };
  }
  return {
    apiKey: env.TIC_VERIFICATION_API_KEY?.trim(),
    baseUrl: env.TIC_VERIFICATION_API_BASE_URL?.replace(/\/$/, ""),
    label: "TIC",
  };
}

export function isVerificationChannelConfigured(channel: VerificationChannel): boolean {
  return Boolean(channelConfig(channel).apiKey);
}

export async function verificationChannelHealth(channel: VerificationChannel) {
  const { apiKey, baseUrl, label } = channelConfig(channel);
  if (!apiKey) {
    return { ok: false, message: `${label} verification API key is not set.` };
  }
  if (!baseUrl) {
    return {
      ok: true,
      message: `${label} API key present — set ${channel === "kyb" ? "KYB" : "TIC"}_VERIFICATION_API_BASE_URL when the vendor endpoint is confirmed.`,
    };
  }
  try {
    const res = await fetch(baseUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, message: `${label} API key rejected by upstream (${res.status}).` };
    }
    return {
      ok: true,
      message: `${label} endpoint reachable (HTTP ${res.status}).`,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : `${label} endpoint unreachable.`,
    };
  }
}

export async function submitVerificationRequest(
  channel: VerificationChannel,
  payload: Record<string, unknown>,
) {
  const { apiKey, baseUrl, label } = channelConfig(channel);
  if (!apiKey) throw new Error(`${channel}_verification_not_configured`);
  if (!baseUrl) {
    throw new Error(`${channel}_verification_base_url_missing`);
  }

  const res = await fetch(`${baseUrl}/verify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`${label} verification failed (${res.status}): ${text.slice(0, 300)}`);
  }
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return { raw: text };
  }
}
