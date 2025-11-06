"use client";
import {useState, useCallback} from "react";
import {useHttpGet} from "@/hooks/api/http/useHttpGet";
import {Card} from "@/components/ui/Card";
import {Button} from "@/components/ui/Button";
import {Badge} from "@/components/ui/Badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/Avatar";
import {Ban, User, Eye, RotateCcw} from "lucide-react";
import {UserDetailModal} from "@/modules/admin/components/Modal/UserDetailModal";
import {toast} from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";
import {PaginationControls} from "@/components/PaginationControls";
import {LocalUserView} from "lemmy-js-client";

const ManageUsers = () => {
    const [filters, setFilters] = useState<{ limit: number; bannedOnly: boolean }>({
        limit: 10,
        bannedOnly: false,
    });

    const [currentCursor, setCurrentCursor] = useState<string | undefined>(undefined);
    const [cursorHistory, setCursorHistory] = useState<string[]>([]);

    const {data, isLoading, execute: refetch} = useHttpGet("listUsers", {
        ...filters,
        pageCursor: currentCursor,
    });

    const users: LocalUserView[] = data?.users ?? [];
    const hasNextPage = !!data?.nextPage;
    const hasPreviousPage = cursorHistory.length > 0;

    const [selectedUser, setSelectedUser] = useState<LocalUserView | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const handleFilterChange = (key: keyof typeof filters, value: any) => {
        setFilters((prev) => ({...prev, [key]: value}));
        setCurrentCursor(undefined);
        setCursorHistory([]);
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

    const handleBanToggle = (userId: number, userName: string, isBanned: boolean) => {
        toast.success(`${isBanned ? "Unbanned" : "Banned"} ${userName}`);
        refetch();
    };

    const openDetailModal = (user: LocalUserView) => {
        setSelectedUser(user);
        setIsDetailModalOpen(true);
    };

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto text-gray-600 p-6 space-y-8">
                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-foreground">Users</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage and monitor user accounts</p>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant={filters.bannedOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleFilterChange("bannedOnly", !filters.bannedOnly)}
                            className="text-xs"
                        >
                            <Ban className="w-3.5 h-3.5 mr-1"/>
                            {filters.bannedOnly ? "Banned" : "All Users"}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setCurrentCursor(undefined);
                                setCursorHistory([]);
                                refetch();
                            }}
                        >
                            <RotateCcw className="w-3.5 h-3.5"/>
                        </Button>
                    </div>
                </header>

                {/* User List */}
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center py-16">
                            <div
                                className="w-8 h-8 border-2 border-t-transparent border-foreground/30 rounded-full animate-spin"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <Card className="border-dashed p-12 text-center">
                            <User className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40"/>
                            <p className="text-sm text-muted-foreground">No users found</p>
                        </Card>
                    ) : (
                        users.map((userView) => {
                            const {person, localUser} = userView;
                            const banned = userView?.banned ?? false;

                            return (
                                <Card
                                    key={localUser.id}
                                    className="p-5 hover:shadow-sm transition-shadow duration-200 border"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        {/* User Info */}
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <Avatar className="h-11 w-11 shrink-0">
                                                <AvatarImage src={person.avatar}/>
                                                <AvatarFallback className="text-xs font-medium">
                                                    {person.name[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-medium text-foreground truncate">{person.name}</h3>
                                                    {banned && (
                                                        <Badge variant="destructive" className="text-xs h-5">
                                                            <Ban className="w-3 h-3 mr-1"/>
                                                            Banned
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground truncate">{localUser.email || "—"}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    Joined {new Date(person.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openDetailModal(userView)}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <Eye className="w-4 h-4"/>
                                            </Button>

                                            <Button
                                                variant={banned ? "outline" : "destructive"}
                                                size="sm"
                                                onClick={() => handleBanToggle(localUser.id, person.name, banned)}
                                                className={`text-xs font-medium transition-colors ${
                                                    banned
                                                        ? "border-green-600 text-green-600 hover:bg-green-50"
                                                        : "hover:bg-red-600"
                                                }`}
                                            >
                                                {banned ? (
                                                    <>
                                                        <RotateCcw className="w-3.5 h-3.5 mr-1"/>
                                                        Unban
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban className="w-3.5 h-3.5 mr-1"/>
                                                        Ban
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
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

                {/* Detail Modal */}
                {selectedUser && (
                    <UserDetailModal
                        isOpen={isDetailModalOpen}
                        onClose={() => {
                            setIsDetailModalOpen(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                        onApprove={() => {
                            // Example: ban/unban or approve logic
                            console.log("Approve user:", selectedUser.localUser.id);
                        }}
                        onReject={() => {
                            console.log("Reject user:", selectedUser.localUser.id);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default ManageUsers;