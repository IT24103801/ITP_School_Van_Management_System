import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function DriverFormScreen({ route, navigation }) {
  const { mode, driver } = route.params;
  const [formData, setFormData] = useState({
    name: driver?.name || '',
    license_number: driver?.license_number || '',
    phone: driver?.phone || '',
    experience_years: driver?.experience_years || '',
    status: driver?.status || 'active',
    vehicle_id: driver?.vehicle_id || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.license_number || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'add') {
        await axios.post(`${API_URL}/drivers`, formData);
        Alert.alert('Success', 'Driver added successfully');
      } else {
        await axios.put(`${API_URL}/drivers/${driver.id}`, formData);
        Alert.alert('Success', 'Driver updated successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving driver:', error);
      Alert.alert('Error', 'Failed to save driver');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter driver name"
        />

        <Text style={styles.label}>License Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.license_number}
          onChangeText={(text) => setFormData({ ...formData, license_number: text })}
          placeholder="Enter license number"
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Experience (Years)</Text>
        <TextInput
          style={styles.input}
          value={formData.experience_years}
          onChangeText={(text) => setFormData({ ...formData, experience_years: text })}
          placeholder="Enter years of experience"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Vehicle ID (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.vehicle_id}
          onChangeText={(text) => setFormData({ ...formData, vehicle_id: text })}
          placeholder="Assign vehicle ID"
          keyboardType="numeric"
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
            {loading ? 'Saving...' : mode === 'add' ? 'Add Driver' : 'Update Driver'}
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
