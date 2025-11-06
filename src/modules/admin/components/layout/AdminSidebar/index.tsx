"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

import {
    Users,
    UserX,
    Plus,
    Minus,
    LayoutDashboard
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/Sidebar";
import Image from "next/image";
import {AssetIcon} from "@/constants/icons";
import {cn} from "@/lib/utils";

const navigationItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        description: "System overview"
    },
    {
        title: "Manage Users",
        url: "/manage-users",
        icon: Users,
        description: "Review and manage user profiles"
    },
    {
        title: "Top-up Coins",
        url: "/topup-coins",
        icon: Plus,
        description: "Add coins to user accounts"
    },
    {
        title: "Withdraw Coins",
        url: "/withdraw-coins",
        icon: Minus,
        description: "Approve coin withdrawal requests"
    },
];

export function AdminSidebar() {
    const {state} = useSidebar();
    const collapsed = state === "collapsed";
    const pathname = usePathname();
    const pathWithoutLocale = "/" + pathname.split("/").slice(2).join("/");

    return (
        <Sidebar className={collapsed ? "w-16" : "w-72"} collapsible="icon">
            <SidebarContent className="bg-gradient-card border-r border-border text-gray-600">
                <div className="p-6 border-b border-border bg-primary">
                    <div className="flex items-center gap-3">
                        {!collapsed && (
                            <div className="text-primary">
                                <Link prefetch={true} href="/dashboard" className="shrink-0">
                                    <Image
                                        src={AssetIcon.logo}
                                        alt="logo"
                                        className="w-full h-full"
                                        width={700}
                                        height={700}
                                        priority
                                    />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                <SidebarGroup className="px-4">
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {navigationItems.map((item) => {
                                const isActive = pathWithoutLocale === item.url;

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link
                                                href={item.url}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg transition-all group",
                                                    // Active state
                                                    isActive
                                                        ? "bg-primary text-white shadow-md"
                                                        : "text-foreground hover:bg-muted/80",
                                                    // Collapsed: make button square + center icon
                                                    collapsed && "justify-center p-0 size-12",
                                                    // Expanded: normal padding
                                                    !collapsed && "px-3 py-2.5"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "w-5 h-5",
                                                        collapsed ? "w-10 h-10" : "",
                                                        isActive
                                                            ? "text-white"
                                                            : "text-muted-foreground group-hover:text-foreground"
                                                    )}
                                                />
                                                {!collapsed && (
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-sm truncate">{item.title}</div>
                                                        <div
                                                            className={cn(
                                                                "text-xs truncate",
                                                                isActive ? "text-white/80" : "text-muted-foreground"
                                                            )}
                                                        >
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                )}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}