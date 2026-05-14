import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function BillingFormScreen({ route, navigation }) {
  const { mode, bill } = route.params;
  const [formData, setFormData] = useState({
    parent_id: bill?.parent_id ?? bill?.parentId ?? '',
    student_id: bill?.student_id ?? bill?.studentId ?? '1',
    amount: bill?.amount ?? bill?.calculatedFee ?? bill?.baseFee ?? '',
    due_date: bill?.due_date ?? bill?.dueDate ?? '',
    billing_period: bill?.billing_period ?? (bill?.month && bill?.year != null ? `${bill.month} ${bill.year}` : ''),
    payment_status: bill?.payment_status ?? (bill?.status ? String(bill.status).toLowerCase() : 'pending'),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.parent_id || !formData.amount || !formData.due_date) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        parent_id: formData.parent_id,
        student_id: formData.student_id,
        amount: formData.amount,
        due_date: formData.due_date,
        billing_period: formData.billing_period,
        payment_status: formData.payment_status,
      };
      if (mode === 'add') {
        await axios.post(`${API_URL}/billing`, payload);
        Alert.alert('Success', 'Bill created successfully');
      } else if (mode === 'edit') {
        await axios.put(`${API_URL}/billing/${bill.id}`, payload);
        Alert.alert('Success', 'Bill updated successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving bill:', error);
      Alert.alert('Error', 'Failed to save bill');
    } finally {
      setLoading(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Parent ID *</Text>
        <TextInput
          style={styles.input}
          value={String(formData.parent_id)}
          onChangeText={(text) => setFormData({ ...formData, parent_id: text })}
          placeholder="Enter parent ID"
          keyboardType="numeric"
          editable={!isViewMode}
        />

        <Text style={styles.label}>Student ID</Text>
        <TextInput
          style={styles.input}
          value={String(formData.student_id)}
          onChangeText={(text) => setFormData({ ...formData, student_id: text })}
          placeholder="Numeric student record id (default 1)"
          keyboardType="numeric"
          editable={!isViewMode}
        />

        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text })}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          editable={!isViewMode}
        />

        <Text style={styles.label}>Due Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={formData.due_date}
          onChangeText={(text) => setFormData({ ...formData, due_date: text })}
          placeholder="YYYY-MM-DD"
          editable={!isViewMode}
        />

        <Text style={styles.label}>Billing Period</Text>
        <TextInput
          style={styles.input}
          value={formData.billing_period}
          onChangeText={(text) => setFormData({ ...formData, billing_period: text })}
          placeholder="e.g., January 2024"
          editable={!isViewMode}
        />

        <Text style={styles.label}>Payment Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.payment_status === 'pending' && styles.statusButtonActive,
              isViewMode && styles.statusButtonDisabled
            ]}
            onPress={() => !isViewMode && setFormData({ ...formData, payment_status: 'pending' })}
            disabled={isViewMode}
          >
            <Text style={[
              styles.statusButtonText,
              formData.payment_status === 'pending' && styles.statusButtonTextActive
            ]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.payment_status === 'paid' && styles.statusButtonActive,
              isViewMode && styles.statusButtonDisabled
            ]}
            onPress={() => !isViewMode && setFormData({ ...formData, payment_status: 'paid' })}
            disabled={isViewMode}
          >
            <Text style={[
              styles.statusButtonText,
              formData.payment_status === 'paid' && styles.statusButtonTextActive
            ]}>Paid</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.statusButton,
              formData.payment_status === 'overdue' && styles.statusButtonActive,
              isViewMode && styles.statusButtonDisabled
            ]}
            onPress={() => !isViewMode && setFormData({ ...formData, payment_status: 'overdue' })}
            disabled={isViewMode}
          >
            <Text style={[
              styles.statusButtonText,
              formData.payment_status === 'overdue' && styles.statusButtonTextActive
            ]}>Overdue</Text>
          </TouchableOpacity>
        </View>

        {!isViewMode && (
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving...' : mode === 'add' ? 'Create Bill' : 'Update Bill'}
            </Text>
          </TouchableOpacity>
        )}
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
  statusButtonDisabled: {
    opacity: 0.6,
  },
  statusButtonText: {
    fontSize: 14,
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
