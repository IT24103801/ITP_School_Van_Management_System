import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function MainMenuScreen({ navigation }) {
  const modules = [
    {
      id: 1,
      title: 'Route & Schedule',
      subtitle: 'IT23224902 - E. D. A. Silva',
      color: '#4CAF50',
      icon: '🚌',
      screen: 'RouteList'
    },
    {
      id: 2,
      title: 'Emergency & Safety',
      subtitle: 'IT24200911 - Laksahan L.C',
      color: '#F44336',
      icon: '🚨',
      screen: 'EmergencyDashboard'
    },
    {
      id: 3,
      title: 'Attendance & Notifications',
      subtitle: 'IT24103801 - Siriwardana B. H. R. Y',
      color: '#2196F3',
      icon: '📋',
      screen: 'AttendanceDashboard'
    },
    {
      id: 4,
      title: 'Parent & Student',
      subtitle: 'IT24103642 - De Silva P.H.V.B',
      color: '#9C27B0',
      icon: '👨‍👩‍👧‍👦',
      screen: 'ParentStudentDashboard'
    },
    {
      id: 5,
      title: 'Billing & Payment',
      subtitle: 'IT24104170 - Priyankara K.P.C',
      color: '#FF9800',
      icon: '💰',
      screen: 'BillingDashboard'
    },
    {
      id: 6,
      title: 'Driver & Vehicle',
      subtitle: 'IT24102655 - Minsara P.G.S',
      color: '#00BCD4',
      icon: '🚗',
      screen: 'DriverVehicleDashboard'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚐 School Van Management System</Text>
        <Text style={styles.headerSubtitle}>Complete Integrated Solution</Text>
      </View>

      <View style={styles.modulesContainer}>
        {modules.map((module) => (
          <TouchableOpacity
            key={module.id}
            style={[styles.moduleCard, { borderLeftColor: module.color, borderLeftWidth: 6 }]}
            onPress={() => navigation.navigate(module.screen)}
          >
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleIcon}>{module.icon}</Text>
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
              </View>
            </View>
            <View style={[styles.moduleBadge, { backgroundColor: module.color }]}>
              <Text style={styles.moduleBadgeText}>Module {module.id}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>6 Modules • 28 Screens • Complete System</Text>
        <Text style={styles.footerSubtext}>Tap any module to explore</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
  },
  modulesContainer: {
    padding: 15,
  },
  moduleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  moduleSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  moduleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  moduleBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#999',
  },
});
