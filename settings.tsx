import { Text, View, ScrollView, Pressable, TextInput, Alert, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState, useEffect } from "react";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Therapist } from "@/types/models";
import { saveTherapist } from "@/lib/storage";

export default function SettingsScreen() {
  const colors = useColors();
  const { therapist, refreshData } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  
  // Therapist data
  const [name, setName] = useState(therapist?.name || "");
  const [professionalId, setProfessionalId] = useState(therapist?.professionalId || "");
  const [email, setEmail] = useState(therapist?.email || "");
  const [phone, setPhone] = useState(therapist?.phone || "");
  
  // Settings
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  useEffect(() => {
    if (therapist) {
      setName(therapist.name);
      setProfessionalId(therapist.professionalId);
      setEmail(therapist.email || "");
      setPhone(therapist.phone || "");
    }
  }, [therapist]);

  const handleSaveProfile = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    if (!name.trim() || !professionalId.trim()) {
      Alert.alert('Campos obrigatórios', 'Nome e registro profissional são obrigatórios');
      return;
    }

    try {
      const therapistData: Therapist = {
        id: therapist?.id || `therapist-${Date.now()}`,
        name: name.trim(),
        professionalId: professionalId.trim(),
        email: email.trim(),
        phone: phone.trim(),
        createdAt: therapist?.createdAt || new Date().toISOString()
      };
      
      await saveTherapist(therapistData);
      await refreshData();
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil');
      console.error('Erro ao salvar terapeuta:', error);
    }
  };

  const handleExportData = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      'Exportar Dados',
      'Esta funcionalidade permite fazer backup de todos os dados do aplicativo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Exportar', onPress: () => {
          Alert.alert('Em desenvolvimento', 'Exportação de dados será implementada');
        }}
      ]
    );
  };

  const handleImportData = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      'Importar Dados',
      'Esta funcionalidade permite restaurar dados de um backup anterior. ATENÇÃO: Todos os dados atuais serão substituídos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Importar', style: 'destructive', onPress: () => {
          Alert.alert('Em desenvolvimento', 'Importação de dados será implementada');
        }}
      ]
    );
  };

  const handleClearData = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Alert.alert(
      'Limpar Dados',
      'ATENÇÃO: Esta ação irá apagar TODOS os dados do aplicativo permanentemente. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar Tudo', style: 'destructive', onPress: async () => {
          try {
            await AsyncStorage.clear();
            await refreshData();
            Alert.alert('Sucesso', 'Todos os dados foram apagados');
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível limpar os dados');
          }
        }}
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Configurações</Text>
          <Text className="text-base text-muted mt-1">Perfil e preferências</Text>
        </View>

        {/* Therapist Profile Section */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-foreground">Perfil do Terapeuta</Text>
            <Pressable
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setIsEditing(!isEditing);
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text className="text-sm text-primary font-medium">
                {isEditing ? 'Cancelar' : 'Editar'}
              </Text>
            </Pressable>
          </View>

          <View className="bg-surface rounded-2xl p-4 border border-border gap-3">
            {/* Nome */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Nome Completo</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background rounded-lg px-3 py-2 text-base text-foreground border border-border"
                  placeholder="Seu nome"
                  placeholderTextColor={colors.muted}
                  value={name}
                  onChangeText={setName}
                />
              ) : (
                <Text className="text-base text-foreground">
                  {name || 'Não informado'}
                </Text>
              )}
            </View>

            {/* Registro Profissional */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Registro Profissional (CRP/CRM)</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background rounded-lg px-3 py-2 text-base text-foreground border border-border"
                  placeholder="Ex: CRP 12/34567"
                  placeholderTextColor={colors.muted}
                  value={professionalId}
                  onChangeText={setProfessionalId}
                />
              ) : (
                <Text className="text-base text-foreground">
                  {professionalId || 'Não informado'}
                </Text>
              )}
            </View>

            {/* Email */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Email</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background rounded-lg px-3 py-2 text-base text-foreground border border-border"
                  placeholder="email@exemplo.com"
                  placeholderTextColor={colors.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text className="text-base text-foreground">
                  {email || 'Não informado'}
                </Text>
              )}
            </View>

            {/* Telefone */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">Telefone</Text>
              {isEditing ? (
                <TextInput
                  className="bg-background rounded-lg px-3 py-2 text-base text-foreground border border-border"
                  placeholder="(00) 00000-0000"
                  placeholderTextColor={colors.muted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-base text-foreground">
                  {phone || 'Não informado'}
                </Text>
              )}
            </View>

            {isEditing && (
              <Pressable
                onPress={handleSaveProfile}
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1, marginTop: 8 }]}
              >
                <View className="bg-primary rounded-xl p-3 items-center">
                  <Text className="text-white font-semibold">Salvar Perfil</Text>
                </View>
              </Pressable>
            )}
          </View>
        </View>

        {/* Preferences Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Preferências</Text>
          
          <View className="bg-surface rounded-2xl border border-border overflow-hidden">
            {/* Dark Mode */}
            <View className="px-4 py-3 flex-row items-center justify-between border-b border-border">
              <Text className="text-base text-foreground">Modo Escuro</Text>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Notifications */}
            <View className="px-4 py-3 flex-row items-center justify-between border-b border-border">
              <Text className="text-base text-foreground">Notificações</Text>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            {/* Auto Backup */}
            <View className="px-4 py-3 flex-row items-center justify-between">
              <Text className="text-base text-foreground">Backup Automático</Text>
              <Switch
                value={autoBackup}
                onValueChange={setAutoBackup}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Data Management Section */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Gerenciamento de Dados</Text>
          
          <View className="gap-3">
            <Pressable
              onPress={handleExportData}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center">
                <IconSymbol name="arrow.up" size={20} color={colors.foreground} />
                <Text className="text-base text-foreground ml-3 flex-1">Exportar Dados</Text>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </View>
            </Pressable>

            <Pressable
              onPress={handleImportData}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-surface rounded-xl p-4 border border-border flex-row items-center">
                <IconSymbol name="arrow.down" size={20} color={colors.foreground} />
                <Text className="text-base text-foreground ml-3 flex-1">Importar Dados</Text>
                <IconSymbol name="chevron.right" size={20} color={colors.muted} />
              </View>
            </Pressable>

            <Pressable
              onPress={handleClearData}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <View className="bg-error/10 rounded-xl p-4 border border-error/20 flex-row items-center">
                <IconSymbol name="paperplane.fill" size={20} color={colors.error} />
                <Text className="text-base text-error ml-3 flex-1 font-medium">Limpar Todos os Dados</Text>
                <IconSymbol name="chevron.right" size={20} color={colors.error} />
              </View>
            </Pressable>
          </View>
        </View>

        {/* About Section */}
        <View className="px-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Sobre</Text>
          
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-base font-semibold text-foreground mb-2">
              Terapia Metacognitiva
            </Text>
            <Text className="text-sm text-muted leading-relaxed mb-3">
              Aplicativo profissional para terapeutas que trabalham com a abordagem de Terapia Metacognitiva (MCT) desenvolvida por Adrian Wells.
            </Text>
            <Text className="text-xs text-muted">Versão 1.0.0</Text>
            <Text className="text-xs text-muted">© 2026 - Todos os direitos reservados</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
