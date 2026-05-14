import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../config/api';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState({
    activeAlerts: 0,
    openIncidents: 0,
    todayChecks: 0,
    dateLabel: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/stats/dashboard`);
      const d = data?.data;
      setStats({
        activeAlerts: Number(d?.activeSos) || 0,
        openIncidents: Number(d?.openIncidents) || 0,
        todayChecks: Number(d?.todayChecks) || 0,
        dateLabel: d?.dateLabel || null,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socket.on('sos-alert', (payload) => {
      const van = payload?.vanId ?? 'unknown';
      Alert.alert('🚨 SOS ALERT', `Emergency alert from Van ${van}`);
      fetchStats();
    });
    socket.on('sos-update', () => fetchStats());

    return () => socket.disconnect();
  }, [fetchStats]);

  const MenuButton = ({ title, color, onPress, count }) => (
    <TouchableOpacity style={[styles.menuButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.menuTitle}>{title}</Text>
      {count !== undefined && <Text style={styles.menuCount}>{count}</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency & Safety Dashboard</Text>
        <Text style={styles.headerSubtitle}>IT24200911 - Laksahan L.C</Text>
        {stats.dateLabel ? (
          <Text style={styles.dateHint}>Today&apos;s checks: {stats.dateLabel} (server)</Text>
        ) : null}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.activeAlerts}</Text>
          <Text style={styles.statLabel}>Active SOS Alerts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.openIncidents}</Text>
          <Text style={styles.statLabel}>Open Incidents</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.todayChecks}</Text>
          <Text style={styles.statLabel}>Today&apos;s Checks</Text>
        </View>
      </View>

      <View style={styles.menuGrid}>
        <MenuButton
          title="🚨 SOS Alerts"
          color="#FF3B30"
          count={stats.activeAlerts}
          onPress={() => navigation.navigate('SOS')}
        />
        <MenuButton
          title="📋 Incident Reports"
          color="#FF9500"
          count={stats.openIncidents}
          onPress={() => navigation.navigate('IncidentReport')}
        />
        <MenuButton
          title="📢 Broadcast Alerts"
          color="#007AFF"
          onPress={() => navigation.navigate('BroadcastAlert')}
        />
        <MenuButton
          title="✅ Safety Checks"
          color="#34C759"
          count={stats.todayChecks}
          onPress={() => navigation.navigate('SafetyCheck')}
        />
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
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  dateHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  menuGrid: {
    padding: 10,
  },
  menuButton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  menuCount: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
});
