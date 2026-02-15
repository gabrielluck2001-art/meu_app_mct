import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorageData, Patient, Assessment, Therapist } from '@/types/models';

const STORAGE_KEY = '@metacognitive_therapy_app';
const STORAGE_VERSION = '1.0.0';

// Inicializar dados vazios
const getEmptyData = (): StorageData => ({
  therapist: undefined,
  patients: [],
  assessments: [],
  version: STORAGE_VERSION,
});

// Carregar todos os dados
export const loadData = async (): Promise<StorageData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue === null) {
      return getEmptyData();
    }
    const data: StorageData = JSON.parse(jsonValue);
    return data;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    return getEmptyData();
  }
};

// Salvar todos os dados
export const saveData = async (data: StorageData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar dados:', error);
    throw error;
  }
};

// Therapist operations
export const getTherapist = async (): Promise<Therapist | undefined> => {
  const data = await loadData();
  return data.therapist;
};

export const saveTherapist = async (therapist: Therapist): Promise<void> => {
  const data = await loadData();
  data.therapist = therapist;
  await saveData(data);
};

// Patient operations
export const getPatients = async (): Promise<Patient[]> => {
  const data = await loadData();
  return data.patients.filter(p => !p.archived);
};

export const getAllPatients = async (): Promise<Patient[]> => {
  const data = await loadData();
  return data.patients;
};

export const getPatientById = async (id: string): Promise<Patient | undefined> => {
  const data = await loadData();
  return data.patients.find(p => p.id === id);
};

export const savePatient = async (patient: Patient): Promise<void> => {
  const data = await loadData();
  const index = data.patients.findIndex(p => p.id === patient.id);
  
  if (index >= 0) {
    // Atualizar paciente existente
    data.patients[index] = { ...patient, updatedAt: new Date().toISOString() };
  } else {
    // Adicionar novo paciente
    data.patients.push(patient);
  }
  
  await saveData(data);
};

export const deletePatient = async (id: string): Promise<void> => {
  const data = await loadData();
  data.patients = data.patients.filter(p => p.id !== id);
  // Também remover avaliações do paciente
  data.assessments = data.assessments.filter(a => a.patientId !== id);
  await saveData(data);
};

export const archivePatient = async (id: string): Promise<void> => {
  const data = await loadData();
  const patient = data.patients.find(p => p.id === id);
  if (patient) {
    patient.archived = true;
    patient.updatedAt = new Date().toISOString();
    await saveData(data);
  }
};

// Assessment operations
export const getAssessments = async (): Promise<Assessment[]> => {
  const data = await loadData();
  return data.assessments;
};

export const getAssessmentsByPatient = async (patientId: string): Promise<Assessment[]> => {
  const data = await loadData();
  return data.assessments
    .filter(a => a.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getAssessmentById = async (id: string): Promise<Assessment | undefined> => {
  const data = await loadData();
  return data.assessments.find(a => a.id === id);
};

export const saveAssessment = async (assessment: Assessment): Promise<void> => {
  const data = await loadData();
  const index = data.assessments.findIndex(a => a.id === assessment.id);
  
  if (index >= 0) {
    // Atualizar avaliação existente
    data.assessments[index] = { ...assessment, updatedAt: new Date().toISOString() };
  } else {
    // Adicionar nova avaliação
    data.assessments.push(assessment);
  }
  
  await saveData(data);
};

export const deleteAssessment = async (id: string): Promise<void> => {
  const data = await loadData();
  data.assessments = data.assessments.filter(a => a.id !== id);
  await saveData(data);
};

// Utility functions
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Export/Import functions
export const exportData = async (): Promise<string> => {
  const data = await loadData();
  return JSON.stringify(data, null, 2);
};

export const importData = async (jsonString: string): Promise<void> => {
  try {
    const data: StorageData = JSON.parse(jsonString);
    // Validar estrutura básica
    if (!data.patients || !data.assessments) {
      throw new Error('Formato de dados inválido');
    }
    data.version = STORAGE_VERSION;
    await saveData(data);
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    throw error;
  }
};

// Clear all data (for testing/reset)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    throw error;
  }
};
