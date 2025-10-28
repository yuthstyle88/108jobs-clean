export type Education = {
  id?: number;
  personId?: number;
  school: string;
  major: string;
  createdAt?: string; 
  updatedAt?: string;
};

export type EducationResponse = {
  education: Education[];
};
