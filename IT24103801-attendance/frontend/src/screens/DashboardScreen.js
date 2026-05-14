import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { ATTENDANCE_API_URL as API_URL } from '../config/attendanceApi';

function normalizeStats(payload) {
  if (!payload || typeof payload !== 'object') return null;
  return {
    totalRecords: Number(payload.totalRecords) || 0,
    presentToday: Number(payload.presentToday) || 0,
    absentToday: Number(payload.absentToday) || 0,
    notifications: Number(payload.notifications) || 0,
    dateLabel: payload.dateLabel,
  };
}

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/attendance/stats`);
      setStats(normalizeStats(response.data?.data));
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(normalizeStats(null));
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStats();
    }, [fetchStats])
  );

  if (loading && stats == null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Attendance & Notifications Dashboard</Text>
      {stats?.dateLabel ? (
        <Text style={styles.subtitle}>Counts for {stats.dateLabel} (server local date)</Text>
      ) : null}

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.totalRecords ?? 0}</Text>
          <Text style={styles.statLabel}>Total Records</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.presentToday ?? 0}</Text>
          <Text style={styles.statLabel}>Present Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.absentToday ?? 0}</Text>
          <Text style={styles.statLabel}>Absent Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.notifications ?? 0}</Text>
          <Text style={styles.statLabel}>Pending alerts</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('MarkAttendance')}
        >
          <Text style={styles.menuButtonText}>Mark Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('AttendanceList')}
        >
          <Text style={styles.menuButtonText}>View Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('NotificationList')}
        >
          <Text style={styles.menuButtonText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#9C27B0' }]}
          onPress={() => navigation.navigate('DailyReports')}
        >
          <Text style={styles.menuButtonText}>Daily reports</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#795548' }]}
          onPress={() => navigation.navigate('DelayAlerts')}
        >
          <Text style={styles.menuButtonText}>Delay alerts</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '48%',
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuButton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
