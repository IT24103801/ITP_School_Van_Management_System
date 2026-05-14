import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function StudentFormScreen({ route, navigation }) {
  const { mode, student } = route.params;
  const [formData, setFormData] = useState({
    name: student?.name || '',
    grade: student?.grade || '',
    age: student?.age || '',
    parent_id: student?.parent_id || '',
    medical_info: student?.medical_info || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.grade || !formData.parent_id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'add') {
        await axios.post(`${API_URL}/students`, formData);
        Alert.alert('Success', 'Student added successfully');
      } else {
        await axios.put(`${API_URL}/students/${student.id}`, formData);
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

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          placeholder="Enter age"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Parent ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.parent_id}
          onChangeText={(text) => setFormData({ ...formData, parent_id: text })}
          placeholder="Enter parent ID"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Medical Information</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.medical_info}
          onChangeText={(text) => setFormData({ ...formData, medical_info: text })}
          placeholder="Enter medical information (allergies, conditions, etc.)"
          multiline
          numberOfLines={4}
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
