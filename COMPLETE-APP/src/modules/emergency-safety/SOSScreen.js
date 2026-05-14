import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';
import axios from 'axios';
import { EMERGENCY_API_URL as API_URL } from '../../config/api';

export default function SOSScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`${API_URL}/sos`);
      setAlerts(response.data.data);
    } catch (error) {
      console.error('Error fetching SOS alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSOS = async () => {
    Alert.alert(
      'Trigger SOS Alert',
      'Are you sure you want to send an emergency alert?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'SEND SOS',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.post(`${API_URL}/sos`, {
                vanId: 'VAN-001',
                driverId: 'DRV-001',
                routeId: 'ROUTE-001',
                description: 'Emergency situation',
                location: { latitude: 6.9271, longitude: 79.8612 }
              });
              Alert.alert('Success', 'SOS Alert sent successfully');
              fetchAlerts();
            } catch (error) {
              Alert.alert('Error', 'Failed to send SOS alert');
            }
          }
        }
      ]
    );
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/sos/${id}`, { status });
      fetchAlerts();
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const renderAlert = ({ item }) => {
    const status = item.status || 'Reported';
    const statusKey = status.toLowerCase().replace(/\s+/g, '');
    const lat =
      item.latitude != null
        ? Number(item.latitude)
        : item.location?.latitude != null
          ? Number(item.location.latitude)
          : null;
    const lng =
      item.longitude != null
        ? Number(item.longitude)
        : item.location?.longitude != null
          ? Number(item.location.longitude)
          : null;
    const created = item.createdAt || item.created_at;
    const rowId = item.id;

    return (
    <View style={[styles.alertCard, styles[statusKey] || {}]}>
      <View style={styles.alertHeader}>
        <Text style={styles.alertId}>{item.alertId}</Text>
        <Text style={[styles.status, styles[`status${status.replace(/\s+/g, '')}`] || {}]}>
          {status}
        </Text>
      </View>
      <Text style={styles.info}>Van: {item.vanId}</Text>
      <Text style={styles.info}>Driver: {item.driverId}</Text>
      <Text style={styles.info}>Route: {item.routeId}</Text>
      {lat != null && !Number.isNaN(lat) && lng != null && !Number.isNaN(lng) && (
        <Text style={styles.location}>
          📍 {lat.toFixed(4)}, {lng.toFixed(4)}
        </Text>
      )}
      <Text style={styles.time}>{created ? new Date(created).toLocaleString() : ''}</Text>
      
      {status !== 'Resolved' && (
        <View style={styles.actions}>
          {status === 'Reported' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => updateStatus(rowId, 'In Progress')}
            >
              <Text style={styles.actionText}>Mark In Progress</Text>
            </TouchableOpacity>
          )}
          {status === 'In Progress' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.resolveButton]}
              onPress={() => updateStatus(rowId, 'Resolved')}
            >
              <Text style={styles.actionText}>Mark Resolved</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sosButtonContainer}>
        <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
          <Text style={styles.sosButtonText}>🚨 TRIGGER SOS</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loading}>Loading alerts...</Text>
      ) : (
        <FlatList
          data={alerts}
          renderItem={renderAlert}
          keyExtractor={(item, index) => `${String(item.id ?? item.alertId ?? 'sos')}-${index}`}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sosButtonContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  sosButton: {
    backgroundColor: '#FF3B30',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  sosButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 5,
    elevation: 2,
  },
  reported: {
    borderLeftColor: '#FF3B30',
  },
  inprogress: {
    borderLeftColor: '#FF9500',
  },
  resolved: {
    borderLeftColor: '#34C759',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  alertId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  statusReported: {
    backgroundColor: '#FF3B30',
    color: '#fff',
  },
  statusInProgress: {
    backgroundColor: '#FF9500',
    color: '#fff',
  },
  statusResolved: {
    backgroundColor: '#34C759',
    color: '#fff',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  resolveButton: {
    backgroundColor: '#34C759',
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
