"use client";
import Header from "@/components/Header";
import React, {ReactNode, useState} from "react";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import NavBar from "@/components/Home/NavBar";
import MobileSidebar from "@/components/MobileSidebar";

interface ConsentManagementLayoutProps {
    children: ReactNode;
}


export default function ProfileLayout({
                                          children,
                                      }: ConsentManagementLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <>
            <ChatLanguageProvider>
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
                <section className="pt-[5.5rem] sm:pt-[4.5rem] px-4 sm:px-6 lg:px-8 bg-white min-h-screen">
                    <div className="max-w-[1280px] mx-auto w-full">
                        {children}
                    </div>
                </section>
            </ChatLanguageProvider>
        </>
    );
}
