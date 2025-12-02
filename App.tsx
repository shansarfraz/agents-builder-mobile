import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { EnhancedHomeScreen } from './src/screens/EnhancedHomeScreen';
import { TemplateSelectionScreen } from './src/screens/TemplateSelectionScreen';
import { CreateAgentWizardScreen } from './src/screens/CreateAgentWizardScreen';
import { AgentDetailScreen } from './src/screens/AgentDetailScreen';
import { AgentPreviewScreen } from './src/screens/AgentPreviewScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Home" component={EnhancedHomeScreen} />
          <Stack.Screen name="TemplateSelection" component={TemplateSelectionScreen} />
          <Stack.Screen name="CreateAgentWizard" component={CreateAgentWizardScreen} />
          <Stack.Screen name="AgentDetail" component={AgentDetailScreen} />
          <Stack.Screen name="AgentPreview" component={AgentPreviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
