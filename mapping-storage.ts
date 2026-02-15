import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MetacognitiveMapping } from '@/types/mapping-models';

const MAPPING_STORAGE_KEY = '@metacognitive_mappings';

// Carregar todos os mapeamentos
export const getAllMappings = async (): Promise<MetacognitiveMapping[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MAPPING_STORAGE_KEY);
    if (jsonValue === null) {
      return [];
    }
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Erro ao carregar mapeamentos:', error);
    return [];
  }
};

// Obter mapeamentos de um paciente específico
export const getMappingsByPatient = async (patientId: string): Promise<MetacognitiveMapping[]> => {
  const allMappings = await getAllMappings();
  return allMappings
    .filter(m => m.patientId === patientId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Obter mapeamento por ID
export const getMappingById = async (id: string): Promise<MetacognitiveMapping | undefined> => {
  const allMappings = await getAllMappings();
  return allMappings.find(m => m.id === id);
};

// Salvar mapeamento
export const saveMapping = async (mapping: MetacognitiveMapping): Promise<void> => {
  try {
    const allMappings = await getAllMappings();
    const index = allMappings.findIndex(m => m.id === mapping.id);
    
    if (index >= 0) {
      // Atualizar existente
      allMappings[index] = { ...mapping, updatedAt: new Date().toISOString() };
    } else {
      // Adicionar novo
      allMappings.push(mapping);
    }
    
    const jsonValue = JSON.stringify(allMappings);
    await AsyncStorage.setItem(MAPPING_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar mapeamento:', error);
    throw error;
  }
};

// Deletar mapeamento
export const deleteMapping = async (id: string): Promise<void> => {
  try {
    const allMappings = await getAllMappings();
    const filtered = allMappings.filter(m => m.id !== id);
    const jsonValue = JSON.stringify(filtered);
    await AsyncStorage.setItem(MAPPING_STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao deletar mapeamento:', error);
    throw error;
  }
};

// Gerar ID único
export const generateMappingId = (): string => {
  return `mapping-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
