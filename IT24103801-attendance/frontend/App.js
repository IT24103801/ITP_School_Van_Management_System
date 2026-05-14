import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './src/screens/DashboardScreen';
import AttendanceListScreen from './src/screens/AttendanceListScreen';
import MarkAttendanceScreen from './src/screens/MarkAttendanceScreen';
import NotificationListScreen from './src/screens/NotificationListScreen';
import AttendanceDetailScreen from './src/screens/AttendanceDetailScreen';
import DailyReportsScreen from './src/screens/DailyReportsScreen';
import DelayAlertsScreen from './src/screens/DelayAlertsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Attendance & Notifications' }}
        />
        <Stack.Screen 
          name="AttendanceList" 
          component={AttendanceListScreen}
          options={{ title: 'Attendance Records' }}
        />
        <Stack.Screen 
          name="MarkAttendance" 
          component={MarkAttendanceScreen}
          options={{ title: 'Mark Attendance' }}
        />
        <Stack.Screen 
          name="NotificationList" 
          component={NotificationListScreen}
          options={{ title: 'Notifications' }}
        />
        <Stack.Screen
          name="AttendanceDetail"
          component={AttendanceDetailScreen}
          options={{ title: 'Attendance log' }}
        />
        <Stack.Screen
          name="DailyReports"
          component={DailyReportsScreen}
          options={{ title: 'Daily reports' }}
        />
        <Stack.Screen
          name="DelayAlerts"
          component={DelayAlertsScreen}
          options={{ title: 'Delay alerts' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
