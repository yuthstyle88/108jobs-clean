import { NextRequest, NextResponse } from 'next/server';
import {isHttps, JWT} from '@/utils';
import {LANGUAGE_COOKIE} from "@/constants/language";

export async function POST(req: NextRequest) {
    let jwt: string | undefined;
    let lang: string | undefined;
    try {
        const body = await req.json();
        jwt = body?.jwt;
        lang = body?.lang;
    } catch {}

    if (!jwt) {
        return NextResponse.json({ ok: false, error: 'jwt required' }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true }, { status: 200 });
    // ตั้ง session cookie (HttpOnly)
    const secure = isHttps(req);
    res.cookies.set(JWT, jwt, {
        httpOnly: true,
        secure,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });
    // ตั้งภาษา (อ่านได้ฝั่ง browser/middleware)
    if (lang) {
        res.cookies.set(LANGUAGE_COOKIE, String(lang), {
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
        });
    }
    res.headers.set('Cache-Control', 'no-store');
    return res;
}

export async function DELETE() {
    const res = new NextResponse(null, { status: 204 });
    // ลบคุกกี้ session
    res.cookies.set(JWT, '', { path: '/', maxAge: 0 });
    // (ถ้าต้อง) จะลบภาษาด้วยก็ได้ — ส่วนใหญ่เก็บไว้ได้
    res.headers.set('Cache-Control', 'no-store');
    return res;
}