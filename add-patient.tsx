import { Text, View, ScrollView, Pressable, TextInput, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import type { Patient } from "@/types/models";

export default function AddPatientScreen() {
  const colors = useColors();
  const { patients, addPatient, updatePatient } = useApp();
  const params = useLocalSearchParams();
  const isEditing = !!params.patientId;
  
  // Buscar paciente se estiver editando
  const existingPatient = isEditing 
    ? patients.find(p => p.id === params.patientId)
    : undefined;

  const [name, setName] = useState(existingPatient?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(existingPatient?.dateOfBirth || "");
  const [gender, setGender] = useState<Patient['gender']>(existingPatient?.gender || undefined);
  const [disorder, setDisorder] = useState<Patient['disorder']>(existingPatient?.disorder || 'Não especificado');
  const [phone, setPhone] = useState(existingPatient?.phone || "");
  const [email, setEmail] = useState(existingPatient?.email || "");
  const [notes, setNotes] = useState(existingPatient?.notes || "");

  const genderOptions: Array<{ value: Patient['gender']; label: string }> = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Feminino', label: 'Feminino' },
    { value: 'Outro', label: 'Outro' },
    { value: 'Prefiro não informar', label: 'Prefiro não informar' }
  ];

  const disorderOptions: Array<{ value: Patient['disorder']; label: string }> = [
    { value: 'Não especificado', label: 'Não especificado' },
    { value: 'TAG', label: 'TAG - Transtorno de Ansiedade Generalizada' },
    { value: 'Depressão', label: 'Depressão' },
    { value: 'TOC', label: 'TOC - Transtorno Obsessivo-Compulsivo' },
    { value: 'TEPT', label: 'TEPT - Transtorno de Estresse Pós-Traumático' },
    { value: 'Outro', label: 'Outro' }
  ];

  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe o nome do paciente');
      return false;
    }
    if (!dateOfBirth.trim()) {
      Alert.alert('Campo obrigatório', 'Por favor, informe a data de nascimento');
      return false;
    }
    // Validar formato de data (YYYY-MM-DD ou DD/MM/YYYY)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateOfBirth)) {
      Alert.alert('Data inválida', 'Use o formato DD/MM/AAAA ou AAAA-MM-DD');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!validateForm()) {
      return;
    }

    try {
      const age = calculateAge(dateOfBirth);
      
      if (isEditing && existingPatient) {
        // Atualizar paciente existente
        const updatedPatient: Patient = {
          ...existingPatient,
          name: name.trim(),
          dateOfBirth,
          age,
          gender,
          disorder,
          phone: phone.trim(),
          email: email.trim(),
          notes: notes.trim(),
          updatedAt: new Date().toISOString()
        };
        await updatePatient(updatedPatient);
        Alert.alert('Sucesso', 'Paciente atualizado com sucesso!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        // Adicionar novo paciente
        const newPatient: Patient = {
          id: `patient-${Date.now()}`,
          name: name.trim(),
          dateOfBirth,
          age,
          gender,
          disorder,
          phone: phone.trim(),
          email: email.trim(),
          notes: notes.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          archived: false
        };
        await addPatient(newPatient);
        Alert.alert('Sucesso', 'Paciente adicionado com sucesso!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o paciente. Tente novamente.');
      console.error('Erro ao salvar paciente:', error);
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
            <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.foreground} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground">
              {isEditing ? 'Editar Paciente' : 'Novo Paciente'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6 gap-4">
          {/* Nome */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Nome Completo *</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              placeholder="Digite o nome do paciente"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>

          {/* Data de Nascimento */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Data de Nascimento *</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.muted}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              keyboardType="numbers-and-punctuation"
            />
            {dateOfBirth && (
              <Text className="text-xs text-muted mt-1">
                Idade: {calculateAge(dateOfBirth)} anos
              </Text>
            )}
          </View>

          {/* Gênero */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Gênero</Text>
            <View className="gap-2">
              {genderOptions.map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setGender(option.value);
                  }}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className={`rounded-xl p-3 border ${
                    gender === option.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface border-border'
                  }`}>
                    <Text className={`text-sm ${
                      gender === option.value ? 'text-primary font-semibold' : 'text-foreground'
                    }`}>
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Transtorno em Acompanhamento */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Transtorno em Acompanhamento
            </Text>
            <View className="gap-2">
              {disorderOptions.map(option => (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setDisorder(option.value);
                  }}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className={`rounded-xl p-3 border ${
                    disorder === option.value
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface border-border'
                  }`}>
                    <Text className={`text-sm ${
                      disorder === option.value ? 'text-primary font-semibold' : 'text-foreground'
                    }`}>
                      {option.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Telefone */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Telefone</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              placeholder="(00) 00000-0000"
              placeholderTextColor={colors.muted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              placeholder="email@exemplo.com"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Notas Clínicas */}
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">Notas Clínicas</Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-base text-foreground border border-border"
              placeholder="Informações relevantes sobre o paciente"
              placeholderTextColor={colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Botão Salvar */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, marginTop: 16 }]}
          >
            <View className="bg-primary rounded-2xl p-4 flex-row items-center justify-center">
              <IconSymbol name="checkmark.circle.fill" size={24} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                {isEditing ? 'Atualizar Paciente' : 'Salvar Paciente'}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
