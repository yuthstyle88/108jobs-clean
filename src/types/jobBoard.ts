export interface JobPost {
  id: string;
  jobTitle: string;
  description: string;
  isEnglishRequired: boolean;
  exampleUrl: string;
  budget: string;
  deadline: string;
  isAnonymousPost: boolean;
  serviceCatalogId: string;
  workingFrom: string;
  intendedUse: string;
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface JobPostDetail {
  jobPost: JobPost;
  categoryName: string;
  creator: Creator;
}
