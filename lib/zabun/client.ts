import type { ZabunConfig } from "./types";

export const ZABUN_BASE_URL = "https://public.api-cms.zabun.be";

function getConfig(): ZabunConfig {
  const xClientId = process.env.ZABUN_X_CLIENT_ID;
  const apiKey = process.env.ZABUN_API_KEY;
  const clientId = process.env.ZABUN_CLIENT_ID;
  const serverId = process.env.ZABUN_SERVER_ID;

  if (!xClientId || !apiKey || !clientId || !serverId) {
    throw new Error(
      "Zabun credentials missing. Set ZABUN_X_CLIENT_ID, ZABUN_API_KEY, ZABUN_CLIENT_ID, ZABUN_SERVER_ID in .env.local"
    );
  }

  return { xClientId, apiKey, clientId, serverId };
}

function authHeaders(): HeadersInit {
  const config = getConfig();
  return {
    "Content-Type": "application/json",
    "X-Client-ID": config.xClientId,
    api_key: config.apiKey,
    client_id: config.clientId,
    server_id: config.serverId,
  };
}

export async function zabunGet<T>(
  path: string,
  options: { revalidate?: number } = {}
): Promise<T> {
  const res = await fetch(`${ZABUN_BASE_URL}/${path}`, {
    headers: authHeaders(),
    next: { revalidate: options.revalidate ?? 300 }, // 5 min cache by default
  });

  if (!res.ok) {
    throw new Error(`Zabun GET /${path} failed: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function zabunPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${ZABUN_BASE_URL}/${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Zabun POST /${path} failed: ${res.status} ${res.statusText} — ${text}`);
  }

  return res.json();
}

export async function checkConnection(): Promise<boolean> {
  try {
    await zabunGet("auth/v1/heartbeat", { revalidate: 0 });
    return true;
  } catch {
    return false;
  }
}
