import { Text, View, ScrollView, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { MCQ30, NBRS, PBRS } from "@/questionnaires-data";
import type { Questionnaire } from "@/questionnaires-data";

export default function SelectQuestionnaireScreen() {
  const colors = useColors();
  const params = useLocalSearchParams();
  const patientId = params.patientId as string;

  const questionnaires: Questionnaire[] = [MCQ30, NBRS, PBRS];

  const handleSelectQuestionnaire = (questionnaireId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/apply-questionnaire?patientId=${patientId}&questionnaireId=${questionnaireId}`);
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
            <Text className="text-2xl font-bold text-foreground">Selecionar Questionário</Text>
            <Text className="text-sm text-muted mt-1">Escolha o questionário para aplicar</Text>
          </View>
        </View>

        {/* Questionnaires List */}
        <View className="px-6 gap-4">
          {questionnaires.map((q) => (
            <Pressable
              key={q.id}
              onPress={() => handleSelectQuestionnaire(q.id)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-surface rounded-2xl p-5 border border-border">
                <View className="flex-row items-start mb-3">
                  <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                    <IconSymbol name="doc.text.fill" size={24} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-foreground mb-1">{q.name}</Text>
                    <Text className="text-sm font-medium text-muted">{q.fullName}</Text>
                  </View>
                </View>

                <Text className="text-sm text-foreground leading-relaxed mb-3">
                  {q.description}
                </Text>

                <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center">
                    <IconSymbol name="doc.text.fill" size={16} color={colors.muted} />
                    <Text className="text-xs text-muted ml-1">{q.items.length} itens</Text>
                  </View>
                  <View className="flex-row items-center">
                    <IconSymbol name="calendar" size={16} color={colors.muted} />
                    <Text className="text-xs text-muted ml-1">~{q.estimatedMinutes} min</Text>
                  </View>
                </View>

                {q.subscales && q.subscales.length > 0 && (
                  <View className="mt-3 pt-3 border-t border-border">
                    <Text className="text-xs font-semibold text-muted mb-2">Subescalas:</Text>
                    <View className="gap-1">
                      {q.subscales.map((subscale, index) => (
                        <Text key={index} className="text-xs text-foreground">
                          • {subscale}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                <View className="mt-4">
                  <View className="bg-primary rounded-xl p-3 items-center">
                    <Text className="text-white font-semibold">Aplicar Questionário</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
