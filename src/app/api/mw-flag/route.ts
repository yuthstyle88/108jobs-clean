// src/app/api/mw-flag/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    const res = NextResponse.json({ ok: true });
    // ธงบอก middleware ให้เคลียร์ session
    res.cookies.set('mw_cmd', 'clear_session', { path: '/', httpOnly: true });
    return res;
}