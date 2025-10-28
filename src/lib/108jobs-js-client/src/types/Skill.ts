export type Skill = {
  id?: number | null;
  skillName: string;
  levelId: number;
};

export type SkillsResponse = {
  skills: Skill[];
};
