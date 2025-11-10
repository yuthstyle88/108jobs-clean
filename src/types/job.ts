export interface Job {
  id: string;
  user: User;
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
  onboarding: Onboarding;
  createdAt: string;
  updatedAt: string;
  serviceCatalog: ServiceCatalog;
  serviceType: ServiceType;
  packages: Package[];
  images: JobImage[];
  worksteps: WorkStep[];
}

export interface User {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
}

export interface Onboarding {
  id: string;
  jobId: string;
  step1: boolean;
  step2: boolean;
  step3: boolean;
  step4: boolean;
  step5: boolean;
}

export interface ServiceCatalog {
  id: string;
  title: string;
  secondTitle: string | null;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  serviceTopic: string | null;
  imageUrl: string | null;
}

export interface ServiceType {
  id: string;
  title: string;
  secondTitle: string | null;
  createdAt: string;
  updatedAt: string;
  parentId: string | null;
  serviceTopic: string | null;
  imageUrl: string | null;
}

export interface Package {
  id: string;
  jobId: string;
  description: string;
  price: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  packageName: string;
  executionTime: number;
}

export interface JobImage {
  id: string;
  jobId: string;
  imageUrl: string;
  isCoverPhoto: boolean;
  sortOrder: number;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkStep {
  id: string;
  jobId: string;
  description: string;
  sortOrder: number;
}

export type JobType = Job;
