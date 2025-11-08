"use client";
import {useState, useCallback} from "react";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {ListWalletTopupsQuery, WalletTopupView} from "lemmy-js-client";
import {format} from "date-fns";
import {toast} from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";
import {Button} from "@/components/ui/Button";
import {Badge} from "@/components/ui/Badge";
import {
    ArrowRightLeft, Calendar, User, CreditCard, Hash, Clock,
    CheckCircle2, XCircle
} from "lucide-react";
import {TransferConfirmModal} from "@/modules/admin/components/Modal/TransferConfirmModal";
import {PaginationControls} from "@/components/PaginationControls";
import {useHttpPost} from "@/hooks/api/http/useHttpPost";
import {AdminTopUpWallet} from "@/lib/lemmy-js-client/src/types/AdminTopUpWallet";
import {REQUEST_STATE} from "@/services/HttpService";
import {TopupGuide} from "@/modules/admin/components/TopupGuide";
import {useTranslation} from "react-i18next";

const TopupCoins = () => {
    const {t} = useTranslation();
    const [filters, setFilters] = useState<ListWalletTopupsQuery>({limit: 10});
    const [currentCursor, setCurrentCursor] = useState<string | undefined>();
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);

    const {data, isLoading, execute: refetch} = useHttpGet("listWalletTopupsAdmin", {
        ...filters,
        pageCursor: currentCursor,
    });

    const {execute: adminTopUpWallet, isMutating: isToppingUp} = useHttpPost("adminTopUpWallet");

    const topups: WalletTopupView[] = data?.walletTopups ?? [];
    const hasNextPage = !!data?.nextPage;
    const hasPreviousPage = cursorHistory.length > 0;

    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
    const [selectedTransfer, setSelectedTransfer] = useState<WalletTopupView | null>(null);

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

        const payload: AdminTopUpWallet = {
            targetUserId: selectedTransfer.localUser.id,
            qrId: selectedTransfer.walletTopup.qrId,
            amount: selectedTransfer.walletTopup.amount,
            reason: "Admin top-up from payment",
        };

        try {
            const res = await adminTopUpWallet(payload);
            if (res.state === REQUEST_STATE.FAILED) {
                toast.error(t("topupCoins.toast.error"));
                return;
            }
            toast.success(t("topupCoins.toast.success", {
                amount: selectedTransfer.walletTopup.amount.toLocaleString(),
                email: selectedTransfer.localUser.email,
            }));
            refetch();
        } catch (error: any) {
            toast.error(error.message || t("topupCoins.toast.error"));
        } finally {
            setIsTransferModalOpen(false);
            setSelectedTransfer(null);
        }
    };

    const getStatusBadge = (status: string, transferred: boolean) => {
        if (transferred) {
            return (
                <Badge className="bg-green-600 text-white border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1"/>
                    {t("topupCoins.status.transferred")}
                </Badge>
            );
        }

        switch (status) {
            case "Success":
                return (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1"/>
                        {t("topupCoins.status.paid")}
                    </Badge>
                );
            case "Pending":
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        <Clock className="w-3 h-3 mr-1"/>
                        {t("topupCoins.status.awaitingPayment")}
                    </Badge>
                );
            case "Expired":
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                        <XCircle className="w-3 h-3 mr-1"/>
                        {t("topupCoins.status.expired")}
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
                    <h1 className="text-3xl font-bold text-foreground">
                        {t("topupCoins.title")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t("topupCoins.description")}
                    </p>
                </div>

                <TopupGuide/>

                {/* Filters */}
                <div className="bg-card p-6 rounded-2xl border shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                {t("topupCoins.filters.status")}
                            </label>
                            <select
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.status ?? ""}
                                onChange={(e) => handleFilterChange("status", e.target.value || undefined)}
                            >
                                <option value="">{t("topupCoins.filters.all")}</option>
                                <option value="Pending">{t("topupCoins.filters.pending")}</option>
                                <option value="Success">{t("topupCoins.filters.paid")}</option>
                                <option value="Expired">{t("topupCoins.filters.expired")}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                {t("topupCoins.filters.minAmount")}
                            </label>
                            <input
                                type="number"
                                placeholder={t("topupCoins.filters.placeholderMin")}
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.amountMin ?? ""}
                                onChange={(e) => handleFilterChange("amountMin", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">
                                {t("topupCoins.filters.maxAmount")}
                            </label>
                            <input
                                type="number"
                                placeholder={t("topupCoins.filters.placeholderMax")}
                                className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary"
                                value={filters.amountMax ?? ""}
                                onChange={(e) => handleFilterChange("amountMax", e.target.value ? Number(e.target.value) : undefined)}
                            />
                        </div>

                        {/* Year, Month, Day — same pattern */}
                        {/* ... abbreviated for brevity ... */}

                        <div className="flex items-end sm:col-span-2 lg:col-span-6">
                            <Button onClick={applyFilters} className="w-full">
                                {t("topupCoins.filters.apply")}
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
                            <p className="mt-3 text-sm text-muted-foreground">
                                {t("topupCoins.list.loading")}
                            </p>
                        </div>
                    ) : topups.length === 0 ? (
                        <div className="text-center py-16 bg-muted/30 rounded-lg">
                            <p className="text-lg font-medium text-muted-foreground">
                                {t("topupCoins.list.noResults")}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {t("topupCoins.list.noResultsHint")}
                            </p>
                        </div>
                    ) : (
                        topups.map((item) => {
                            const wt = item.walletTopup;
                            const canTransfer = wt.status === "Success" && !wt.transferred;

                            return (
                                <div key={wt.id}
                                     className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all">
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
                                                {getStatusBadge(wt.status, wt.transferred)}
                                                {wt.qrId && (
                                                    <Badge variant="outline" className="text-xs">
                                                        <Hash className="w-3 h-3 mr-1"/>
                                                        {wt.qrId}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="text-sm text-muted-foreground space-y-1">
                                                <div className="flex flex-wrap gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5"/>
                              {format(new Date(wt.createdAt), "dd MMM yyyy, HH:mm")}
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
                                                +{wt.amount.toLocaleString()}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {t("topupCoins.list.coins")}
                                            </div>
                                        </div>

                                        {canTransfer && (
                                            <Button
                                                size="sm"
                                                className="flex items-center gap-1.5"
                                                onClick={() => openTransferModal(item)}
                                            >
                                                <ArrowRightLeft className="w-4 h-4"/>
                                                {t("topupCoins.list.transfer")}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <PaginationControls
                    hasPrevious={hasPreviousPage}
                    hasNext={hasNextPage}
                    onPrevious={handlePrevPage}
                    onNext={handleNextPage}
                    isLoading={isLoading}
                />

                <TransferConfirmModal
                    isOpen={isTransferModalOpen}
                    onClose={() => {
                        setIsTransferModalOpen(false);
                        setSelectedTransfer(null);
                    }}
                    onConfirm={confirmTransfer}
                    isLoading={isToppingUp}
                    transfer={
                        selectedTransfer
                            ? {
                                userName: selectedTransfer.localUser.email || "Unknown",
                                reason: "User paid via QR",
                                amount: selectedTransfer.walletTopup.amount,
                                paymentCode: selectedTransfer.walletTopup.qrId || undefined,
                                date: format(new Date(selectedTransfer.walletTopup.createdAt), "dd MMM yyyy, HH:mm"),
                            }
                            : null
                    }
                />
            </div>
        </AdminLayout>
    );
};

export default TopupCoins;