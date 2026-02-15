import { Text, View, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function MappingScreen() {
  const colors = useColors();
  const { patients } = useApp();
  const [selectedPatient, setSelectedPatient] = useState<string>("");

  const handleCreateMapping = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!selectedPatient) {
      Alert.alert('Atenção', 'Selecione um paciente primeiro');
      return;
    }
    
    // TODO: Navegar para tela de criar mapeamento
    Alert.alert('Em desenvolvimento', 'Tela de criar mapeamento será implementada');
  };

  const handleViewMappings = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (!selectedPatient) {
      Alert.alert('Atenção', 'Selecione um paciente primeiro');
      return;
    }
    
    // TODO: Navegar para lista de mapeamentos do paciente
    Alert.alert('Em desenvolvimento', 'Lista de mapeamentos será implementada');
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Mapeamento</Text>
          <Text className="text-base text-muted mt-1">Mapeamento Metacognitivo</Text>
        </View>

        {/* Info Card */}
        <View className="px-6 mb-6">
          <View className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
            <Text className="text-sm text-foreground leading-relaxed">
              O mapeamento metacognitivo identifica os gatilhos, crenças e padrões de processamento 
              que mantêm o sofrimento psicológico do paciente.
            </Text>
          </View>
        </View>

        {/* Patient Selection */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Selecionar Paciente</Text>
          
          {patients.length === 0 ? (
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <Text className="text-muted text-center">
                Nenhum paciente cadastrado. Adicione pacientes na aba Pacientes.
              </Text>
            </View>
          ) : (
            <View className="gap-2">
              {patients.slice(0, 5).map(patient => (
                <Pressable
                  key={patient.id}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setSelectedPatient(patient.id);
                  }}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className={`rounded-xl p-4 border ${
                    selectedPatient === patient.id 
                      ? 'bg-primary/10 border-primary' 
                      : 'bg-surface border-border'
                  }`}>
                    <Text className={`text-base font-semibold ${
                      selectedPatient === patient.id ? 'text-primary' : 'text-foreground'
                    }`}>
                      {patient.name}
                    </Text>
                    <Text className="text-sm text-muted mt-1">
                      {patient.age} anos
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        {selectedPatient && (
          <View className="px-6 gap-3">
            <Pressable
              onPress={handleCreateMapping}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <View className="bg-primary rounded-2xl p-4 flex-row items-center justify-center">
                <IconSymbol name="plus.circle.fill" size={24} color="white" />
                <Text className="text-white font-semibold text-base ml-2">
                  Novo Mapeamento
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleViewMappings}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-surface rounded-2xl p-4 flex-row items-center justify-center border border-border">
                <IconSymbol name="doc.text.fill" size={24} color={colors.foreground} />
                <Text className="text-foreground font-semibold text-base ml-2">
                  Ver Mapeamentos Anteriores
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* Info Section */}
        <View className="px-6 mt-8">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Modelos Disponíveis
          </Text>
          
          <View className="gap-3">
            {[
              { name: 'TAG', desc: 'Transtorno de Ansiedade Generalizada' },
              { name: 'Depressão', desc: 'Transtorno Depressivo' },
              { name: 'TOC', desc: 'Transtorno Obsessivo-Compulsivo' },
              { name: 'TEPT', desc: 'Transtorno de Estresse Pós-Traumático' }
            ].map(model => (
              <View key={model.name} className="bg-surface rounded-xl p-4 border border-border">
                <Text className="text-base font-semibold text-foreground">{model.name}</Text>
                <Text className="text-sm text-muted mt-1">{model.desc}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
