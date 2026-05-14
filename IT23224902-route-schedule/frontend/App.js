import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RouteListScreen from './src/screens/RouteListScreen';
import RouteDetailScreen from './src/screens/RouteDetailScreen';
import LiveTrackingScreen from './src/screens/LiveTrackingScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RouteList">
        <Stack.Screen 
          name="RouteList" 
          component={RouteListScreen}
          options={{ title: 'Routes & Schedules' }}
        />
        <Stack.Screen 
          name="RouteDetail" 
          component={RouteDetailScreen}
          options={{ title: 'Route Details' }}
        />
        <Stack.Screen 
          name="LiveTracking" 
          component={LiveTrackingScreen}
          options={{ title: 'Live GPS Tracking' }}
        />
        <Stack.Screen 
          name="Schedule" 
          component={ScheduleScreen}
          options={{ title: 'Schedule Management' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
