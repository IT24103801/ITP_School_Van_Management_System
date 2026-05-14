import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { DRIVER_VEHICLE_API_URL as API_URL } from '../../config/api';

export default function DriverFormScreen({ route, navigation }) {
  const { mode, driver } = route.params;
  const existingName = String(driver?.name || `${driver?.firstName || ''} ${driver?.lastName || ''}` || '').trim();
  const normalizedStatus = String(driver?.status || 'Active').toLowerCase() === 'active' ? 'Active' : 'Inactive';
  const [formData, setFormData] = useState({
    name: existingName,
    license_number: driver?.licenseNumber || driver?.license_number || '',
    phone: driver?.phone || '',
    status: normalizedStatus,
    vehicle_id: driver?.assignedVanId || driver?.vehicle_id || '',
    email: driver?.email || '',
    driver_id: driver?.driverId || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.license_number || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const nameParts = String(formData.name || '').trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '-';
      const payload = {
        driverId: formData.driver_id?.trim() || driver?.driverId,
        firstName,
        lastName,
        licenseNumber: formData.license_number?.trim(),
        phone: formData.phone?.trim(),
        assignedVanId: formData.vehicle_id?.trim() || null,
        email: formData.email?.trim() || null,
        status: formData.status,
      };

      if (!payload.driverId) {
        Alert.alert('Error', 'Driver ID is required');
        return;
      }

      if (mode === 'add') {
        await axios.post(`${API_URL}/drivers`, payload);
        Alert.alert('Success', 'Driver added successfully');
      } else {
        await axios.put(`${API_URL}/drivers/${driver.id}`, payload);
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

        <Text style={styles.label}>Driver ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.driver_id}
          onChangeText={(text) => setFormData({ ...formData, driver_id: text })}
          placeholder="Enter driver ID (e.g. DRV001)"
        />

        <Text style={styles.label}>Vehicle ID (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.vehicle_id}
          onChangeText={(text) => setFormData({ ...formData, vehicle_id: text })}
          placeholder="Assign vehicle ID"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Email (Optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
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
