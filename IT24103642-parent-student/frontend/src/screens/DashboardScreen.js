import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/stats/summary`);
      const d = data?.data;
      setStats({
        totalParents: Number(d?.totalParents) || 0,
        totalStudents: Number(d?.totalStudents) || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({ totalParents: 0, totalStudents: 0 });
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
      <Text style={styles.title}>Parent & Student Management</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.totalParents ?? 0}</Text>
          <Text style={styles.statLabel}>Total Parents</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.totalStudents ?? 0}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('ParentList')}
        >
          <Text style={styles.menuButtonText}>Manage Parents</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('StudentList')}
        >
          <Text style={styles.menuButtonText}>Manage Students</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('ParentForm', { mode: 'add' })}
        >
          <Text style={styles.menuButtonText}>Add New Parent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#9C27B0' }]}
          onPress={() => navigation.navigate('StudentForm', { mode: 'add' })}
        >
          <Text style={styles.menuButtonText}>Add New Student</Text>
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
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '48%',
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
