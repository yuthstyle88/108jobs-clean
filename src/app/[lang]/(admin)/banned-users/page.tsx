"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { CustomInput } from "@/components/ui/InputField";
import { Label } from "@/components/ui/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { AlertTriangle, Eye, Filter, Search, Unlock, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";

interface ReportedUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    reportCount: number;
    lastReportDate: string;
    status: "active" | "warned" | "banned";
    banReason?: string;
    banDate?: string;
    banDuration?: string;
    violations: string[];
    joinDate: string;
}

const BanUsers = () => {
    const [filter, setFilter] = useState("reported");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<ReportedUser | null>(null);
    const [banReason, setBanReason] = useState("");
    const [banDuration, setBanDuration] = useState("");

    const reportedUsers: ReportedUser[] = [
        {
            id: "user_001",
            name: "John Spam Bot",
            email: "spam.bot@email.com",
            reportCount: 15,
            lastReportDate: "2024-01-15",
            status: "active",
            violations: ["Content spam", "Fraudulent activity", "Inappropriate language"],
            joinDate: "2023-12-01"
        },
        {
            id: "user_002",
            name: "Jane Fake Profile",
            email: "fake.profile@email.com",
            reportCount: 8,
            lastReportDate: "2024-01-14",
            status: "warned",
            violations: ["Fake profile", "False information"],
            joinDate: "2023-11-15"
        },
        {
            id: "user_003",
            name: "Mike Violator",
            email: "violator@email.com",
            reportCount: 22,
            lastReportDate: "2024-01-10",
            status: "banned",
            banReason: "Serious violation of community guidelines",
            banDate: "2024-01-10",
            banDuration: "30 days",
            violations: ["Harassment", "Spam", "Inappropriate content", "Fraud"],
            joinDate: "2023-10-20"
        },
        {
            id: "user_004",
            name: "Sarah Scammer",
            email: "scammer@email.com",
            reportCount: 12,
            lastReportDate: "2024-01-13",
            status: "active",
            violations: ["Payment fraud", "Misleading information"],
            joinDate: "2023-12-10"
        }
    ];

    const handleBanUser = (user: ReportedUser) => {
        if (!banReason || !banDuration) {
            toast.warning(`Please enter both ban reason and duration`);
            return;
        }

        toast.success(`Successfully banned ${user.name} for ${banDuration}`);

        setBanReason("");
        setBanDuration("");
        setSelectedUser(null);
    };

    const handleUnbanUser = (user: ReportedUser) => {
        toast.success(`Successfully unbanned user ${user.name}`);
    };

    const handleWarnUser = (user: ReportedUser) => {
        toast.warning(`Warning sent to ${user.name}`);
    };

    const getStatusColor = (status: string) => {
        const colorMap = {
            active: "bg-success/10 text-success border-success/20",
            warned: "bg-warning/10 text-warning border-warning/20",
            banned: "bg-destructive/10 text-destructive border-destructive/20"
        };
        return colorMap[status as keyof typeof colorMap] || colorMap.active;
    };

    const getStatusText = (status: string) => {
        const textMap = {
            active: "Active",
            warned: "Warned",
            banned: "Banned"
        };
        return textMap[status as keyof typeof textMap] || status;
    };

    const filteredUsers = reportedUsers.filter(user => {
        const matchesFilter = filter === "all" ||
            (filter === "reported" && user.reportCount > 0) ||
            user.status === filter;
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <AdminLayout>
            <div className="space-y-6 text-gray-600">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Violation Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage reported users and handle violations
                    </p>
                </div>

                <Card className="bg-gradient-card border-border/50">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <CustomInput
                                    name={"search"}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <Select value={filter} onValueChange={setFilter}>
                                <SelectTrigger className="w-48">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="reported">Reported</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="warned">Warned</SelectItem>
                                    <SelectItem value="banned">Banned</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <AlertTriangle className="w-8 h-8 text-warning" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {reportedUsers.reduce((sum, user) => sum + user.reportCount, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <UserX className="w-8 h-8 text-destructive" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Banned Users</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {reportedUsers.filter(u => u.status === "banned").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Eye className="w-8 h-8 text-blue" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Under Review</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {reportedUsers.filter(u => u.status === "active" && u.reportCount > 0).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <AlertTriangle className="w-8 h-8 text-warning" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Warned Users</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {reportedUsers.filter(u => u.status === "warned").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {filteredUsers.map((user) => (
                            <Card key={user.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback className="bg-gradient-primary text-white">
                                                    {user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                                                    <Badge className={getStatusColor(user.status)}>
                                                        {getStatusText(user.status)}
                                                    </Badge>
                                                    {user.reportCount > 10 && (
                                                        <Badge variant="destructive" className="text-xs">
                                                            High Risk
                                                        </Badge>
                                                    )}
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-2">{user.email}</p>

                                                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                    <span>🚨 {user.reportCount} reports</span>
                                                    <span>📅 Joined: {new Date(user.joinDate).toLocaleDateString('en-US')}</span>
                                                    {user.banDate && <span>🔒 Banned: {new Date(user.banDate).toLocaleDateString('en-US')}</span>}
                                                </div>

                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {user.violations.slice(0, 3).map((violation, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {violation}
                                                        </Badge>
                                                    ))}
                                                    {user.violations.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{user.violations.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Actions
                                            </Button>

                                            {user.status === "banned" ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleUnbanUser(user)}
                                                    className="text-success hover:text-success"
                                                >
                                                    <Unlock className="w-4 h-4 mr-2" />
                                                    Unban
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleWarnUser(user)}
                                                    className="text-warning hover:text-warning"
                                                >
                                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                                    Warn
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredUsers.length === 0 && (
                            <Card className="bg-gradient-card border-border/50">
                                <CardContent className="p-12 text-center">
                                    <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
                                    <p className="text-muted-foreground">
                                        No users found matching the current filters.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {selectedUser && (
                            <Card className="bg-gradient-card border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center gap-2">
                                        <UserX className="w-5 h-5 text-destructive" />
                                        Ban User
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-foreground mb-2">User: {selectedUser.name}</h4>
                                        <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ban-reason">Ban Reason</Label>
                                        <Textarea
                                            id="ban-reason"
                                            placeholder="Enter the reason for banning this user..."
                                            value={banReason}
                                            onChange={(e) => setBanReason(e.target.value)}
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ban-duration">Ban Duration</Label>
                                        <Select value={banDuration} onValueChange={setBanDuration}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ban duration" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="7 days">7 days</SelectItem>
                                                <SelectItem value="14 days">14 days</SelectItem>
                                                <SelectItem value="30 days">30 days</SelectItem>
                                                <SelectItem value="90 days">90 days</SelectItem>
                                                <SelectItem value="permanent">Permanent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-medium text-sm">Violations:</h5>
                                        <div className="space-y-1">
                                            {selectedUser.violations.map((violation, index) => (
                                                <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                                    {violation}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleBanUser(selectedUser)}
                                        className="w-full bg-destructive hover:bg-destructive/90"
                                        disabled={!banReason || !banDuration}
                                    >
                                        <UserX className="w-4 h-4 mr-2" />
                                        Ban User
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-gradient-card border-border/50">
                            <CardHeader>
                                <CardTitle className="text-foreground">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <div className="text-2xl font-bold text-destructive">
                                        {reportedUsers.filter(u => u.reportCount >= 10).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">High-risk users</div>
                                </div>

                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <div className="text-2xl font-bold text-warning">
                                        {reportedUsers.filter(u => new Date(u.lastReportDate) > new Date(Date.now() - 24*60*60*1000)).length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Reports today</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default BanUsers;