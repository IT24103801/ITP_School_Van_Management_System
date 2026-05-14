import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainMenuScreen from './src/screens/MainMenuScreen';

// Module 1 - Route & Schedule
import RouteListScreen from './src/modules/route-schedule/RouteListScreen';
import RouteDetailScreen from './src/modules/route-schedule/RouteDetailScreen';
import ScheduleScreen from './src/modules/route-schedule/ScheduleScreen';
import LiveTrackingScreen from './src/modules/route-schedule/LiveTrackingScreen';

// Module 2 - Emergency & Safety
import EmergencyDashboard from './src/modules/emergency-safety/DashboardScreen';
import SOSScreen from './src/modules/emergency-safety/SOSScreen';
import IncidentScreen from './src/modules/emergency-safety/IncidentReportScreen';
import BroadcastScreen from './src/modules/emergency-safety/BroadcastAlertScreen';
import SafetyCheckScreen from './src/modules/emergency-safety/SafetyCheckScreen';

// Module 3 - Attendance
import AttendanceDashboard from './src/modules/attendance/DashboardScreen';
import AttendanceListScreen from './src/modules/attendance/AttendanceListScreen';
import MarkAttendanceScreen from './src/modules/attendance/MarkAttendanceScreen';
import NotificationListScreen from './src/modules/attendance/NotificationListScreen';
import AttendanceDetailScreen from './src/modules/attendance/AttendanceDetailScreen';
import DailyReportsScreen from './src/modules/attendance/DailyReportsScreen';
import DelayAlertsScreen from './src/modules/attendance/DelayAlertsScreen';

// Module 4 - Parent & Student
import ParentStudentDashboard from './src/modules/parent-student/DashboardScreen';
import ParentListScreen from './src/modules/parent-student/ParentListScreen';
import ParentFormScreen from './src/modules/parent-student/ParentFormScreen';
import StudentListScreen from './src/modules/parent-student/StudentListScreen';
import StudentFormScreen from './src/modules/parent-student/StudentFormScreen';

// Module 5 - Billing
import BillingDashboard from './src/modules/billing/DashboardScreen';
import BillingListScreen from './src/modules/billing/BillingListScreen';
import BillingFormScreen from './src/modules/billing/BillingFormScreen';
import PaymentHistoryScreen from './src/modules/billing/PaymentHistoryScreen';

// Module 6 - Driver & Vehicle
import DriverVehicleDashboard from './src/modules/driver-vehicle/DashboardScreen';
import DriverListScreen from './src/modules/driver-vehicle/DriverListScreen';
import DriverFormScreen from './src/modules/driver-vehicle/DriverFormScreen';
import VehicleListScreen from './src/modules/driver-vehicle/VehicleListScreen';
import VehicleFormScreen from './src/modules/driver-vehicle/VehicleFormScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="MainMenu"
        screenOptions={{
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }}
      >
        <Stack.Screen 
          name="MainMenu" 
          component={MainMenuScreen}
          options={{ title: 'School Van Management System' }}
        />
        
        {/* Module 1 - Route & Schedule */}
        <Stack.Screen name="RouteList" component={RouteListScreen} options={{ title: 'Routes' }} />
        <Stack.Screen name="RouteDetail" component={RouteDetailScreen} options={{ title: 'Route Details' }} />
        <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule' }} />
        <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ title: 'Live Tracking' }} />
        
        {/* Module 2 - Emergency & Safety */}
        <Stack.Screen name="EmergencyDashboard" component={EmergencyDashboard} options={{ title: 'Emergency & Safety' }} />
        <Stack.Screen name="SOS" component={SOSScreen} options={{ title: 'SOS Alerts' }} />
        <Stack.Screen name="IncidentReport" component={IncidentScreen} options={{ title: 'Incident Reports' }} />
        <Stack.Screen name="BroadcastAlert" component={BroadcastScreen} options={{ title: 'Broadcast Alerts' }} />
        <Stack.Screen name="SafetyCheck" component={SafetyCheckScreen} options={{ title: 'Safety Checks' }} />
        
        {/* Module 3 - Attendance */}
        <Stack.Screen name="AttendanceDashboard" component={AttendanceDashboard} options={{ title: 'Attendance' }} />
        <Stack.Screen name="AttendanceList" component={AttendanceListScreen} options={{ title: 'Attendance Records' }} />
        <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} options={{ title: 'Mark Attendance' }} />
        <Stack.Screen name="NotificationList" component={NotificationListScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="AttendanceDetail" component={AttendanceDetailScreen} options={{ title: 'Attendance log' }} />
        <Stack.Screen name="DailyReports" component={DailyReportsScreen} options={{ title: 'Daily reports' }} />
        <Stack.Screen name="DelayAlerts" component={DelayAlertsScreen} options={{ title: 'Delay alerts' }} />
        
        {/* Module 4 - Parent & Student */}
        <Stack.Screen name="ParentStudentDashboard" component={ParentStudentDashboard} options={{ title: 'Parent & Student' }} />
        <Stack.Screen name="ParentList" component={ParentListScreen} options={{ title: 'Parents' }} />
        <Stack.Screen name="ParentForm" component={ParentFormScreen} options={{ title: 'Parent Details' }} />
        <Stack.Screen name="StudentList" component={StudentListScreen} options={{ title: 'Students' }} />
        <Stack.Screen name="StudentForm" component={StudentFormScreen} options={{ title: 'Student Details' }} />
        
        {/* Module 5 - Billing */}
        <Stack.Screen name="BillingDashboard" component={BillingDashboard} options={{ title: 'Billing & Payment' }} />
        <Stack.Screen name="BillingList" component={BillingListScreen} options={{ title: 'Bills' }} />
        <Stack.Screen name="BillingForm" component={BillingFormScreen} options={{ title: 'Bill Details' }} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} options={{ title: 'Payment History' }} />
        
        {/* Module 6 - Driver & Vehicle */}
        <Stack.Screen name="DriverVehicleDashboard" component={DriverVehicleDashboard} options={{ title: 'Driver & Vehicle' }} />
        <Stack.Screen name="DriverList" component={DriverListScreen} options={{ title: 'Drivers' }} />
        <Stack.Screen name="DriverForm" component={DriverFormScreen} options={{ title: 'Driver Details' }} />
        <Stack.Screen name="VehicleList" component={VehicleListScreen} options={{ title: 'Vehicles' }} />
        <Stack.Screen name="VehicleForm" component={VehicleFormScreen} options={{ title: 'Vehicle Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
