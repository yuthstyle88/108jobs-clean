"use client";

import * as React from "react";
import {SidebarProvider, useSidebar} from "@/components/ui/Sidebar";
import {AdminSidebar} from "@/modules/admin/components/layout/AdminSidebar";
import {AdminHeader} from "@/modules/admin/components/layout/AdminHeader";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export function AdminLayout({children}: AdminLayoutProps) {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    );
}

function InnerLayout({children}: { children: React.ReactNode }) {
    // The shared Sidebar component already reserves horizontal space using an in-flow overlay.
    // Avoid adding extra padding-left here to prevent a visible gap between the header/content and the sidebar.
    useSidebar();

    return (
        <div className="min-h-screen flex w-full">
            <AdminSidebar/>

            <div
                className="flex-1 flex flex-col"
            >
                <AdminHeader/>
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}