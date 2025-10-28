export type JobDetailResponse = {
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
  packages: Package[];
  images: JobImage[];
  worksteps: Workstep[];
  onboarding: Onboarding;
  createdAt: string;
  updatedAt: string;
  tagIds: string[];
  completionRate: number;
  badges: Badge[];
  overallRating: OverallRating;
  rehireOrdersCount: number;
  additionalAttributes: AdditionalAttributes;
  socials: SocialLink[];
  websites: WebsiteLink[];
  relatedJobs: RelatedJob[];
};

export type User = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  userId: string;
  profileId: string;
  available: boolean
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

export type ServiceType = ServiceCatalog;

export type Package = {
  id: string;
  jobId: string;
  description: string;
  price: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  packageName: string;
  executionTime: number;
};

export type JobImage = {
  id: string;
  jobId: string;
  imageUrl: string;
  isCoverPhoto: boolean;
  sortOrder: number;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Workstep = {
  id: string;
  jobId: string;
  description: string;
  sortOrder: number;
};

export type Onboarding = {
  id: string;
  jobId: string;
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
};

export type Badge = {
  id: string;
  name: string;
};

export type OverallRating = {
  overallRating: number;
  averageResponsivenessRating: number;
  averageServiceRating: number;
  averageSkillRating: number;
  averageWorthRating: number;
};

export type AdditionalAttributes = {
  certificateBadge: boolean;
  rehireGuaranteeBadge: boolean;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type WebsiteLink = {
  id: string;
  url: string;
};

export type RelatedJob = {
  id: string;
  title: string;
  slug: string;
};
