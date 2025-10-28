export type CreateJobPayload = {
  serviceCatalogId: string;
  jobTitle: string;
  description: string;
  isEnglishRequired: boolean;
  exampleUrl?: string;
  budget: string;
  deadline?: string;
  isAnonymousPost: boolean;
  workingFrom: "Freelance" | "Contract" | "Parttime" | "Fulltime";
  intendedUse: "Business" | "Personal" | "Unknown";
};

export interface JobPost {
  id: string;
  jobTitle: string;
  category: string;
  workingFrom: string;
  intendedUse: string;
  budget: string;
  createdAt: string;
  deadline: string;
}

export interface JobPostsResponse {
  items: JobPost[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
