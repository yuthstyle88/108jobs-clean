export type JobList = {
  jobs: Job[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
  serviceCategories: ServiceCategory[];
  tag: string;
};

export type Job = {
  id: string;
  user: User;
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
  onboarding?: Onboarding;
  createdAt: string;
  updatedAt: string;
  images: image[];
};

export type User = {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
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

export type ServiceCategory = {
  id: string;
  title: string;
  secondTitle: string | null;
  parentId: string | null;
  serviceTopic: string | null;
  imageUrl: string | null;
  jobsCount: number;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  subCategoryId: string;
};

export type Tags = {
  tags: Tag[];
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
