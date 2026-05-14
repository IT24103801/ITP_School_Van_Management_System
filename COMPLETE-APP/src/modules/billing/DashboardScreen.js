import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BILLING_API_URL as API_URL } from '../../config/api';

function normalizeBillingStats(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    totalRevenue: Number(raw.totalRevenue) || 0,
    paidBills: Number(raw.paidBills) || 0,
    pendingBills: Number(raw.pendingBills) || 0,
    overdue: Number(raw.overdue) || 0,
  };
}

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/billing/stats`);
      setStats(normalizeBillingStats(response.data?.data));
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(normalizeBillingStats(null));
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
      <Text style={styles.title}>Billing & Payment Dashboard</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${(stats?.totalRevenue ?? 0).toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.paidBills ?? 0}</Text>
          <Text style={styles.statLabel}>Paid Bills</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats?.pendingBills ?? 0}</Text>
          <Text style={styles.statLabel}>Pending Bills</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${(stats?.overdue ?? 0).toFixed(2)}</Text>
          <Text style={styles.statLabel}>Overdue Amount</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('BillingList')}
        >
          <Text style={styles.menuButtonText}>View All Bills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('BillingForm', { mode: 'add' })}
        >
          <Text style={styles.menuButtonText}>Create New Bill</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('PaymentHistory')}
        >
          <Text style={styles.menuButtonText}>Payment History</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
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
