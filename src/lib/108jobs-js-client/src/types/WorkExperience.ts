export type WorkExperience = {
  id?: number | null;
  companyName: string;
  position: string;
  startDate: string;  
  startMonth: string; 
  startYear: number;
  endMonth: string; 
  endYear: number;  
  isCurrent: boolean;
};

export type WorkExperiencesResponse = {
  workExperience: WorkExperience[];
};
