import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { PARENT_STUDENT_API_URL as API_URL } from '../../config/api';

export default function StudentFormScreen({ route, navigation }) {
  const { mode, student } = route.params;
  const existingName = String(student?.name || `${student?.firstName || ''} ${student?.lastName || ''}` || '').trim();
  const [formData, setFormData] = useState({
    name: existingName,
    student_id: student?.studentId || '',
    grade: student?.grade || '',
    van_id: student?.assignedVanId || '',
    route_id: student?.assignedRouteId == null ? '' : String(student.assignedRouteId),
    pickup_address: student?.pickupAddress || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.grade || !formData.student_id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const nameParts = String(formData.name || '').trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '-';
      const payload = {
        studentId: formData.student_id.trim(),
        firstName,
        lastName,
        grade: formData.grade.trim(),
        assignedVanId: formData.van_id?.trim() || null,
        assignedRouteId: formData.route_id?.trim() ? Number(formData.route_id) : null,
        pickupAddress: formData.pickup_address?.trim() || null,
      };

      if (payload.assignedRouteId != null && Number.isNaN(payload.assignedRouteId)) {
        Alert.alert('Error', 'Route ID must be a valid number');
        return;
      }

      if (mode === 'add') {
        await axios.post(`${API_URL}/students`, payload);
        Alert.alert('Success', 'Student added successfully');
      } else {
        await axios.put(`${API_URL}/students/${student.id}`, payload);
        Alert.alert('Success', 'Student updated successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving student:', error);
      Alert.alert('Error', 'Failed to save student');
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
          placeholder="Enter student name"
        />

        <Text style={styles.label}>Grade *</Text>
        <TextInput
          style={styles.input}
          value={formData.grade}
          onChangeText={(text) => setFormData({ ...formData, grade: text })}
          placeholder="Enter grade"
        />

        <Text style={styles.label}>Student ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.student_id}
          onChangeText={(text) => setFormData({ ...formData, student_id: text })}
          placeholder="Enter student ID"
        />

        <Text style={styles.label}>Assigned Van ID</Text>
        <TextInput
          style={styles.input}
          value={formData.van_id}
          onChangeText={(text) => setFormData({ ...formData, van_id: text })}
          placeholder="Enter assigned van ID"
        />

        <Text style={styles.label}>Assigned Route DB ID</Text>
        <TextInput
          style={styles.input}
          value={formData.route_id}
          onChangeText={(text) => setFormData({ ...formData, route_id: text })}
          placeholder="Enter route DB ID"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Pickup Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.pickup_address}
          onChangeText={(text) => setFormData({ ...formData, pickup_address: text })}
          placeholder="Enter pickup address"
          multiline
          numberOfLines={3}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add Student' : 'Update Student'}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
