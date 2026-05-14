import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './src/screens/DashboardScreen';
import BillingListScreen from './src/screens/BillingListScreen';
import BillingFormScreen from './src/screens/BillingFormScreen';
import PaymentHistoryScreen from './src/screens/PaymentHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Billing & Payment Management' }}
        />
        <Stack.Screen 
          name="BillingList" 
          component={BillingListScreen}
          options={{ title: 'Billing Records' }}
        />
        <Stack.Screen 
          name="BillingForm" 
          component={BillingFormScreen}
          options={{ title: 'Billing Details' }}
        />
        <Stack.Screen 
          name="PaymentHistory" 
          component={PaymentHistoryScreen}
          options={{ title: 'Payment History' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
