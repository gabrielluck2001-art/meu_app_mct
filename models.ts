// Tipos de dados para o aplicativo de Terapia Metacognitiva

export interface Therapist {
  id: string;
  name: string;
  professionalId: string; // Registro profissional (CRP, etc)
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  age: number;
  gender?: 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';
  disorder?: 'TAG' | 'Depressão' | 'TOC' | 'TEPT' | 'Outro' | 'Não especificado';
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
}

export interface Assessment {
  id: string;
  patientId: string;
  questionnaireId: 'mcq30' | 'nbrs' | 'pbrs';
  date: string;
  totalScore: number;
  subscaleScores?: Record<string, number>;
  responses: AssessmentResponse[];
  notes?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  itemId: string;
  value: number; // 1-4 ou 1-5 dependendo da escala
  subscale?: string;
}

export interface ComparisonData {
  assessment1: Assessment;
  assessment2: Assessment;
  totalScoreDiff: number;
  totalScorePercentChange: number;
  subscaleDiffs?: Record<string, number>;
  interpretation: string;
}

export interface StatisticsData {
  totalPatients: number;
  totalAssessments: number;
  assessmentsThisMonth: number;
  patientsWithImprovement: number;
  averageScore: number;
  mostUsedQuestionnaire: string;
  averageDaysBetweenAssessments: number;
}

export interface ChartDataPoint {
  date: string;
  score: number;
  questionnaireId: string;
}

// Tipos para AsyncStorage
export interface StorageData {
  therapist?: Therapist;
  patients: Patient[];
  assessments: Assessment[];
  version: string;
}
