import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useMemo } from "react";
import { useApp } from "@/lib/app-context";
import type { Patient, Assessment } from "@/types/models";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function HomeScreen() {
  const colors = useColors();
  const { patients, assessments, loading } = useApp();

  const handleAddPatient = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navegar para tela de adicionar paciente (implementar depois)
  };

  // Calcular estatísticas
  const totalPatients = patients.length;
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const assessmentsThisMonth = assessments.filter(
    a => new Date(a.date) >= thisMonth
  ).length;

  // Pacientes recentes (com avaliações)
  const recentPatients = patients
    .map(patient => {
      const patientAssessments = assessments.filter(a => a.patientId === patient.id);
      const lastAssessment = patientAssessments[0];
      return { patient, lastAssessment };
    })
    .filter(item => item.lastAssessment)
    .sort((a, b) => 
      new Date(b.lastAssessment!.date).getTime() - new Date(a.lastAssessment!.date).getTime()
    )
    .slice(0, 5);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Dashboard</Text>
          <Text className="text-base text-muted mt-1">Terapia Metacognitiva</Text>
        </View>

        {/* Statistics Cards */}
        <View className="px-6 gap-3 mb-6">
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Total de Pacientes</Text>
              <Text className="text-3xl font-bold text-foreground">{totalPatients}</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border">
              <Text className="text-sm text-muted mb-1">Avaliações (Mês)</Text>
              <Text className="text-3xl font-bold text-primary">{assessmentsThisMonth}</Text>
            </View>
          </View>
        </View>

        {/* Recent Patients */}
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-foreground">Pacientes Recentes</Text>
            <Pressable
              onPress={handleAddPatient}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <IconSymbol name="plus.circle.fill" size={32} color={colors.primary} />
            </Pressable>
          </View>

          {loading ? (
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <Text className="text-muted text-center">Carregando...</Text>
            </View>
          ) : recentPatients.length === 0 ? (
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <Text className="text-muted text-center mb-2">Nenhum paciente cadastrado</Text>
              <Text className="text-sm text-muted text-center">
                Toque no ícone + para adicionar seu primeiro paciente
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {recentPatients.map(({ patient, lastAssessment }) => (
                <Pressable
                  key={patient.id}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center">
                    {/* Avatar */}
                    <View className="w-12 h-12 rounded-full bg-primary items-center justify-center mr-3">
                      <Text className="text-white font-bold text-base">
                        {getInitials(patient.name)}
                      </Text>
                    </View>
                    
                    {/* Info */}
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">
                        {patient.name}
                      </Text>
                      <Text className="text-sm text-muted">
                        Última avaliação: {formatDate(lastAssessment!.date)}
                      </Text>
                    </View>

                    {/* Arrow */}
                    <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
