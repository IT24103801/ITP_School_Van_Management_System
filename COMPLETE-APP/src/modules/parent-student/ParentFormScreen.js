import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { PARENT_STUDENT_API_URL as API_URL } from '../../config/api';

export default function ParentFormScreen({ route, navigation }) {
  const { mode, parent } = route.params;
  const existingName = String(parent?.name || `${parent?.firstName || ''} ${parent?.lastName || ''}` || '').trim();
  const [formData, setFormData] = useState({
    name: existingName,
    email: parent?.email || '',
    phone: parent?.phone || '',
    address: parent?.address || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const nameParts = String(formData.name || '').trim().split(/\s+/).filter(Boolean);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '-';
      const payload = {
        firstName,
        lastName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address?.trim() || null,
      };

      if (mode === 'add') {
        if (!formData.password) {
          Alert.alert('Error', 'Password is required when adding a parent');
          return;
        }
        payload.password = formData.password;
      } else if (formData.password) {
        payload.password = formData.password;
      }

      if (mode === 'add') {
        await axios.post(`${API_URL}/parents`, payload);
        Alert.alert('Success', 'Parent added successfully');
      } else {
        await axios.put(`${API_URL}/parents/${parent.id}`, payload);
        Alert.alert('Success', 'Parent updated successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving parent:', error);
      Alert.alert('Error', 'Failed to save parent');
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
          placeholder="Enter parent name"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Phone *</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
          placeholder="Enter address"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>{mode === 'add' ? 'Password *' : 'Password (Optional)'}</Text>
        <TextInput
          style={styles.input}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder={mode === 'add' ? 'Set account password' : 'Leave blank to keep current password'}
          secureTextEntry
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : mode === 'add' ? 'Add Parent' : 'Update Parent'}
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
    height: 80,
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
