import { Text, View, ScrollView, Pressable, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function TechniquesScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "Todas" },
    { id: "beliefs", name: "Modificação de Crenças" },
    { id: "attention", name: "Treinamento Atencional" },
    { id: "mindfulness", name: "Atenção Plena Destacada" },
    { id: "exposure", name: "Exposição" },
    { id: "postponement", name: "Adiamento" }
  ];

  const techniques = [
    {
      id: "1",
      name: "Atenção Plena Destacada (Detached Mindfulness)",
      category: "mindfulness",
      description: "Técnica para observar pensamentos sem engajar com eles ou tentar mudá-los"
    },
    {
      id: "2",
      name: "Treinamento de Atenção (ATT)",
      category: "attention",
      description: "Exercício para aumentar flexibilidade atencional e reduzir autofoco"
    },
    {
      id: "3",
      name: "Adiamento de Preocupação/Ruminação",
      category: "postponement",
      description: "Postergar preocupação ou ruminação para horário específico"
    },
    {
      id: "4",
      name: "Experimentos Comportamentais Metacognitivos",
      category: "beliefs",
      description: "Testar crenças metacognitivas através de experimentos breves"
    },
    {
      id: "5",
      name: "Refocalização Atencional Situacional (SAR)",
      category: "attention",
      description: "Mudar foco de atenção de interno para externo em situações específicas"
    }
  ];

  const filteredTechniques = techniques.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || tech.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTechniquePress = (techniqueId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // TODO: Navegar para detalhes da técnica
  };

  return (
    <ScreenContainer className="bg-background">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-foreground">Biblioteca</Text>
          <Text className="text-base text-muted mt-1">Técnicas Metacognitivas</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="bg-surface rounded-xl px-4 py-3 flex-row items-center border border-border">
            <IconSymbol name="paperplane.fill" size={20} color={colors.muted} />
            <TextInput
              className="flex-1 ml-3 text-base text-foreground"
              placeholder="Buscar técnica..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
            {categories.map(category => (
              <Pressable
                key={category.id}
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedCategory(category.id);
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, marginRight: 8 }]}
              >
                <View className={`rounded-full px-4 py-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary'
                    : 'bg-surface border border-border'
                }`}>
                  <Text className={`text-sm font-medium ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'text-foreground'
                  }`}>
                    {category.name}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Techniques List */}
        <ScrollView className="flex-1 px-6" contentContainerStyle={{ paddingBottom: 20 }}>
          {filteredTechniques.length === 0 ? (
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-lg font-semibold text-foreground mb-2 text-center">
                Nenhuma técnica encontrada
              </Text>
              <Text className="text-sm text-muted text-center">
                Tente buscar com outro termo
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredTechniques.map(technique => (
                <Pressable
                  key={technique.id}
                  onPress={() => handleTechniquePress(technique.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <View className="bg-surface rounded-2xl p-4 border border-border">
                    <Text className="text-base font-semibold text-foreground mb-2">
                      {technique.name}
                    </Text>
                    <Text className="text-sm text-muted leading-relaxed">
                      {technique.description}
                    </Text>
                    <View className="flex-row items-center mt-3">
                      <Text className="text-xs text-primary font-medium">
                        Ver detalhes
                      </Text>
                      <IconSymbol name="chevron.right" size={16} color={colors.primary} />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
