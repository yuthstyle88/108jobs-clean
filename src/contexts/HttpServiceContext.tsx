"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { HttpService } from "@/services/HttpService";

interface HttpServiceContextType {
    http: HttpService;
}

const HttpServiceContext = createContext<HttpServiceContextType | undefined>(
    undefined
);

interface HttpServiceProviderProps {
    children: React.ReactNode;
    token?: string;
    host?: string;
}

export function HttpServiceProvider({
                                        children,
                                        token,
                                        host,
                                    }: HttpServiceProviderProps) {
    // ใช้ instance เดียว (สมมติ HttpService.client เป็น singleton)
    const http = HttpService.client;

    useEffect(() => {
        (async () => {
            if (token) {
                // ถ้าฟังก์ชันเป็น async ให้ await เพื่อลด warning promise not handled
                await http.setHeaders({ Authorization: `Bearer ${token}` });
            }
            http.setBaseUrl(
                host || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
            );
        })();
        // http มาจาก singleton เปลี่ยนยาก จึงปลอดภัยที่จะไม่ใส่ใน deps ก็ได้
    }, [token, host]); // eslint-disable-line react-hooks/exhaustive-deps

    const value = useMemo<HttpServiceContextType>(() => ({ http }), [http]);

    return (
        <HttpServiceContext.Provider value={value}>
            {children}
        </HttpServiceContext.Provider>
    );
}

// Hook สำหรับใช้งานใน component อื่น ๆ
export function useHttpService(): HttpService {
    const ctx = useContext(HttpServiceContext);
    if (!ctx) {
        throw new Error("useHttpService must be used within HttpServiceProvider");
    }
    return ctx.http;
}