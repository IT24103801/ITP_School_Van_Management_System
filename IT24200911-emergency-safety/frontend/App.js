import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './src/screens/DashboardScreen';
import SOSScreen from './src/screens/SOSScreen';
import IncidentReportScreen from './src/screens/IncidentReportScreen';
import BroadcastAlertScreen from './src/screens/BroadcastAlertScreen';
import SafetyCheckScreen from './src/screens/SafetyCheckScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Emergency & Safety' }}
        />
        <Stack.Screen 
          name="SOS" 
          component={SOSScreen}
          options={{ title: 'SOS Alert' }}
        />
        <Stack.Screen 
          name="IncidentReport" 
          component={IncidentReportScreen}
          options={{ title: 'Incident Reports' }}
        />
        <Stack.Screen 
          name="BroadcastAlert" 
          component={BroadcastAlertScreen}
          options={{ title: 'Broadcast Alerts' }}
        />
        <Stack.Screen 
          name="SafetyCheck" 
          component={SafetyCheckScreen}
          options={{ title: 'Safety Checks' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
