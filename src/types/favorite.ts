export type Job = {
  id: string;
  user: User;
  serviceCatalog: ServiceCatalog;
  serviceType: ServiceType;
  slug: string;
  title: string;
  basePrice: string;
  priceBeforeDiscount: string;
  show: boolean;
  rating: string;
  status: number;
  isHot: boolean;
  isPro: boolean;
  description: string;
  isInstantHire: boolean;
  purchaseCount: number;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
  tagIds: string[];
  completionRate: number;
  overallRating: OverallRating;
  rehireOrdersCount: number;
  images: image[];
};

export type User = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
};

export type ServiceCatalog = {
  id: string;
  title: string;
  secondTitle: string | null;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  serviceTopic: string | null;
  imageUrl: string | null;
  isPopular: boolean;
  slug: string;
};

export type ServiceType = {
  id: string;
  title: string;
  secondTitle: string;
  createdAt: string;
  updatedAt: string;
  parentId: string;
  serviceTopic: string;
  imageUrl: string | null;
  isPopular: boolean;
  slug: string;
};

export type OverallRating = {
  overallRating: number;
  averageResponsivenessRating: number;
  averageServiceRating: number;
  averageSkillRating: number;
  averageWorthRating: number;
};

export type image = {
  id: string;
  jobId: string;
  imageUrl: string;
  isCoverPhoto: boolean;
  sortOrder: number;
  alt: string;
  createdAt: string;
  updatedAt: string;
};

