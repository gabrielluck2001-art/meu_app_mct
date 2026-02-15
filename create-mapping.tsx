import { Text, View, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { GAD_MODEL, DEPRESSION_MODEL, OCD_MODEL, PTSD_MODEL, COMMON_POSITIVE_BELIEFS, COMMON_NEGATIVE_BELIEFS } from "@/metacognitive-models-data";
import type { MetacognitiveMapping } from "@/types/mapping-models";
import { saveMapping } from "@/lib/mapping-storage";

const metacognitiveModels: Record<string, { description: string }> = {
  'TAG': { description: 'Transtorno de Ansiedade Generalizada' },
  'Depressão': { description: 'Transtorno Depressivo' },
  'TOC': { description: 'Transtorno Obsessivo-Compulsivo' },
  'TEPT': { description: 'Transtorno de Estresse Pós-Traumático' }
};

export default function CreateMappingScreen() {
  const colors = useColors();
  const { refreshData } = useApp();
  const params = useLocalSearchParams();
  const patientId = params.patientId as string;
  const suggestedModel = params.model as string | undefined;

  const [selectedModel, setSelectedModel] = useState<string>(suggestedModel || '');
  const [selectedPositiveBeliefs, setSelectedPositiveBeliefs] = useState<string[]>([]);
  const [customPositiveBelief, setCustomPositiveBelief] = useState('');
  const [selectedNegativeBeliefs, setSelectedNegativeBeliefs] = useState<string[]>([]);
  const [customNegativeBelief, setCustomNegativeBelief] = useState('');
  
  // CAS Components
  const [worry, setWorry] = useState('');
  const [rumination, setRumination] = useState('');
  const [threatMonitoring, setThreatMonitoring] = useState('');
  const [thoughtSuppression, setThoughtSuppression] = useState('');

  const togglePositiveBelief = (belief: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPositiveBeliefs(prev =>
      prev.includes(belief)
        ? prev.filter(b => b !== belief)
        : [...prev, belief]
    );
  };

  const toggleNegativeBelief = (belief: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedNegativeBeliefs(prev =>
      prev.includes(belief)
        ? prev.filter(b => b !== belief)
        : [...prev, belief]
    );
  };

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Validation
    if (!selectedModel) {
      Alert.alert('Campo obrigatório', 'Por favor, selecione um modelo de transtorno');
      return;
    }

    const allPositiveBeliefs = [...selectedPositiveBeliefs];
    if (customPositiveBelief.trim()) {
      allPositiveBeliefs.push(customPositiveBelief.trim());
    }

    const allNegativeBeliefs = [...selectedNegativeBeliefs];
    if (customNegativeBelief.trim()) {
      allNegativeBeliefs.push(customNegativeBelief.trim());
    }

    if (allPositiveBeliefs.length === 0 && allNegativeBeliefs.length === 0) {
      Alert.alert('Metacrenças necessárias', 'Por favor, selecione ou adicione pelo menos uma metacrença');
      return;
    }

    try {
      const mapping: MetacognitiveMapping = {
        id: `mapping-${Date.now()}`,
        patientId,
        model: selectedModel,
        positiveMetabeliefs: allPositiveBeliefs,
        negativeMetabeliefs: allNegativeBeliefs,
        casComponents: {
          worry: worry.trim() || undefined,
          rumination: rumination.trim() || undefined,
          threatMonitoring: threatMonitoring.trim() || undefined,
          thoughtSuppression: thoughtSuppression.trim() || undefined
        },
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveMapping(mapping);
      await refreshData();

      Alert.alert(
        'Mapeamento Salvo!',
        'O mapeamento metacognitivo foi salvo com sucesso no histórico do paciente.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o mapeamento. Tente novamente.');
      console.error('Erro ao salvar mapeamento:', error);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row items-center">
          <Pressable
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
              router.back();
            }}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, marginRight: 12 }]}
          >
            <IconSymbol name="chevron.right" size={24} color={colors.foreground} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-foreground">Novo Mapeamento</Text>
            <Text className="text-sm text-muted mt-1">Mapeamento Metacognitivo</Text>
          </View>
        </View>

        {/* Model Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Modelo de Transtorno</Text>
          <View className="gap-2">
            {Object.keys(metacognitiveModels).map((model) => (
              <Pressable
                key={model}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedModel(model);
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <View className={`rounded-xl p-4 border ${
                  selectedModel === model
                    ? 'bg-primary/10 border-primary'
                    : 'bg-surface border-border'
                }`}>
                  <Text className={`text-base font-semibold ${
                    selectedModel === model ? 'text-primary' : 'text-foreground'
                  }`}>
                    {model}
                  </Text>
                  <Text className={`text-sm mt-1 ${
                    selectedModel === model ? 'text-primary/70' : 'text-muted'
                  }`}>
                    {metacognitiveModels[model].description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Positive Metabeliefs */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Metacrenças Positivas</Text>
          <View className="gap-2 mb-3">
            {COMMON_POSITIVE_BELIEFS.map((belief: string, index: number) => {
              const isSelected = selectedPositiveBeliefs.includes(belief);
              return (
                <Pressable
                  key={index}
                  onPress={() => togglePositiveBelief(belief)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className={`rounded-xl p-3 border flex-row items-center ${
                    isSelected
                      ? 'bg-success/10 border-success'
                      : 'bg-surface border-border'
                  }`}>
                    <View className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                      isSelected ? 'border-success bg-success' : 'border-border'
                    }`}>
                      {isSelected && (
                        <IconSymbol name="checkmark.circle.fill" size={16} color="white" />
                      )}
                    </View>
                    <Text className={`text-sm flex-1 ${
                      isSelected ? 'text-success font-medium' : 'text-foreground'
                    }`}>
                      {belief}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <TextInput
            className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
            placeholder="Adicionar metacrença positiva personalizada..."
            placeholderTextColor={colors.muted}
            value={customPositiveBelief}
            onChangeText={setCustomPositiveBelief}
            multiline
          />
        </View>

        {/* Negative Metabeliefs */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Metacrenças Negativas</Text>
          <View className="gap-2 mb-3">
            {COMMON_NEGATIVE_BELIEFS.map((belief: string, index: number) => {
              const isSelected = selectedNegativeBeliefs.includes(belief);
              return (
                <Pressable
                  key={index}
                  onPress={() => toggleNegativeBelief(belief)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className={`rounded-xl p-3 border flex-row items-center ${
                    isSelected
                      ? 'bg-error/10 border-error'
                      : 'bg-surface border-border'
                  }`}>
                    <View className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                      isSelected ? 'border-error bg-error' : 'border-border'
                    }`}>
                      {isSelected && (
                        <IconSymbol name="checkmark.circle.fill" size={16} color="white" />
                      )}
                    </View>
                    <Text className={`text-sm flex-1 ${
                      isSelected ? 'text-error font-medium' : 'text-foreground'
                    }`}>
                      {belief}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <TextInput
            className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
            placeholder="Adicionar metacrença negativa personalizada..."
            placeholderTextColor={colors.muted}
            value={customNegativeBelief}
            onChangeText={setCustomNegativeBelief}
            multiline
          />
        </View>

        {/* CAS Components */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-2">
            Componentes do CAS
          </Text>
          <Text className="text-sm text-muted mb-4">
            Síndrome Atencional Cognitiva (opcional)
          </Text>

          <View className="gap-4">
            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Preocupação</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
                placeholder="Descrever padrões de preocupação..."
                placeholderTextColor={colors.muted}
                value={worry}
                onChangeText={setWorry}
                multiline
                numberOfLines={2}
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Ruminação</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
                placeholder="Descrever padrões de ruminação..."
                placeholderTextColor={colors.muted}
                value={rumination}
                onChangeText={setRumination}
                multiline
                numberOfLines={2}
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Monitoramento de Ameaças</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
                placeholder="Descrever vigilância e monitoramento..."
                placeholderTextColor={colors.muted}
                value={threatMonitoring}
                onChangeText={setThreatMonitoring}
                multiline
                numberOfLines={2}
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-foreground mb-2">Supressão de Pensamentos</Text>
              <TextInput
                className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
                placeholder="Descrever tentativas de controle de pensamentos..."
                placeholderTextColor={colors.muted}
                value={thoughtSuppression}
                onChangeText={setThoughtSuppression}
                multiline
                numberOfLines={2}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="px-6">
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <View className="bg-primary rounded-2xl p-4 flex-row items-center justify-center">
              <IconSymbol name="checkmark.circle.fill" size={24} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Salvar Mapeamento
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
