import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './src/screens/DashboardScreen';
import DriverListScreen from './src/screens/DriverListScreen';
import DriverFormScreen from './src/screens/DriverFormScreen';
import VehicleListScreen from './src/screens/VehicleListScreen';
import VehicleFormScreen from './src/screens/VehicleFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Driver & Vehicle Management' }}
        />
        <Stack.Screen 
          name="DriverList" 
          component={DriverListScreen}
          options={{ title: 'Drivers' }}
        />
        <Stack.Screen 
          name="DriverForm" 
          component={DriverFormScreen}
          options={{ title: 'Driver Details' }}
        />
        <Stack.Screen 
          name="VehicleList" 
          component={VehicleListScreen}
          options={{ title: 'Vehicles' }}
        />
        <Stack.Screen 
          name="VehicleForm" 
          component={VehicleFormScreen}
          options={{ title: 'Vehicle Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
