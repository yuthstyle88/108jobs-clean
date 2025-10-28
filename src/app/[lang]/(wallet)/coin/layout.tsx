"use client"

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import {LayoutProps} from "@/types/layout";
import NavBar from "@/components/Home/NavBar";
import MobileSidebar from "@/components/MobileSidebar";
import React, {useState} from "react";

export default function ProfileLayout({children}: LayoutProps) {
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
            <section className="sm:pt-[4.5rem] bg-white">
                {children}
            </section>
            <Footer/>
        </>
    );
}
