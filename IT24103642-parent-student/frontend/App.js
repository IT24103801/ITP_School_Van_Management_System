import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './src/screens/DashboardScreen';
import ParentListScreen from './src/screens/ParentListScreen';
import ParentFormScreen from './src/screens/ParentFormScreen';
import StudentListScreen from './src/screens/StudentListScreen';
import StudentFormScreen from './src/screens/StudentFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Dashboard">
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'Parent & Student Management' }}
        />
        <Stack.Screen 
          name="ParentList" 
          component={ParentListScreen}
          options={{ title: 'Parents' }}
        />
        <Stack.Screen 
          name="ParentForm" 
          component={ParentFormScreen}
          options={{ title: 'Parent Details' }}
        />
        <Stack.Screen 
          name="StudentList" 
          component={StudentListScreen}
          options={{ title: 'Students' }}
        />
        <Stack.Screen 
          name="StudentForm" 
          component={StudentFormScreen}
          options={{ title: 'Student Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
