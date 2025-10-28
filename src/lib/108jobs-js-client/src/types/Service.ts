import {Image} from "./Image";

export type Service = {
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
  lastApprovedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: Array<Image>;
}