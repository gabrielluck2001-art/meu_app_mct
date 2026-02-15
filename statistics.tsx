import { Text, View, ScrollView, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useApp } from "@/lib/app-context";
import { useMemo } from "react";
import { LineChart } from "react-native-chart-kit";
import { useColors } from "@/hooks/use-colors";

export default function StatisticsScreen() {
  const { patients, assessments } = useApp();
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;

  // Calcular estatísticas globais
  const stats = useMemo(() => {
    const totalPatients = patients.length;
    const totalAssessments = assessments.length;
    const activePatients = patients.filter(p => {
      const patientAssessments = assessments.filter(a => a.patientId === p.id);
      return patientAssessments.length > 0;
    }).length;

    // Média de scores por questionário
    const mcq30Assessments = assessments.filter(a => a.questionnaireId === 'mcq30');
    const nbrsAssessments = assessments.filter(a => a.questionnaireId === 'nbrs');
    const pbrsAssessments = assessments.filter(a => a.questionnaireId === 'pbrs');

    const avgMCQ30 = mcq30Assessments.length > 0
      ? mcq30Assessments.reduce((sum, a) => sum + a.totalScore, 0) / mcq30Assessments.length
      : 0;
    
    const avgNBRS = nbrsAssessments.length > 0
      ? nbrsAssessments.reduce((sum, a) => sum + a.totalScore, 0) / nbrsAssessments.length
      : 0;

    const avgPBRS = pbrsAssessments.length > 0
      ? pbrsAssessments.reduce((sum, a) => sum + a.totalScore, 0) / pbrsAssessments.length
      : 0;

    return {
      totalPatients,
      totalAssessments,
      activePatients,
      avgMCQ30: Math.round(avgMCQ30 * 10) / 10,
      avgNBRS: Math.round(avgNBRS * 10) / 10,
      avgPBRS: Math.round(avgPBRS * 10) / 10
    };
  }, [patients, assessments]);

  // Dados para gráfico de evolução temporal (últimos 6 meses)
  const evolutionData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date;
    });

    const monthlyScores = last6Months.map(month => {
      const monthAssessments = assessments.filter(a => {
        const assessmentDate = new Date(a.date);
        return assessmentDate.getMonth() === month.getMonth() &&
               assessmentDate.getFullYear() === month.getFullYear();
      });

      if (monthAssessments.length === 0) return 0;
      
      const avgScore = monthAssessments.reduce((sum, a) => sum + a.totalScore, 0) / monthAssessments.length;
      return Math.round(avgScore);
    });

    const labels = last6Months.map(d => 
      d.toLocaleDateString('pt-BR', { month: 'short' })
    );

    return {
      labels,
      datasets: [{
        data: monthlyScores.length > 0 && monthlyScores.some(s => s > 0) 
          ? monthlyScores 
          : [0, 0, 0, 0, 0, 0]
      }]
    };
  }, [assessments]);

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Estatísticas</Text>
          <Text className="text-base text-muted mt-1">Visualização de dados e progresso</Text>
        </View>

        {/* Stats Cards */}
        <View className="px-6 gap-4 mb-6">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Total de Pacientes</Text>
              <Text className="text-3xl font-bold text-primary">{stats.totalPatients}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Pacientes Ativos</Text>
              <Text className="text-3xl font-bold text-success">{stats.activePatients}</Text>
            </View>
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm text-muted mb-1">Total de Avaliações</Text>
            <Text className="text-3xl font-bold text-foreground">{stats.totalAssessments}</Text>
          </View>
        </View>

        {/* Average Scores */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-foreground mb-4">Médias por Questionário</Text>
          <View className="gap-3">
            <View className="bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-foreground">MCQ-30</Text>
                <Text className="text-2xl font-bold text-primary">{stats.avgMCQ30}</Text>
              </View>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-foreground">NBRS</Text>
                <Text className="text-2xl font-bold text-warning">{stats.avgNBRS}</Text>
              </View>
            </View>
            <View className="bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-foreground">PBRS</Text>
                <Text className="text-2xl font-bold text-success">{stats.avgPBRS}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Evolution Chart */}
        {assessments.length > 0 && (
          <View className="px-6 mb-6">
            <Text className="text-xl font-bold text-foreground mb-4">Evolução Temporal</Text>
            <View className="bg-surface rounded-2xl p-4 border border-border">
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
                Média de scores dos últimos 6 meses
              </Text>
            </View>
          </View>
        )}

        {assessments.length === 0 && (
          <View className="px-6">
            <View className="bg-surface rounded-2xl p-6 border border-border items-center">
              <Text className="text-base font-semibold text-foreground mb-2">
                Nenhuma avaliação registrada
              </Text>
              <Text className="text-sm text-muted text-center">
                Aplique questionários aos pacientes para visualizar estatísticas e gráficos de evolução.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
