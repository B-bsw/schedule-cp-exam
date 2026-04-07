export const ADMIN_SESSION_COOKIE = "admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 3;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
};

function getSecret(): string {
  return (
    process.env.jwt ?? process.env.ADMIN_SESSION_SECRET ?? "change-me-in-env"
  );
}

function base64UrlEncode(input: Uint8Array | string): string {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(input: string): Uint8Array {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const output = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    output[i] = binary.charCodeAt(i);
  }
  return output;
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return base64UrlEncode(new Uint8Array(signature));
}

function parsePayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payloadRaw = decoder.decode(base64UrlDecode(parts[1]));
    const payload = JSON.parse(payloadRaw) as Partial<JwtPayload>;
    if (
      typeof payload.sub !== "string" ||
      typeof payload.iat !== "number" ||
      typeof payload.exp !== "number"
    ) {
      return null;
    }
    return payload as JwtPayload;
  } catch {
    return null;
  }
}

export async function createAdminSession(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const payload: JwtPayload = {
    sub: username,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(unsignedToken);

  return `${unsignedToken}.${signature}`;
}

export async function verifyAdminSession(token?: string): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const unsignedToken = `${parts[0]}.${parts[1]}`;
  const expectedSignature = await sign(unsignedToken);
  if (expectedSignature !== parts[2]) return false;

  const payload = parsePayload(token);
  if (!payload) return false;

  const now = Math.floor(Date.now() / 1000);
  return payload.exp > now;
}
