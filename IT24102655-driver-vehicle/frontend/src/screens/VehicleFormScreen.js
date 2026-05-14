import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function VehicleFormScreen({ route, navigation }) {
  const { mode, vehicle } = route.params;
  const [formData, setFormData] = useState({
    vehicle_number: vehicle?.vehicle_number || '',
    model: vehicle?.model || '',
    capacity: vehicle?.capacity || '',
    year: vehicle?.year || '',
    status: vehicle?.status || 'active',
    maintenance_date: vehicle?.maintenance_date || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.vehicle_number || !formData.model || !formData.capacity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'add') {
        await axios.post(`${API_URL}/vehicles`, formData);
        Alert.alert('Success', 'Vehicle added successfully');
      } else {
        await axios.put(`${API_URL}/vehicles/${vehicle.id}`, formData);
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

        <Text style={styles.label}>Year</Text>
        <TextInput
          style={styles.input}
          value={formData.year}
          onChangeText={(text) => setFormData({ ...formData, year: text })}
          placeholder="Enter manufacturing year"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Last Maintenance Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={formData.maintenance_date}
          onChangeText={(text) => setFormData({ ...formData, maintenance_date: text })}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'active' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, status: 'active' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'active' && styles.statusButtonTextActive
            ]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'inactive' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, status: 'inactive' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'inactive' && styles.statusButtonTextActive
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
