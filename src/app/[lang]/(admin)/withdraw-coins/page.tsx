"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CustomInput } from "@/components/ui/InputField";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Minus, Search, Filter, CheckCircle, XCircle, Eye, CreditCard } from "lucide-react";
import { toast } from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";

interface WithdrawRequest {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    avatar?: string;
    amount: number;
    bankInfo: {
        bankName: string;
        accountNumber: string;
        accountName: string;
    };
    requestDate: string;
    status: "pending" | "approved" | "rejected" | "processing";
    reason?: string;
    adminNote?: string;
    currentBalance: number;
}

const WithdrawCoins = () => {
    const [filter, setFilter] = useState("pending");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null);
    const [adminNote, setAdminNote] = useState("");

    const withdrawRequests: WithdrawRequest[] = [
        {
            id: "wd_001",
            userId: "user_001",
            userName: "John Smith",
            userEmail: "john.smith@email.com",
            amount: 50000,
            bankInfo: {
                bankName: "Chase Bank",
                accountNumber: "1234567890",
                accountName: "JOHN SMITH"
            },
            requestDate: "2024-01-15T10:30:00Z",
            status: "pending",
            currentBalance: 75000
        },
        {
            id: "wd_002",
            userId: "user_002",
            userName: "Jane Doe",
            userEmail: "jane.doe@email.com",
            amount: 100000,
            bankInfo: {
                bankName: "Wells Fargo",
                accountNumber: "9876543210",
                accountName: "JANE DOE"
            },
            requestDate: "2024-01-14T14:20:00Z",
            status: "processing",
            currentBalance: 120000
        },
        {
            id: "wd_003",
            userId: "user_003",
            userName: "Mike Johnson",
            userEmail: "mike.johnson@email.com",
            amount: 25000,
            bankInfo: {
                bankName: "Bank of America",
                accountNumber: "1122334455",
                accountName: "MIKE JOHNSON"
            },
            requestDate: "2024-01-13T09:15:00Z",
            status: "approved",
            adminNote: "Information verified and funds transferred",
            currentBalance: 45000
        },
        {
            id: "wd_004",
            userId: "user_004",
            userName: "Sarah Wilson",
            userEmail: "sarah.wilson@email.com",
            amount: 80000,
            bankInfo: {
                bankName: "Citibank",
                accountNumber: "5566778899",
                accountName: "SARAH WILSON"
            },
            requestDate: "2024-01-12T16:45:00Z",
            status: "rejected",
            reason: "Account information doesn't match profile",
            adminNote: "Please update bank information",
            currentBalance: 95000
        }
    ];

    const handleApprove = (request: WithdrawRequest) => {
        if (!adminNote.trim()) {
            toast.warning(`Please enter admin note`);
            return;
        }

        toast.success(`Approved withdrawal of ${request.amount.toLocaleString()} coins for ${request.userName}`);

        setAdminNote("");
        setSelectedRequest(null);
    };

    const handleReject = (request: WithdrawRequest) => {
        if (!adminNote.trim()) {
            toast.warning(`Please enter rejection reason`);
            return;
        }

        toast.success(`Rejected ${request.userName}'s coin withdrawal request`);

        setAdminNote("");
        setSelectedRequest(null);
    };

    const getStatusColor = (status: string) => {
        const colorMap = {
            pending: "bg-warning/10 text-warning border-warning/20",
            processing: "bg-blue/10 text-blue border-blue/20",
            approved: "bg-success/10 text-success border-success/20",
            rejected: "bg-destructive/10 text-destructive border-destructive/20"
        };
        return colorMap[status as keyof typeof colorMap] || colorMap.pending;
    };

    const getStatusText = (status: string) => {
        const textMap = {
            pending: "Pending",
            processing: "Processing",
            approved: "Approved",
            rejected: "Rejected"
        };
        return textMap[status as keyof typeof textMap] || status;
    };

    const filteredRequests = withdrawRequests.filter(request => {
        const matchesFilter = filter === "all" || request.status === filter;
        const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <AdminLayout>
            <div className="space-y-6 text-gray-600">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Coin Withdrawals</h1>
                    <p className="text-muted-foreground mt-2">
                        Approve coin withdrawal requests from users
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
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Minus className="w-8 h-8 text-warning" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {withdrawRequests.filter(r => r.status === "pending").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <CheckCircle className="w-8 h-8 text-success" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {withdrawRequests.filter(r => r.status === "approved").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <XCircle className="w-8 h-8 text-destructive" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {withdrawRequests.filter(r => r.status === "rejected").length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <CreditCard className="w-8 h-8 text-blue" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {withdrawRequests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {filteredRequests.map((request) => (
                            <Card key={request.id} className="bg-gradient-card border-border/50 hover:shadow-md transition-all">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage src={request.avatar} alt={request.userName} />
                                                <AvatarFallback className="bg-gradient-primary text-white">
                                                    {request.userName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-semibold text-foreground">{request.userName}</h3>
                                                    <Badge className={getStatusColor(request.status)}>
                                                        {getStatusText(request.status)}
                                                    </Badge>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-2">{request.userEmail}</p>

                                                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-2">
                                                    <div>
                                                        <span className="font-medium">Amount:</span> {request.amount.toLocaleString()} coins
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Balance:</span> {request.currentBalance.toLocaleString()} coins
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Bank:</span> {request.bankInfo.bankName}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Requested:</span> {new Date(request.requestDate).toLocaleDateString('en-US')}
                                                    </div>
                                                </div>

                                                <div className="text-xs text-muted-foreground">
                                                    <span className="font-medium">Account:</span> {request.bankInfo.accountName} (**** {request.bankInfo.accountNumber.slice(-4)})
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedRequest(request)}
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Review
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredRequests.length === 0 && (
                            <Card className="bg-gradient-card border-border/50">
                                <CardContent className="p-12 text-center">
                                    <Minus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">No requests found</h3>
                                    <p className="text-muted-foreground">
                                        No withdrawal requests found matching the current filters.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        {selectedRequest && (
                            <Card className="bg-gradient-card border-border/50">
                                <CardHeader>
                                    <CardTitle className="text-foreground flex items-center gap-2">
                                        <Minus className="w-5 h-5 text-blue" />
                                        Review Request
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-foreground mb-2">{selectedRequest.userName}</h4>
                                        <p className="text-sm text-muted-foreground">{selectedRequest.userEmail}</p>
                                    </div>

                                    <div className="p-4 bg-muted/30 rounded-lg">
                                        <div className="text-lg font-bold text-foreground mb-1">
                                            {selectedRequest.amount.toLocaleString()} coins
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Current balance: {selectedRequest.currentBalance.toLocaleString()} coins
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-medium text-sm">Bank Information:</h5>
                                        <div className="text-sm space-y-1">
                                            <div><span className="font-medium">Bank:</span> {selectedRequest.bankInfo.bankName}</div>
                                            <div><span className="font-medium">Account:</span> {selectedRequest.bankInfo.accountNumber}</div>
                                            <div><span className="font-medium">Name:</span> {selectedRequest.bankInfo.accountName}</div>
                                        </div>
                                    </div>

                                    {selectedRequest.reason && (
                                        <div className="space-y-2">
                                            <h5 className="font-medium text-sm">Reason:</h5>
                                            <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                                                {selectedRequest.reason}
                                            </p>
                                        </div>
                                    )}

                                    {selectedRequest.adminNote && (
                                        <div className="space-y-2">
                                            <h5 className="font-medium text-sm">Admin Note:</h5>
                                            <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                                                {selectedRequest.adminNote}
                                            </p>
                                        </div>
                                    )}

                                    {selectedRequest.status === "pending" && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="admin-note">Admin Note</Label>
                                                <Textarea
                                                    id="admin-note"
                                                    placeholder="Enter admin note or rejection reason..."
                                                    value={adminNote}
                                                    onChange={(e) => setAdminNote(e.target.value)}
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleReject(selectedRequest)}
                                                    className="flex-1 text-destructive hover:text-destructive"
                                                    disabled={!adminNote.trim()}
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Reject
                                                </Button>

                                                <Button
                                                    onClick={() => handleApprove(selectedRequest)}
                                                    className="flex-1 bg-gradient-primary hover:bg-blue/90"
                                                    disabled={!adminNote.trim()}
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Approve
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Card className="bg-gradient-card border-border/50">
                            <CardHeader>
                                <CardTitle className="text-foreground">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setFilter("pending")}>
                                        View Pending
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setFilter("processing")}>
                                        View Processing
                                    </Button>
                                </div>

                                <div className="text-center p-4 bg-muted/30 rounded-lg">
                                    <div className="text-2xl font-bold text-warning">
                                        {withdrawRequests.filter(r => r.status === "pending").length}
                                    </div>
                                    <div className="text-sm text-muted-foreground">Pending reviews</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default WithdrawCoins;