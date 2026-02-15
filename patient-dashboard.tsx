import { View, Text, Dimensions } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useColors } from "@/hooks/use-colors";
import type { Assessment } from "@/types/models";
import type { MetacognitiveMapping } from "@/types/mapping-models";
import { useMemo } from "react";

interface PatientDashboardProps {
  assessments: Assessment[];
  mappings: MetacognitiveMapping[];
}

export function PatientDashboard({ assessments, mappings }: PatientDashboardProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;

  // Calcular evolução temporal
  const evolutionData = useMemo(() => {
    const sortedAssessments = [...assessments].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (sortedAssessments.length === 0) {
      return {
        labels: ["Sem dados"],
        datasets: [{ data: [0] }]
      };
    }

    const labels = sortedAssessments.slice(-6).map(a => 
      new Date(a.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    );
    const scores = sortedAssessments.slice(-6).map(a => a.totalScore);

    return {
      labels,
      datasets: [{ data: scores.length > 0 ? scores : [0] }]
    };
  }, [assessments]);

  // Calcular progresso (comparação primeira vs última avaliação)
  const progress = useMemo(() => {
    if (assessments.length < 2) return null;

    const sorted = [...assessments].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const first = sorted[0].totalScore;
    const last = sorted[sorted.length - 1].totalScore;
    const change = last - first;
    const percentChange = ((change / first) * 100).toFixed(1);

    return {
      change,
      percentChange,
      improving: change < 0 // Menor score = melhora
    };
  }, [assessments]);

  // Calcular força das metacrenças
  const metacognitionStrength = useMemo(() => {
    if (mappings.length === 0) return null;

    const latestMapping = mappings.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    const positiveCount = latestMapping.positiveMetabeliefs.length;
    const negativeCount = latestMapping.negativeMetabeliefs.length;
    const total = positiveCount + negativeCount;

    if (total === 0) return null;

    return {
      positivePercent: Math.round((positiveCount / total) * 100),
      negativePercent: Math.round((negativeCount / total) * 100),
      positiveCount,
      negativeCount
    };
  }, [mappings]);

  // Dados para gráfico de pizza
  const pieData = useMemo(() => {
    if (!metacognitionStrength) return [];

    return [
      {
        name: "Positivas",
        population: metacognitionStrength.positiveCount,
        color: colors.success,
        legendFontColor: colors.foreground,
        legendFontSize: 12
      },
      {
        name: "Negativas",
        population: metacognitionStrength.negativeCount,
        color: colors.error,
        legendFontColor: colors.foreground,
        legendFontSize: 12
      }
    ];
  }, [metacognitionStrength, colors]);

  return (
    <View className="gap-6">
      {/* Progress Card */}
      {progress && (
        <View className="bg-surface rounded-2xl p-6 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">Progresso Geral</Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-3xl font-bold" style={{ color: progress.improving ? colors.success : colors.error }}>
                {progress.change > 0 ? '+' : ''}{progress.change}
              </Text>
              <Text className="text-sm text-muted mt-1">Mudança no score</Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold" style={{ color: progress.improving ? colors.success : colors.error }}>
                {progress.percentChange}%
              </Text>
              <Text className="text-sm text-muted mt-1">
                {progress.improving ? '↓ Melhora' : '↑ Piora'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Evolution Chart */}
      {assessments.length > 0 && (
        <View className="bg-surface rounded-2xl p-4 border border-border">
          <Text className="text-lg font-bold text-foreground mb-3">Evolução Temporal</Text>
          <LineChart
            data={evolutionData}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.primary,
              labelColor: (opacity = 1) => colors.muted,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: colors.primary
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <Text className="text-xs text-muted text-center mt-2">
            Últimas {Math.min(assessments.length, 6)} avaliações
          </Text>
        </View>
      )}

      {/* Metacognition Strength */}
      {metacognitionStrength && (
        <View className="bg-surface rounded-2xl p-6 border border-border">
          <Text className="text-lg font-bold text-foreground mb-4">Força das Metacrenças</Text>
          
          {/* Progress Bars */}
          <View className="gap-4 mb-6">
            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-semibold text-success">Metacrenças Positivas</Text>
                <Text className="text-sm font-bold text-success">{metacognitionStrength.positivePercent}%</Text>
              </View>
              <View className="h-3 bg-background rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${metacognitionStrength.positivePercent}%`,
                    backgroundColor: colors.success
                  }}
                />
              </View>
              <Text className="text-xs text-muted mt-1">
                {metacognitionStrength.positiveCount} metacrenças identificadas
              </Text>
            </View>

            <View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-semibold text-error">Metacrenças Negativas</Text>
                <Text className="text-sm font-bold text-error">{metacognitionStrength.negativePercent}%</Text>
              </View>
              <View className="h-3 bg-background rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${metacognitionStrength.negativePercent}%`,
                    backgroundColor: colors.error
                  }}
                />
              </View>
              <Text className="text-xs text-muted mt-1">
                {metacognitionStrength.negativeCount} metacrenças identificadas
              </Text>
            </View>
          </View>

          {/* Pie Chart */}
          <View className="items-center">
            <Text className="text-sm font-semibold text-foreground mb-3">Distribuição de Metacrenças</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 120}
              height={180}
              chartConfig={{
                color: (opacity = 1) => colors.primary,
                labelColor: (opacity = 1) => colors.foreground,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        </View>
      )}

      {/* Empty State */}
      {assessments.length === 0 && mappings.length === 0 && (
        <View className="bg-surface rounded-2xl p-6 border border-border items-center">
          <Text className="text-base font-semibold text-foreground mb-2">
            Sem dados disponíveis
          </Text>
          <Text className="text-sm text-muted text-center">
            Aplique questionários e crie mapeamentos para visualizar o progresso do paciente.
          </Text>
        </View>
      )}
    </View>
  );
}
