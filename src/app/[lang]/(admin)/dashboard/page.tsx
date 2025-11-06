import { StatsCard } from "@/components/ui/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Users, CreditCard, Coins, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";

const DashboardPage = () => {
    const stats = [
        {
            title: "Total Users",
            value: "12,345",
            icon: Users,
            trend: { value: 12.3, isPositive: true },
            description: "Active users",
        },
        {
            title: "Today's Transactions",
            value: "1,234",
            icon: CreditCard,
            trend: { value: 8.7, isPositive: true },
            description: "Total transactions",
        },
        {
            title: "Total System Coins",
            value: "2.4M",
            icon: Coins,
            trend: { value: 15.2, isPositive: true },
            description: "Circulating coins",
        },
        {
            title: "Monthly Revenue",
            value: "$45,678",
            icon: TrendingUp,
            trend: { value: 23.1, isPositive: true },
            description: "Monthly revenue",
        },
    ];

    const pendingActions = [
        { title: "Users Pending Approval", count: 23, icon: Users, urgent: true },
        { title: "Coin Withdrawal Requests", count: 15, icon: Coins, urgent: false },
        { title: "Violation Reports", count: 7, icon: AlertTriangle, urgent: true },
        { title: "Expired Subscriptions", count: 12, icon: CreditCard, urgent: false },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 text-gray-600">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Job Portal System Management Overview
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatsCard key={index} {...stat} />
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="bg-gradient-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-warning" />
                                Pending Tasks
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {pendingActions.map((action, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                                action.urgent ? "bg-warning/20" : "bg-blue/20"
                                            }`}
                                        >
                                            <action.icon
                                                className={`w-5 h-5 ${
                                                    action.urgent ? "text-warning" : "text-blue"
                                                }`}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {action.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {action.count} pending items
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={action.urgent ? "default" : "outline"}
                                    >
                                        Handle
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-success" />
                                Recent Activities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            User @john_doe has been approved
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            2 minutes ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-2 h-2 bg-blue rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Transferred 1,000 coins to @freelancer_pro
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            15 minutes ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Cancelled subscription for @company_xyz
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            1 hour ago
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Banned user @spam_account for policy violation
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            3 hours ago
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardPage;
