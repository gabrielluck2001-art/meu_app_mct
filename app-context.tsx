import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Patient, Assessment, Therapist } from '@/types/models';
import type { MetacognitiveMapping } from '@/types/mapping-models';
import { getPatients, getAssessments, getTherapist, savePatient, deletePatient as removePatient } from '@/lib/storage';
import { getAllMappings } from '@/lib/mapping-storage';

interface AppContextType {
  patients: Patient[];
  assessments: Assessment[];
  mappings: MetacognitiveMapping[];
  therapist: Therapist | undefined;
  loading: boolean;
  refreshData: () => Promise<void>;
  setPatients: (patients: Patient[]) => void;
  setAssessments: (assessments: Assessment[]) => void;
  setMappings: (mappings: MetacognitiveMapping[]) => void;
  setTherapist: (therapist: Therapist | undefined) => void;
  addPatient: (patient: Patient) => Promise<void>;
  updatePatient: (patient: Patient) => Promise<void>;
  deletePatient: (patientId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [mappings, setMappings] = useState<MetacognitiveMapping[]>([]);
  const [therapist, setTherapist] = useState<Therapist | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      setLoading(true);
      const [patientsData, assessmentsData, mappingsData, therapistData] = await Promise.all([
        getPatients(),
        getAssessments(),
        getAllMappings(),
        getTherapist()
      ]);
      setPatients(patientsData);
      setAssessments(assessmentsData);
      setMappings(mappingsData);
      setTherapist(therapistData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patient: Patient) => {
    await savePatient(patient);
    await refreshData();
  };

  const updatePatient = async (patient: Patient) => {
    await savePatient(patient);
    await refreshData();
  };

  const deletePatient = async (patientId: string) => {
    await removePatient(patientId);
    await refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        patients,
        assessments,
        mappings,
        therapist,
        loading,
        refreshData,
        setPatients,
        setAssessments,
        setMappings,
        setTherapist,
        addPatient,
        updatePatient,
        deletePatient
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
