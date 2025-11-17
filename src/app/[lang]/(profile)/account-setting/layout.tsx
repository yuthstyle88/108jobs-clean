"use client";

import Header from "@/components/Header";
import AccountSettingWrapper from "@/containers/AccountSettingWrapper";
import {LayoutProps} from "@/types/layout";
import NavBar from "@/components/Home/NavBar";
import MobileSidebar from "@/components/MobileSidebar";
import React, {useState} from "react";

export default function ProfileLayout({
                                          children,
                                      }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <>
            <div className="hidden sm:block">
                <Header type="primary"/>
            </div>
            <div className="block sm:hidden">
                {/* Mobile Header */}
                <div className="block sm:hidden fixed top-0 inset-x-0 z-[1000] bg-primary">
                    <NavBar
                        isSidebarOpen={isSidebarOpen}
                        onToggleSidebar={() => setIsSidebarOpen(v => !v)}
                        className="text-white"
                    />
                </div>
                <MobileSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            <section className="min-h-screen pt-[3rem] sm:pt-[4.5rem] bg-[#F6F7F8]">
                <div className="grid-container-desktop-banner w-full pt-6 pb-16 px-4 sm:px-0 sm:py-8">
                    <div className="col-start-2 col-end-3">
                        <div className="grid-cols-1 sm:grid-cols-[286px_1fr] grid gap-6 items-start">
                            <AccountSettingWrapper/>
                            <div className="">{children}</div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

