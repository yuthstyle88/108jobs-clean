"use client";
import {useState, useCallback} from "react";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {ListWalletTopupsQuery, WalletTopupView} from "lemmy-js-client";
import {format} from "date-fns";
import {toast} from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";
import {Button} from "@/components/ui/Button";
import {Badge} from "@/components/ui/Badge";
import {ArrowRightLeft, Calendar, User, CreditCard, Hash, Clock, CheckCircle2, XCircle} from "lucide-react";
import {TransferConfirmModal} from "@/modules/admin/components/Modal/TransferConfirmModal";
import {PaginationControls} from "@/components/PaginationControls";

const TopupCoins = () => {
    const [filters, setFilters] = useState<ListWalletTopupsQuery>({
        status: undefined,
        amountMin: undefined,
        amountMax: undefined,
        year: undefined,
        month: undefined,
        day: undefined,
        limit: 10,
    });

    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);

    const {data, isLoading, execute: refetch} = useHttpGet("listWalletTopupsAdmin", {
        ...filters,
        pageCursor: currentCursor,
    });

    const topups: WalletTopupView[] = data?.walletTopups ?? [];
    const hasNextPage = !!data?.nextPage;
    const hasPreviousPage = cursorHistory.length > 0;

    // === Modal ===
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<WalletTopupView | null>(null);

    // === Handlers ===
    const handleFilterChange = (key: keyof ListWalletTopupsQuery, value: any) => {
        setFilters((prev) => ({...prev, [key]: value}));
    };

    const applyFilters = () => {
        setCurrentCursor(undefined);
        setCursorHistory([]);
        refetch();
    };

    const handleNextPage = useCallback(() => {
        if (data?.nextPage) {
            setCursorHistory((prev) => [...prev, currentCursor || ""]);
            setCurrentCursor(data.nextPage);
        }
    }, [data?.nextPage, currentCursor]);

    const handlePrevPage = useCallback(() => {
        if (cursorHistory.length > 0) {
            const prevCursor = cursorHistory[cursorHistory.length - 1];
            setCursorHistory((prev) => prev.slice(0, -1));
            setCurrentCursor(prevCursor || undefined);
        }
    }, [cursorHistory]);

    const openTransferModal = (topup: WalletTopupView) => {
        setSelectedTransfer(topup);
        setIsTransferModalOpen(true);
    };

    const confirmTransfer = async () => {
        if (!selectedTransfer) return;

        try {
            // TODO: Replace with real API
            // await api.adminTransferCoins(selectedTransfer.walletTopup.id);
            toast.success(
                `Transferred ${selectedTransfer.walletTopup.amount.toLocaleString()} coins to ${selectedTransfer.localUser.email}`
            );
            refetch();
        } catch (error) {
            toast.error("Transfer failed. Please try again.");
        } finally {
            setIsTransferModalOpen(false);
            setSelectedTransfer(null);
        }
    };

    // === Status Badge ===
    const getStatusBadge = (status: string, transferred: boolean) => {
        if (transferred) {
            return (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1"/>
                    Transferred
                </Badge>
            );
        }

        switch (status) {
            case "Success":
                return (
                    <Badge className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="w-3 h-3 mr-1"/>
                        Paid
                    </Badge>
                );
            case "Pending":
                return (
                    <Badge className="bg-warning/10 text-warning border-warning/20">
                        <Clock className="w-3 h-3 mr-1"/>
                        Awaiting Payment
                    </Badge>
                );
            case "Expired":
                return (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                        <XCircle className="w-3 h-3 mr-1"/>
                        Expired
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6 p-4 sm:p-6 text-gray-600 lg:p-8 max-w-7xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Top-up Coins</h1>
                    <p className="text-muted-foreground mt-2">
                        Review payments and transfer coins to user wallets
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Status</label>
                            <select
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.status ?? ""}
                                onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Success">Paid</option>
                                <option value="Expired">Expired</option>
                            </select>
                        </div>

                        {/* Min Amount */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Min Amount</label>
                            <input
                                type="number"
                                placeholder="e.g. 1000"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.amountMin ?? ""}
                                onChange={(e) => handleFilterChange("amountMin", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        {/* Max Amount */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Max Amount</label>
                            <input
                                type="number"
                                placeholder="e.g. 50000"
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.amountMax ?? ""}
                                onChange={(e) => handleFilterChange("amountMax", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Year</label>
                            <select
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.year ?? ""}
                                onChange={(e) => handleFilterChange("year", e.target.value ? Number(e.target.value) : undefined)}
                            >
                                <option value="">Year</option>
                                {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>

                        {/* Month */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Month</label>
                            <select
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.month ?? ""}
                                onChange={(e) => handleFilterChange("month", e.target.value ? Number(e.target.value) : undefined)}
                                disabled={!filters.year}
                            >
                                <option value="">Month</option>
                                {Array.from({length: 12}, (_, i) => i + 1).map((m) => (
                                    <option key={m} value={m}>
                                        {new Date(2020, m - 1, 1).toLocaleString("default", {month: "short"})}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Day */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5">Day</label>
                            <select
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.day ?? ""}
                                onChange={(e) => handleFilterChange("day", e.target.value ? Number(e.target.value) : undefined)}
                                disabled={!filters.year || !filters.month}
                            >
                                <option value="">Day</option>
                                {(() => {
                                    if (!filters.year || !filters.month) return Array.from({length: 31}, (_, i) => i + 1);
                                    const daysInMonth = new Date(filters.year, filters.month, 0).getDate();
                                    return Array.from({length: daysInMonth}, (_, i) => i + 1);
                                })().map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* Apply Button - Full Width on Mobile */}
                        <div className="flex items-end sm:col-span-2 lg:col-span-6">
                            <Button onClick={applyFilters} className="w-full">
                                Apply Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Top-up List */}
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div
                                className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="mt-3 text-sm text-muted-foreground">Loading top-ups...</p>
                        </div>
                    ) : topups.length === 0 ? (
                        <div className="text-center py-16 bg-muted/30 rounded-lg">
                            <p className="text-lg font-medium text-muted-foreground">No top-ups found</p>
                            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                        </div>
                    ) : (
                        topups.map((item) => {
                            const t = item.walletTopup;
                            const canTransfer = t.status === "Success" && !t.transferred;

                            return (
                                <div
                                    key={t.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <CreditCard className="w-6 h-6 text-primary"/>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h4 className="font-semibold text-foreground">
                                                    {item.localUser.email}
                                                </h4>
                                                {getStatusBadge(t.status, t.transferred)}
                                                {t.qrId && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Hash className="w-3 h-3 mr-1"/>
                                                        {t.qrId}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div className="flex flex-wrap gap-3 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5"/>
                                                        {format(new Date(t.createdAt), "dd MMM yyyy, HH:mm")}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3.5 h-3.5"/>
                                                        ID: {item.localUser.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4 sm:mt-0">
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-success">
                                                +{t.amount.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">coins</div>
                                        </div>

                                        {/* Transfer Button */}
                                        {canTransfer && (
                                            <Button
                                                size="sm"
                                                className="flex items-center gap-1.5"
                                                onClick={() => openTransferModal(item)}
                                            >
                                                <ArrowRightLeft className="w-4 h-4"/>
                                                Transfer
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                <PaginationControls
                    hasPrevious={hasPreviousPage}
                    hasNext={hasNextPage}
                    onPrevious={handlePrevPage}
                    onNext={handleNextPage}
                    isLoading={isLoading}
                />
            </div>

            {/* Transfer Modal */}
            <TransferConfirmModal
                isOpen={isTransferModalOpen}
                onClose={() => {
                    setIsTransferModalOpen(false);
                    setSelectedTransfer(null);
                }}
                onConfirm={confirmTransfer}
                transfer={
                    selectedTransfer
                        ? {
                            userName: selectedTransfer.localUser.email || undefined,
                            reason: "User top-up",
                            amount: selectedTransfer.walletTopup.amount,
                            paymentCode: selectedTransfer.walletTopup.qrId || undefined,
                            date: format(new Date(selectedTransfer.walletTopup.createdAt), "dd MMM yyyy, HH:mm"),
                        }
                        : null
                }
            />
        </AdminLayout>
    );
};

export default TopupCoins;