"use client";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/Card";
import {Button} from "@/components/ui/Button";
import {CustomInput} from "@/components/ui/InputField";
import {Textarea} from "@/components/ui/Textarea";
import {Label} from "@/components/ui/Label";
import {Badge} from "@/components/ui/Badge";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/Select";
import {Plus, Search, History, Coins, User, Calendar, CreditCard} from "lucide-react";
import {toast} from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";

interface TopupHistory {
    id: string;
    userId: string;
    userName: string;
    amount: number;
    method: "admin" | "payment";
    reason: string;
    createdAt: string;
    status: "completed" | "pending" | "failed";
}

const TopupCoins = () => {
    const [selectedUser, setSelectedUser] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [searchUser, setSearchUser] = useState("");

    const users = [
        {id: "user_001", name: "John Smith", email: "john.smith@email.com", balance: 5000},
        {id: "user_002", name: "Jane Doe", email: "jane.doe@email.com", balance: 12000},
        {id: "user_003", name: "Mike Johnson", email: "mike.johnson@email.com", balance: 8500},
        {id: "user_004", name: "Sarah Wilson", email: "sarah.wilson@email.com", balance: 3200},
        {id: "user_005", name: "David Brown", email: "david.brown@email.com", balance: 15000}
    ];

    const topupHistory: TopupHistory[] = [
        {
            id: "tp_001",
            userId: "user_001",
            userName: "John Smith",
            amount: 5000,
            method: "admin",
            reason: "Top-up by request",
            createdAt: "2024-01-15T10:30:00Z",
            status: "completed"
        },
        {
            id: "tp_002",
            userId: "user_002",
            userName: "Jane Doe",
            amount: 10000,
            method: "payment",
            reason: "Payment via MoMo",
            createdAt: "2024-01-14T14:20:00Z",
            status: "completed"
        },
        {
            id: "tp_003",
            userId: "user_003",
            userName: "Mike Johnson",
            amount: 3000,
            method: "admin",
            reason: "System error compensation",
            createdAt: "2024-01-13T09:15:00Z",
            status: "completed"
        },
        {
            id: "tp_004",
            userId: "user_004",
            userName: "Sarah Wilson",
            amount: 2000,
            method: "payment",
            reason: "Bank transfer payment",
            createdAt: "2024-01-12T16:45:00Z",
            status: "pending"
        }
    ];

    const handleTopup = () => {
        if (!selectedUser || !amount || !reason) {
            toast.warning(`Please fill in all coin top-up information`);
            return;
        }

        const user = users.find(u => u.id === selectedUser);
        toast.success(`Successfully added ${amount} coins to ${user?.name}`);

        setSelectedUser("");
        setAmount("");
        setReason("");
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.email.toLowerCase().includes(searchUser.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        const colorMap = {
            completed: "bg-success/10 text-success border-success/20",
            pending: "bg-warning/10 text-warning border-warning/20",
            failed: "bg-destructive/10 text-destructive border-destructive/20"
        };
        return colorMap[status as keyof typeof colorMap] || colorMap.completed;
    };

    const getStatusText = (status: string) => {
        const textMap = {
            completed: "Successful",
            pending: "Processing",
            failed: "Failed"
        };
        return textMap[status as keyof typeof textMap] || status;
    };

    const getMethodIcon = (method: string) => {
        return method === "admin" ? Plus : CreditCard;
    };

    const getMethodText = (method: string) => {
        const textMap = {
            admin: "Admin Top-up",
            payment: "Payment"
        };
        return textMap[method as keyof typeof textMap] || method;
    };

    const totalCoinsToday = topupHistory
        .filter(h => new Date(h.createdAt).toDateString() === new Date().toDateString())
        .reduce((sum, h) => sum + h.amount, 0);

    const completedTransactions = topupHistory.filter(h => h.status === "completed").length;

    return (
        <AdminLayout>
            <div className="space-y-6 text-gray-600">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Top-up Coins</h1>
                    <p className="text-muted-foreground mt-2">
                        Add coins to user accounts
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card className="bg-gradient-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue"/>
                                New Top-up
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="search-user">Search User</Label>
                                <div className="relative">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                                    <CustomInput
                                        name={"search-user"}
                                        placeholder="Search by name or email..."
                                        value={searchUser}
                                        onChange={(e) => setSearchUser(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user-select">Select User</Label>
                                <Select value={selectedUser} onValueChange={setSelectedUser}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user to top-up coins"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredUsers.map((user) => (
                                            <SelectItem key={user.id} value={user.id}>
                                                <div className="flex items-center justify-between w-full">
                                                    <div>
                                                        <div className="font-medium">{user.name}</div>
                                                        <div
                                                            className="text-sm text-muted-foreground">{user.email}</div>
                                                    </div>
                                                    <Badge variant="secondary" className="ml-2">
                                                        {user.balance.toLocaleString()} coins
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount">Coin Amount</Label>
                                <CustomInput
                                    name={"amount"}
                                    type="number"
                                    placeholder="Enter number of coins to add"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Top-up Reason</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="Enter reason for coin top-up..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <Button
                                onClick={handleTopup}
                                className="w-full bg-gradient-primary hover:bg-blue/90"
                                disabled={!selectedUser || !amount || !reason}
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                Top-up Coins
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardHeader>
                            <CardTitle className="text-foreground flex items-center gap-2">
                                <Coins className="w-5 h-5 text-blue"/>
                                Quick Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/30 rounded-lg text-center">
                                    <div
                                        className="text-2xl font-bold text-blue">{totalCoinsToday.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Coins added today</div>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-lg text-center">
                                    <div className="text-2xl font-bold text-success">{completedTransactions}</div>
                                    <div className="text-sm text-muted-foreground">Completed transactions</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-foreground">Top users by balance</h4>
                                {users.slice(0, 3).map((user, index) => (
                                    <div key={user.id}
                                         className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {user.balance.toLocaleString()} coins
                                        </Badge>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-foreground">Preset amounts</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {[1000, 5000, 10000, 20000].map((preset) => (
                                        <Button
                                            key={preset}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAmount(preset.toString())}
                                            className="text-xs"
                                        >
                                            {preset.toLocaleString()} coins
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gradient-card border-border/50">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                            <History className="w-5 h-5 text-blue"/>
                            Top-up History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topupHistory.map((topup) => {
                                const MethodIcon = getMethodIcon(topup.method);
                                return (
                                    <div key={topup.id}
                                         className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                                                <MethodIcon className="w-5 h-5 text-white"/>
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-medium text-foreground">{topup.userName}</h4>
                                                    <Badge className={getStatusColor(topup.status)}>
                                                        {getStatusText(topup.status)}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {getMethodText(topup.method)}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-1">{topup.reason}</p>

                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3"/>
                              {new Date(topup.createdAt).toLocaleDateString('en-US')}
                          </span>
                                                    <span className="flex items-center gap-1">
                            <User className="w-3 h-3"/>
                            ID: {topup.userId}
                          </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div
                                                className="text-lg font-bold text-success">+{topup.amount.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">coins</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default TopupCoins;