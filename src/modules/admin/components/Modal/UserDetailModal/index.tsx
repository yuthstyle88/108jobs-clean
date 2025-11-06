import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { User, Mail, Calendar, FileText, Star, MapPin, Phone } from "lucide-react";

interface UserDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name: string;
        email: string;
        type: "job_seeker" | "freelancer" | "company";
        registeredAt: string;
        avatar?: string;
        status: string;
        documents: number;
        experience?: string;
        skills?: string[];
        phone?: string;
        location?: string;
        bio?: string;
        rating?: number;
        completedProjects?: number;
    };
    onApprove?: () => void;
    onReject?: () => void;
}

export function UserDetailModal({
                                    isOpen,
                                    onClose,
                                    user,
                                    onApprove,
                                    onReject,
                                }: UserDetailModalProps) {
    const getTypeLabel = (type: string) => {
        const typeMap = {
            job_seeker: "Job Seeker",
            freelancer: "Freelancer",
            company: "Company",
        };
        return typeMap[type as keyof typeof typeMap] || type;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        User Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-primary text-white text-lg">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-foreground">
                                    {user.name}
                                </h3>
                                <Badge variant="outline">{getTypeLabel(user.type)}</Badge>
                                <Badge
                                    variant={user.status === "pending" ? "secondary" : "outline"}
                                >
                                    {user.status === "pending" ? "Pending" : "Under Review"}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                    {user.email}
                </span>
                                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                                    {new Date(user.registeredAt).toLocaleDateString("en-US")}
                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {user.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {user.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h4 className="font-medium text-foreground">Professional Information</h4>

                        {user.bio && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Bio:</p>
                                <p className="text-sm">{user.bio}</p>
                            </div>
                        )}

                        {user.experience && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Experience:</p>
                                <p className="text-sm font-medium">{user.experience}</p>
                            </div>
                        )}

                        {user.rating && (
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{user.rating}/5.0</span>
                                {user.completedProjects && (
                                    <span className="text-sm text-muted-foreground">
                    ({user.completedProjects} completed projects)
                  </span>
                                )}
                            </div>
                        )}

                        {user.skills && user.skills.length > 0 && (
                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Skills:</p>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h4 className="font-medium text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Uploaded Documents ({user.documents})
                        </h4>
                        <div className="text-sm text-muted-foreground">
                            The user has uploaded {user.documents} documents for verification.
                        </div>
                    </div>

                    {user.status === "pending" && (onApprove || onReject) && (
                        <>
                            <Separator />
                            <div className="flex gap-2 justify-end">
                                {onReject && (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            onReject();
                                            onClose();
                                        }}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        Reject
                                    </Button>
                                )}
                                {onApprove && (
                                    <Button
                                        onClick={() => {
                                            onApprove();
                                            onClose();
                                        }}
                                        className="bg-gradient-primary hover:bg-blue/90"
                                    >
                                        Approve
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}