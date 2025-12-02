import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EnhancedHomeScreen } from './src/screens/EnhancedHomeScreen';
import { TemplateSelectionScreen } from './src/screens/TemplateSelectionScreen';
import { CreateAgentWizardScreen } from './src/screens/CreateAgentWizardScreen';
import { AgentDetailScreen } from './src/screens/AgentDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
