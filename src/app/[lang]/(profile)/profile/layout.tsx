"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, {ReactNode, useState} from "react";
import {ChatLanguageProvider} from "@/contexts/ChatLanguage";
import NavBar from "@/components/Home/NavBar";
import MobileSidebar from "@/components/MobileSidebar";

interface UserLayoutProps {
    children: ReactNode;
}

export default function UserLayout({children}: UserLayoutProps) {
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
                <section className="pt-[3rem] sm:pt-[4.4rem] bg-white">{children}</section>
                <Footer/>
            </ChatLanguageProvider>
        </>
    );
}
