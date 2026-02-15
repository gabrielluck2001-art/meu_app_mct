import { Text, View, TextInput, FlatList, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import type { Patient } from "@/types/models";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { router } from "expo-router";

export default function PatientsScreen() {
  const colors = useColors();
  const { patients, loading } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPatient = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push('/add-patient');
  };

  const handlePatientPress = (patient: Patient) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(`/patient-profile?patientId=${patient.id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderPatientItem = ({ item }: { item: Patient }) => (
    <Pressable
      onPress={() => handlePatientPress(item)}
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <View className="bg-surface rounded-2xl p-4 border border-border flex-row items-center mb-3">
        {/* Avatar */}
        <View className="w-14 h-14 rounded-full bg-primary items-center justify-center mr-4">
          <Text className="text-white font-bold text-lg">
            {getInitials(item.name)}
          </Text>
        </View>
        
        {/* Info */}
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground mb-1">
            {item.name}
          </Text>
          <Text className="text-sm text-muted">
            {item.age} anos
          </Text>
        </View>

        {/* Arrow */}
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4 flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-bold text-foreground">Pacientes</Text>
            <Text className="text-sm text-muted mt-1">
              {filteredPatients.length} {filteredPatients.length === 1 ? 'paciente' : 'pacientes'}
            </Text>
          </View>
          <Pressable
            onPress={handleAddPatient}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <IconSymbol name="plus.circle.fill" size={36} color={colors.primary} />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="bg-surface rounded-xl px-4 py-3 flex-row items-center border border-border">
            <IconSymbol name="paperplane.fill" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 ml-3 text-base text-foreground"
              placeholder="Buscar paciente..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Patient List */}
        <View className="flex-1 px-6">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted">Carregando...</Text>
            </View>
          ) : filteredPatients.length === 0 ? (
            <View className="flex-1 items-center justify-center px-8">
              <Text className="text-lg font-semibold text-foreground mb-2 text-center">
                {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
              </Text>
              <Text className="text-sm text-muted text-center mb-6">
                {searchQuery 
                  ? 'Tente buscar com outro termo'
                  : 'Toque no ícone + para adicionar seu primeiro paciente'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredPatients}
              renderItem={renderPatientItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
