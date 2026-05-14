import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { DRIVER_VEHICLE_API_URL as API_URL } from '../../config/api';

export default function VehicleFormScreen({ route, navigation }) {
  const { mode, vehicle } = route.params;
  const normalizedStatus = String(vehicle?.status || 'Active').toLowerCase() === 'active' ? 'Active' : 'Inactive';
  const [formData, setFormData] = useState({
    vehicle_number: vehicle?.registrationNumber || vehicle?.vehicle_number || '',
    van_id: vehicle?.vanId || '',
    model: vehicle?.model || '',
    capacity: vehicle?.capacity || '',
    status: normalizedStatus,
    maintenance_date: vehicle?.lastServiceDate || vehicle?.maintenance_date || '',
    assigned_driver_id: vehicle?.assignedDriverId || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.van_id || !formData.vehicle_number || !formData.model || !formData.capacity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        vanId: formData.van_id.trim(),
        registrationNumber: formData.vehicle_number.trim(),
        model: formData.model.trim(),
        capacity: Number(formData.capacity),
        status: formData.status,
        lastServiceDate: formData.maintenance_date?.trim() ? formData.maintenance_date.trim() : null,
        assignedDriverId: formData.assigned_driver_id?.trim() || null,
      };

      if (Number.isNaN(payload.capacity)) {
        Alert.alert('Error', 'Capacity must be a valid number');
        return;
      }

      if (mode === 'add') {
        await axios.post(`${API_URL}/vehicles`, payload);
        Alert.alert('Success', 'Vehicle added successfully');
      } else {
        await axios.put(`${API_URL}/vehicles/${vehicle.id}`, payload);
        Alert.alert('Success', 'Vehicle updated successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving vehicle:', error);
      Alert.alert('Error', 'Failed to save vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Vehicle Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.vehicle_number}
          onChangeText={(text) => setFormData({ ...formData, vehicle_number: text })}
          placeholder="Enter vehicle number (e.g., ABC-1234)"
        />

        <Text style={styles.label}>Van ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.van_id}
          onChangeText={(text) => setFormData({ ...formData, van_id: text })}
          placeholder="Enter van ID (e.g., VAN001)"
        />

        <Text style={styles.label}>Model *</Text>
        <TextInput
          style={styles.input}
          value={formData.model}
          onChangeText={(text) => setFormData({ ...formData, model: text })}
          placeholder="Enter vehicle model"
        />

        <Text style={styles.label}>Capacity (Seats) *</Text>
        <TextInput
          style={styles.input}
          value={formData.capacity}
          onChangeText={(text) => setFormData({ ...formData, capacity: text })}
          placeholder="Enter seating capacity"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Last Maintenance Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={formData.maintenance_date}
          onChangeText={(text) => setFormData({ ...formData, maintenance_date: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Assigned Driver ID (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.assigned_driver_id}
          onChangeText={(text) => setFormData({ ...formData, assigned_driver_id: text })}
          placeholder="Enter driver ID"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'Active' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, status: 'Active' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'Active' && styles.statusButtonTextActive
            ]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'Inactive' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, status: 'Inactive' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'Inactive' && styles.statusButtonTextActive
            ]}>Inactive</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add Vehicle' : 'Update Vehicle'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statusButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF50',
  },
  statusButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  statusButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
