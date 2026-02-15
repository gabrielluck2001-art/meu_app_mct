import { Text, View, ScrollView, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useState } from "react";
import { MCQ30, NBRS, PBRS } from "@/questionnaires-data";
import type { Questionnaire, QuestionnaireItem } from "@/questionnaires-data";
import { useApp } from "@/lib/app-context";
import type { Assessment, AssessmentResponse } from "@/types/models";
import { saveAssessment } from "@/lib/storage";

export default function ApplyQuestionnaireScreen() {
  const colors = useColors();
  const { refreshData } = useApp();
  const params = useLocalSearchParams();
  const patientId = params.patientId as string;
  const questionnaireId = params.questionnaireId as string;

  // Get questionnaire data
  const getQuestionnaire = (): Questionnaire | undefined => {
    switch (questionnaireId) {
      case 'mcq30': return MCQ30;
      case 'nbrs': return NBRS;
      case 'pbrs': return PBRS;
      default: return undefined;
    }
  };

  const questionnaire = getQuestionnaire();
  
  if (!questionnaire) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-foreground mb-2">Questionário não encontrado</Text>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, marginTop: 16 }]}
          >
            <View className="bg-primary rounded-xl px-6 py-3">
              <Text className="text-white font-semibold">Voltar</Text>
            </View>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});

  const currentItem = questionnaire.items[currentItemIndex];
  const progress = ((currentItemIndex + 1) / questionnaire.items.length) * 100;
  const isLastItem = currentItemIndex === questionnaire.items.length - 1;
  const hasResponse = responses[currentItem.id] !== undefined;

  const handleResponse = (value: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setResponses(prev => ({ ...prev, [currentItem.id]: value }));
  };

  const handleNext = () => {
    if (!hasResponse) {
      Alert.alert('Resposta necessária', 'Por favor, selecione uma resposta antes de continuar');
      return;
    }

    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (isLastItem) {
      handleFinish();
    } else {
      setCurrentItemIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (currentItemIndex > 0) {
      setCurrentItemIndex(prev => prev - 1);
    }
  };

  const calculateScores = () => {
    // Calculate total score
    const totalScore = Object.values(responses).reduce((sum, val) => sum + val, 0);

    // Calculate subscale scores
    const subscaleScores: Record<string, number> = {};
    if (questionnaire.subscales) {
      questionnaire.subscales.forEach(subscale => {
        const subscaleItems = questionnaire.items.filter(item => item.subscale === subscale);
        const subscaleScore = subscaleItems.reduce((sum, item) => {
          return sum + (responses[item.id] || 0);
        }, 0);
        subscaleScores[subscale] = subscaleScore;
      });
    }

    return { totalScore, subscaleScores };
  };

  const handleFinish = async () => {
    try {
      const { totalScore, subscaleScores } = calculateScores();

      const assessmentResponses: AssessmentResponse[] = Object.entries(responses).map(([itemId, value]) => {
        const item = questionnaire.items.find(i => i.id === itemId);
        return {
          itemId,
          value,
          subscale: item?.subscale
        };
      });

      const assessment: Assessment = {
        id: `assessment-${Date.now()}`,
        patientId,
        questionnaireId: questionnaire.id as 'mcq30' | 'nbrs' | 'pbrs',
        date: new Date().toISOString(),
        totalScore,
        subscaleScores,
        responses: assessmentResponses,
        completed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveAssessment(assessment);
      await refreshData();

      Alert.alert(
        'Avaliação Concluída!',
        `Score Total: ${totalScore}\n\nA avaliação foi salva no histórico do paciente.`,
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a avaliação. Tente novamente.');
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  const scaleOptions = questionnaire.scaleLabels.map((label, index) => ({
    label,
    value: index + 1
  }));

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center mb-4">
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                Alert.alert(
                  'Cancelar Avaliação',
                  'Tem certeza que deseja cancelar? Todo o progresso será perdido.',
                  [
                    { text: 'Continuar Avaliação', style: 'cancel' },
                    { text: 'Cancelar', style: 'destructive', onPress: () => router.back() }
                  ]
                );
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, marginRight: 12 }]}
            >
              <IconSymbol name="chevron.right" size={24} color={colors.foreground} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-xl font-bold text-foreground">{questionnaire.name}</Text>
              <Text className="text-sm text-muted">
                Questão {currentItemIndex + 1} de {questionnaire.items.length}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="h-2 bg-surface rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Question */}
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 40 }}>
          <View className="bg-surface rounded-2xl p-6 border border-border mb-6">
            {currentItem.subscale && (
              <View className="mb-3">
                <Text className="text-xs font-semibold text-primary">{currentItem.subscale}</Text>
              </View>
            )}
            <Text className="text-lg font-medium text-foreground leading-relaxed">
              {currentItem.text}
            </Text>
          </View>

          {/* Scale Options */}
          <View className="gap-3 mb-6">
            {scaleOptions.map((option) => {
              const isSelected = responses[currentItem.id] === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => handleResponse(option.value)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className={`rounded-xl p-4 border-2 ${
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface border-border'
                  }`}>
                    <View className="flex-row items-center">
                      <View className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                        isSelected ? 'border-primary bg-primary' : 'border-border'
                      }`}>
                        {isSelected && (
                          <IconSymbol name="checkmark.circle.fill" size={20} color="white" />
                        )}
                      </View>
                      <Text className={`text-base flex-1 ${
                        isSelected ? 'text-primary font-semibold' : 'text-foreground'
                      }`}>
                        {option.label}
                      </Text>
                      <Text className={`text-sm font-bold ${
                        isSelected ? 'text-primary' : 'text-muted'
                      }`}>
                        {option.value}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="px-6 pb-6 gap-3">
          <View className="flex-row gap-3">
            {currentItemIndex > 0 && (
              <Pressable
                onPress={handlePrevious}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, flex: 1 }]}
              >
                <View className="bg-surface rounded-xl p-4 border border-border items-center">
                  <Text className="text-foreground font-semibold">Anterior</Text>
                </View>
              </Pressable>
            )}
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => [{ 
                opacity: pressed ? 0.7 : 1, 
                flex: currentItemIndex > 0 ? 1 : undefined,
                width: currentItemIndex === 0 ? '100%' : undefined
              }]}
            >
              <View className={`rounded-xl p-4 items-center ${
                hasResponse ? 'bg-primary' : 'bg-muted/20'
              }`}>
                <Text className={`font-semibold ${
                  hasResponse ? 'text-white' : 'text-muted'
                }`}>
                  {isLastItem ? 'Finalizar' : 'Próxima'}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
