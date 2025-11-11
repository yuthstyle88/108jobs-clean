import {Bell, Settings} from "lucide-react";
import {Button} from "@/components/ui/Button";
import {SidebarTrigger} from "@/components/ui/Sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/Avatar";
import LanguageDropdown from "@/components/LanguageDropDown";
import React, {useCallback} from "react";
import {UserService} from "@/services";

export function AdminHeader() {
    const logout = useCallback(() => UserService.Instance.logout(), []);
    return (
        <header
            className="h-16 border-b border-border bg-primary flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="text-muted-foreground hover:text-foreground"/>
            </div>

            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5"/>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></span>
                </Button>

                <LanguageDropdown/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 px-3 gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/admin-avatar.jpg" alt="Admin"/>
                                <AvatarFallback className="bg-black text-white">AD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left">
                                <span className="text-sm font-medium">Admin User</span>
                                <span className="text-xs text-muted-foreground">admin@108jobs.com</span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Admin User</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    admin@108jobs.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4"/>
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="text-destructive" onSelect={logout}>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}