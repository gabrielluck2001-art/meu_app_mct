// Tipos para Mapeamento Metacognitivo

export interface MetacognitiveMapping {
  id: string;
  patientId: string;
  date: string;
  model: string;
  positiveMetabeliefs: string[];
  negativeMetabeliefs: string[];
  casComponents: {
    worry?: string;
    rumination?: string;
    threatMonitoring?: string;
    thoughtSuppression?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechniqueCategory {
  id: string;
  name: string;
  description: string;
}

export interface MetacognitiveTechnique {
  id: string;
  name: string;
  category: string;
  description: string;
  purpose: string;
  steps: string[];
  contraindications?: string;
  examples?: string;
  isFavorite?: boolean;
}
