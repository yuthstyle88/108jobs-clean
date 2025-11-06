"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { CustomInput } from "@/components/ui/InputField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { CheckCircle, XCircle, Eye, Search, Filter, User, Briefcase } from "lucide-react";
import { UserDetailModal } from "@/modules/admin/components/Modal/UserDetailModal";
import { toast } from "sonner";
import {AdminLayout} from "@/modules/admin/components/layout/AdminLayout";
interface PendingUser {
    id: string;
    name: string;
    email: string;
    type: "job_seeker" | "freelancer" | "company";
    registeredAt: string;
    avatar?: string;
    status: "pending" | "reviewing";
    documents: number;
    experience?: string;
    skills?: string[];
    phone?: string;
    location?: string;
    bio?: string;
    rating?: number;
    completedProjects?: number;
}

const ApproveUsers = () => {
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const pendingUsers: PendingUser[] = [
        {
            id: "1",
            name: "Nguyễn Văn Anh",
            email: "nguyen.van.anh@email.com",
            type: "job_seeker",
            registeredAt: "2024-01-15",
            status: "pending",
            documents: 3,
            experience: "2 năm kinh nghiệm",
            skills: ["React", "Node.js", "TypeScript"],
            phone: "0901234567",
            location: "Hà Nội",
            bio: "Lập trình viên React với 2 năm kinh nghiệm, đam mê công nghệ mới và học hỏi không ngừng.",
            rating: 4.5,
            completedProjects: 12
        },
        {
            id: "2",
            name: "Công ty ABC Technology",
            email: "hr@abctech.com",
            type: "company",
            registeredAt: "2024-01-14",
            status: "reviewing",
            documents: 5,
            phone: "0901234568",
            location: "TP.HCM",
            bio: "Công ty công nghệ hàng đầu chuyên về phát triển phần mềm và ứng dụng di động."
        },
        {
            id: "3",
            name: "Trần Thị Mai",
            email: "tran.thi.mai@email.com",
            type: "freelancer",
            registeredAt: "2024-01-13",
            status: "pending",
            documents: 4,
            skills: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
            phone: "0901234569",
            location: "Đà Nẵng",
            bio: "Designer UI/UX với 3 năm kinh nghiệm, chuyên về thiết kế giao diện người dùng.",
            rating: 4.8,
            completedProjects: 25
        },
        {
            id: "4",
            name: "Lê Hoàng Nam",
            email: "le.hoang.nam@email.com",
            type: "job_seeker",
            registeredAt: "2024-01-12",
            status: "pending",
            documents: 2,
            experience: "Mới tốt nghiệp",
            skills: ["Java", "Spring Boot", "MySQL"],
            phone: "0901234570",
            location: "Hà Nội",
            bio: "Sinh viên mới tốt nghiệp ngành Công nghệ thông tin, mong muốn tìm cơ hội việc làm đầu tiên."
        }
    ];

    const handleApprove = (userId: string, userName: string) => {
        toast.success(`Successfully approved ${userName}'s account`);
    };

    const handleReject = (userId: string, userName: string) => {
        toast.success(`Successfully rejected ${userName}'s account`);
    };

    const getTypeLabel = (type: string) => {
        const typeMap = {
            job_seeker: "Job Seeker",
            freelancer: "Freelancer",
            company: "Company"
        };
        return typeMap[type as keyof typeof typeMap] || type;
    };

    const getTypeIcon = (type: string) => {
        if (type === "company") return <Briefcase className="w-4 h-4" />;
        return <User className="w-4 h-4" />;
    };

    const filteredUsers = pendingUsers.filter(user => {
        const matchesFilter = filter === "all" || user.type === filter;
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <AdminLayout>
            <div className="space-y-6 text-gray-600">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Approve Users</h1>
                    <p className="text-muted-foreground mt-2">
                        Approve registration profiles of new users
                    </p>
                </div>

                <Card className="bg-gradient-card border-border/50">
                    <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <CustomInput
                                    name={"searchUsers"}
                                    placeholder="Search by name or email..."
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
                                    <SelectItem value="job_seeker">Job Seekers</SelectItem>
                                    <SelectItem value="freelancer">Freelancers</SelectItem>
                                    <SelectItem value="company">Companies</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-4">
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
                                                <Badge variant="outline" className="text-xs">
                                                    {getTypeIcon(user.type)}
                                                    <span className="ml-1">{getTypeLabel(user.type)}</span>
                                                </Badge>
                                                <Badge variant={user.status === "pending" ? "secondary" : "outline"}>
                                                    {user.status === "pending" ? "Pending" : "Under Review"}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground mb-2">{user.email}</p>

                                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                <span>📅 Registered: {new Date(user.registeredAt).toLocaleDateString('en-US')}</span>
                                                <span>📄 {user.documents} documents</span>
                                                {user.experience && <span>💼 {user.experience}</span>}
                                            </div>

                                            {user.skills && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {user.skills.slice(0, 3).map((skill, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                    {user.skills.length > 3 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{user.skills.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setIsDetailModalOpen(true);
                                            }}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Details
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleReject(user.id, user.name)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>

                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(user.id, user.name)}
                                            className="bg-gradient-primary hover:bg-blue/90"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredUsers.length === 0 && (
                    <Card className="bg-gradient-card border-border/50">
                        <CardContent className="p-12 text-center">
                            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
                            <p className="text-muted-foreground">
                                No users found matching the current filters.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {selectedUser && (
                    <UserDetailModal
                        isOpen={isDetailModalOpen}
                        onClose={() => {
                            setIsDetailModalOpen(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                        onApprove={() => handleApprove(selectedUser.id, selectedUser.name)}
                        onReject={() => handleReject(selectedUser.id, selectedUser.name)}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default ApproveUsers;