
export enum Sector {
  ONBOARDING = 'Onboarding',
  ONGOING = 'Ongoing',
  RETENCAO = 'Retenção'
}

export interface Employee {
  id: string;
  name: string;
  sector: Sector;
  weight: number;
  avatar: string;
  color: string;
  borderColor: string;
  glowColor: string;
  themeColor: string;
}

export interface Submission {
  id: string;
  timestamp: number;
  employeeId: string;
  lawyerName: string;
  evidenceBase64: string;
  points: number;
}

export interface RankingEntry extends Employee {
  employeeId: string;
  totalPoints: number;
  submissionsCount: number;
}
