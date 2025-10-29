import { cookies as nextCookies, headers as nextHeaders } from 'next/headers';
import type {IncomingHttpHeaders} from "http";
import {JWT} from "@/utils/config";


/**
 * Read JWT cookie on the server robustly.
 * Priority:
 * 1) next/headers.cookies() if available (App Router server env)
 * 2) Provided `headers` param (WHATWG Headers or Node IncomingHttpHeaders)
 * 3) next/headers() fallback to read raw cookie header
 */
export async function getJwtCookieFromServer(
  headers?: Headers | IncomingHttpHeaders | null
): Promise<string | null> {
    // 1) Prefer Next.js cookies()
    try {
        const store = await nextCookies();
        const v = store.get(JWT)?.value;
        if (v) return v;
    } catch {}

    // 2) Provided headers param
    let raw: string | null = null;
    if (headers) {
        if (typeof (headers as any).get === 'function') {
            raw = (headers as Headers).get('cookie');         // WHATWG Headers
        } else {
            raw = (headers as IncomingHttpHeaders).cookie ?? null; // Node headers
        }
    }

    // 3) Fallback: current request headers
    if (!raw) {
        try {
            const h = await nextHeaders();
            raw = h.get('cookie');
        } catch {}
    }

    if (!raw) return null;
    const map = Object.fromEntries(
      raw.split(';').map((c) => {
          const [k, ...rest] = c.trim().split('=');
          return [k, rest.join('=')];
      })
    );
    return (map as Record<string, string>)[JWT] ?? null;
}


export async function setForwardedHeaders(reqHeaders: IncomingHttpHeaders): Promise<Record<string, string>> {
  const out: Record<string, string> = {};

  if (reqHeaders.host) {
    out["host"] = reqHeaders.host;
  }

  const realIp = reqHeaders["x-real-ip"];
  if (realIp) {
    out["x-real-ip"] = String(realIp);
  }

  const forwardedFor = reqHeaders["x-forwarded-for"];
  if (forwardedFor) {
    out["x-forwarded-for"] = String(forwardedFor);
  }

  const auth = await getJwtCookieFromServer(reqHeaders);
  if (auth) {
    out["authorization"] = `Bearer ${auth}`;
  }

  return out;
}

function decodeBase64Url(input: string): string {
    const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = '==='.slice((b64.length + 3) % 4);
    return atob(b64 + pad);
}

export function parseJwtClaims(token?: string): any {
    if (!token) return {};
    const parts = token.split('.');
    if (parts.length < 2) return {};
    try {
        const json = decodeBase64Url(parts[1]);
        return JSON.parse(json);
    } catch {
        return {};
    }
}


export function isJwtExpired(token?: string): boolean {
    if (!token) return true;
    try {
        const payload = parseJwtClaims(token);
        if (!payload?.exp) return false; // ไม่มี exp แปลว่าไม่หมดอายุ
        const now = Math.floor(Date.now() / 1000);
        return payload.exp < now;
    } catch {
        return true;
    }
}