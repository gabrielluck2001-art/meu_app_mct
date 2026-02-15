import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './app-context';
import { ThemeProvider } from './lib/theme-provider';
import { router } from 'expo-router';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Carregando...</Text>
            <StatusBar style="auto" />
          </View>
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
