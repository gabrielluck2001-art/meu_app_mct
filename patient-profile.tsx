import { Text, View, ScrollView, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PatientDashboard } from "@/components/patient-dashboard";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import type { Patient, Assessment } from "@/types/models";

export default function PatientProfileScreen() {
  const colors = useColors();
  const { patients, assessments, mappings, deletePatient } = useApp();
  const params = useLocalSearchParams();
  const patientId = params.patientId as string;

  const patient = patients.find(p => p.id === patientId);
  const patientAssessments = assessments.filter(a => a.patientId === patientId);
  const patientMappings = mappings.filter(m => m.patientId === patientId);

  if (!patient) {
    return (
      <ScreenContainer className="bg-background">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-lg font-semibold text-foreground mb-2">Paciente não encontrado</Text>
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleEdit = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/add-patient?patientId=${patient.id}`);
  };

  const handleDelete = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir ${patient.name}? Esta ação não pode ser desfeita e todos os dados do paciente serão perdidos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePatient(patient.id);
              Alert.alert('Sucesso', 'Paciente excluído com sucesso', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o paciente');
            }
          }
        }
      ]
    );
  };

  const handleNewAssessment = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/select-questionnaire?patientId=${patient.id}`);
  };

  const handleNewMapping = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Sugerir modelo baseado no transtorno
    const disorderModel = patient.disorder && patient.disorder !== 'Não especificado' && patient.disorder !== 'Outro'
      ? patient.disorder
      : undefined;
    
    if (disorderModel) {
      Alert.alert(
        'Mapeamento Metacognitivo',
        `Deseja criar um mapeamento usando o modelo de ${disorderModel}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim', onPress: () => {
            router.push(`/create-mapping?patientId=${patient.id}&model=${disorderModel}`);
          }}
        ]
      );
    } else {
      router.push(`/create-mapping?patientId=${patient.id}`);
    }
  };

  const getDisorderColor = (disorder?: string) => {
    switch (disorder) {
      case 'TAG': return colors.warning;
      case 'Depressão': return colors.error;
      case 'TOC': return colors.primary;
      case 'TEPT': return '#9333EA';
      default: return colors.muted;
    }
  };

  const getSuggestedQuestionnaires = (disorder?: string): string[] => {
    switch (disorder) {
      case 'TAG':
        return ['MCQ-30 (Metacognições)', 'PBRS (Crenças Positivas sobre Ruminação)'];
      case 'Depressão':
        return ['MCQ-30 (Metacognições)', 'NBRS (Crenças Negativas sobre Ruminação)', 'PBRS (Crenças Positivas)'];
      case 'TOC':
        return ['MCQ-30 (Metacognições)', 'NBRS (Crenças Negativas)'];
      case 'TEPT':
        return ['MCQ-30 (Metacognições)', 'NBRS (Crenças Negativas)'];
      default:
        return ['MCQ-30 (Metacognições)', 'NBRS', 'PBRS'];
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
            <Text className="text-2xl font-bold text-foreground">Perfil do Paciente</Text>
          </View>
        </View>

        {/* Patient Info Card */}
        <View className="px-6 mb-6">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            {/* Avatar and Name */}
            <View className="items-center mb-4">
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center mb-3">
                <Text className="text-white font-bold text-3xl">
                  {getInitials(patient.name)}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-foreground mb-1">{patient.name}</Text>
              <Text className="text-base text-muted">{patient.age} anos</Text>
            </View>

            {/* Info Grid */}
            <View className="gap-3">
              {patient.disorder && patient.disorder !== 'Não especificado' && (
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ backgroundColor: `${getDisorderColor(patient.disorder)}20` }}>
                    <IconSymbol name="doc.text.fill" size={16} color={getDisorderColor(patient.disorder)} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Transtorno em Acompanhamento</Text>
                    <Text className="text-base font-semibold text-foreground">{patient.disorder}</Text>
                  </View>
                </View>
              )}

              {patient.phone && (
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <IconSymbol name="paperplane.fill" size={16} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Telefone</Text>
                    <Text className="text-base text-foreground">{patient.phone}</Text>
                  </View>
                </View>
              )}

              {patient.email && (
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
                    <IconSymbol name="paperplane.fill" size={16} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted">Email</Text>
                    <Text className="text-base text-foreground">{patient.email}</Text>
                  </View>
                </View>
              )}

              {patient.notes && (
                <View className="mt-2 p-3 bg-background rounded-xl">
                  <Text className="text-xs font-semibold text-muted mb-1">Notas Clínicas</Text>
                  <Text className="text-sm text-foreground leading-relaxed">{patient.notes}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View className="flex-row gap-2 mt-4">
              <Pressable
                onPress={handleEdit}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, flex: 1 }]}
              >
                <View className="bg-primary rounded-xl p-3 items-center">
                  <Text className="text-white font-semibold">Editar</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, flex: 1 }]}
              >
                <View className="bg-error/10 rounded-xl p-3 items-center border border-error/20">
                  <Text className="text-error font-semibold">Excluir</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Patient Dashboard */}
        <View className="px-6 mb-6">
          <PatientDashboard assessments={patientAssessments} mappings={patientMappings} />
        </View>

        {/* Suggested Questionnaires */}
        {patient.disorder && patient.disorder !== 'Não especificado' && (
          <View className="px-6 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Questionários Sugeridos para {patient.disorder}
            </Text>
            <View className="bg-primary/5 rounded-2xl p-4 border border-primary/20">
              {getSuggestedQuestionnaires(patient.disorder).map((q, index) => (
                <View key={index} className="flex-row items-center mb-2 last:mb-0">
                  <IconSymbol name="checkmark.circle.fill" size={20} color={colors.primary} />
                  <Text className="text-sm text-foreground ml-2">{q}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Ações Rápidas</Text>
          <View className="gap-3">
            <Pressable
              onPress={handleNewAssessment}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center">
                <IconSymbol name="doc.text.fill" size={24} color={colors.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-foreground">Nova Avaliação</Text>
                  <Text className="text-xs text-muted">Aplicar questionário</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </View>
            </Pressable>

            <Pressable
              onPress={handleNewMapping}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center">
                <IconSymbol name="map.fill" size={24} color={colors.primary} />
                <View className="flex-1 ml-3">
                  <Text className="text-base font-semibold text-foreground">Novo Mapeamento</Text>
                  <Text className="text-xs text-muted">Mapeamento metacognitivo</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Assessment History */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Histórico de Avaliações ({patientAssessments.length})
          </Text>
          {patientAssessments.length === 0 ? (
            <View className="bg-surface rounded-2xl p-6 border border-border items-center">
              <Text className="text-muted text-center">
                Nenhuma avaliação registrada ainda
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {patientAssessments.slice(0, 5).map((assessment) => (
                <View
                  key={assessment.id}
                  className="bg-surface rounded-xl p-4 border border-border"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-base font-semibold text-foreground">
                      {assessment.questionnaireId.toUpperCase()}
                    </Text>
                    <Text className="text-xs text-muted">
                      {new Date(assessment.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <Text className="text-sm text-muted">
                    Score Total: {assessment.totalScore}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Mapping History */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Histórico de Mapeamentos ({patientMappings.length})
          </Text>
          {patientMappings.length === 0 ? (
            <View className="bg-surface rounded-2xl p-6 border border-border items-center">
              <Text className="text-muted text-center">
                Nenhum mapeamento registrado ainda
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {patientMappings.slice(0, 5).map((mapping) => (
                <View
                  key={mapping.id}
                  className="bg-surface rounded-xl p-4 border border-border"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-base font-semibold text-foreground">
                      {mapping.model}
                    </Text>
                    <Text className="text-xs text-muted">
                      {new Date(mapping.date).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View className="gap-1">
                    {mapping.positiveMetabeliefs.length > 0 && (
                      <Text className="text-xs text-success">
                        {mapping.positiveMetabeliefs.length} metacrenças positivas
                      </Text>
                    )}
                    {mapping.negativeMetabeliefs.length > 0 && (
                      <Text className="text-xs text-error">
                        {mapping.negativeMetabeliefs.length} metacrenças negativas
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
