import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { DRIVER_VEHICLE_API_URL as API_URL } from '../../config/api';

export default function DriverListScreen({ navigation }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDrivers();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchDrivers();
    }, [])
  );

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_URL}/drivers`);
      setDrivers(response.data.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDrivers();
  };

  const deleteDriver = async (id) => {
    Alert.alert(
      'Delete Driver',
      'Are you sure you want to delete this driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/drivers/${id}`);
              fetchDrivers();
            } catch (error) {
              console.error('Error deleting driver:', error);
              Alert.alert('Error', 'Failed to delete driver');
            }
          },
        },
      ]
    );
  };

  const getDisplayName = (item) => {
    if (item?.name) return String(item.name);
    const first = String(item?.firstName || '').trim();
    const last = String(item?.lastName || '').trim();
    const full = `${first} ${last}`.trim();
    return full || 'Unnamed Driver';
  };

  const getStatusLabel = (item) => String(item?.status || 'Inactive');

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{getDisplayName(item)}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: String(item.status).toLowerCase() === 'active' ? '#4CAF50' : '#999' }
        ]}>
          <Text style={styles.statusText}>{getStatusLabel(item).toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>License: {item.licenseNumber || item.license_number}</Text>
      <Text style={styles.cardText}>Phone: {item.phone}</Text>
      {item.assignedVanId || item.vehicle_id ? (
        <Text style={styles.cardText}>Assigned Vehicle: {item.assignedVanId || item.vehicle_id}</Text>
      ) : null}
      {item.performanceScore != null ? (
        <Text style={styles.cardText}>Performance: {item.performanceScore}</Text>
      ) : null}
      {item.violationCount != null ? (
        <Text style={styles.cardText}>Violations: {item.violationCount}</Text>
      ) : null}
      {item.email ? (
        <Text style={styles.cardText}>Email: {item.email}</Text>
      ) : null}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('DriverForm', { mode: 'edit', driver: item })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteDriver(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('DriverForm', { mode: 'add' })}
      >
        <Text style={styles.addButtonText}>+ Add New Driver</Text>
      </TouchableOpacity>
      <FlatList
        data={drivers}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${String(item.id ?? item.driverId ?? 'driver')}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No drivers found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
