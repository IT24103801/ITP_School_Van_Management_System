import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import axios from 'axios';
import { ATTENDANCE_API_URL as API_URL } from '../config/attendanceApi';

export default function MarkAttendanceScreen({ navigation }) {
  const [formData, setFormData] = useState({
    student_id: '',
    route_id: '',
    status: 'present',
    notes: '',
    eventType: 'Boarding',
    parentRecipientId: '',
  });
  const [notifyParent, setNotifyParent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.student_id || !formData.route_id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (notifyParent && !formData.parentRecipientId.trim()) {
      Alert.alert('Parent ID', 'Enter parent recipient ID to send alert, or turn off notify.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/attendance`, {
        ...formData,
        date: new Date().toISOString().split('T')[0],
        check_in_time: new Date().toLocaleTimeString(),
        eventType: formData.eventType,
        notifyParent,
        parentRecipientId: notifyParent ? Number(formData.parentRecipientId) : undefined,
      });
      Alert.alert('Success', 'Attendance marked successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error marking attendance:', error);
      Alert.alert('Error', 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Student ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.student_id}
          onChangeText={(text) => setFormData({ ...formData, student_id: text })}
          placeholder="Enter student ID"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Route ID *</Text>
        <TextInput
          style={styles.input}
          value={formData.route_id}
          onChangeText={(text) => setFormData({ ...formData, route_id: text })}
          placeholder="Enter route ID"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'present' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, status: 'present' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'present' && styles.statusButtonTextActive
            ]}>Present</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.status === 'absent' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, status: 'absent' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.status === 'absent' && styles.statusButtonTextActive
            ]}>Absent</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Boarding / exit</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.eventType === 'Boarding' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, eventType: 'Boarding' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.eventType === 'Boarding' && styles.statusButtonTextActive
            ]}>Boarding</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.eventType === 'Alighting' && styles.statusButtonActive
            ]}
            onPress={() => setFormData({ ...formData, eventType: 'Alighting' })}
          >
            <Text style={[
              styles.statusButtonText,
              formData.eventType === 'Alighting' && styles.statusButtonTextActive
            ]}>Exit van</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Notify parent (alert)</Text>
          <Switch value={notifyParent} onValueChange={setNotifyParent} />
        </View>
        {notifyParent ? (
          <>
            <Text style={styles.label}>Parent recipient ID</Text>
            <TextInput
              style={styles.input}
              value={formData.parentRecipientId}
              onChangeText={(text) => setFormData({ ...formData, parentRecipientId: text })}
              placeholder="Parent user ID"
              keyboardType="numeric"
            />
          </>
        ) : null}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          placeholder="Add any notes (optional)"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Marking...' : 'Mark Attendance'}
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
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
