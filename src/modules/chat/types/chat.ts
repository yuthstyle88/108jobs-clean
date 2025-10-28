export interface ChatRoom {
    id: string;
    name: string;
    partnerAvatar?: string
    participants: { id: number; name: string; }[];
    unreadCount: number;
    postId?: number | string;
}

export type Job = {
    id: string;
    userId: string;
    serviceTypeId: string;
    slug: string;
    title: string;
    basePrice: string;
    priceBeforeDiscount: string;
    banType: string | null;
    bannedAt: string | null;
    show: boolean;
    rating: string;
    status: number;
    isHot: boolean;
    isPro: boolean;
    description: string;
    readyToWorkAt: string | null;
    isInstantHire: boolean;
    purchaseCount: number;
    reviewsCount: number;
    lastApprovedAt: string;
    createdAt: string;
    updatedAt: string;
};

export type ChatResponse = {
    roomId: string;
    partnerId: string;
    senderId: string;
    partnerAvatar: string;
    partnerUsername: string;
    partnerDisplayName: string;
    job: Job;
    jobCoverImage: string;
};