import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { BILLING_API_URL as API_URL } from '../../config/api';

export default function BillingListScreen({ navigation }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBills();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchBills();
    }, [])
  );

  const fetchBills = async () => {
    try {
      const response = await axios.get(`${API_URL}/billing`);
      setBills(response.data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBills();
  };

  const sendInvoice = async (id) => {
    try {
      await axios.post(`${API_URL}/billing/${id}/send-invoice`);
      Alert.alert('Success', 'Invoice sent via email');
    } catch (error) {
      console.error('Error sending invoice:', error);
      Alert.alert('Error', 'Failed to send invoice');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.billNumber}>Bill #{item.id}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: 
            (item.payment_status === 'paid' || item.status === 'Paid') ? '#4CAF50' :
            (item.payment_status === 'pending' || item.status === 'Pending') ? '#FF9800' : '#F44336'
          }
        ]}>
          <Text style={styles.statusText}>{String(item.payment_status || item.status || '').toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>Parent ID: {item.parent_id ?? item.parentId}</Text>
      <Text style={styles.cardText}>Amount: ${item.amount ?? item.calculatedFee ?? item.baseFee ?? '—'}</Text>
      <Text style={styles.cardText}>Due Date: {(item.due_date || item.dueDate) ? new Date(item.due_date || item.dueDate).toLocaleDateString() : '—'}</Text>
      <Text style={styles.cardText}>Period: {item.billing_period ?? (item.month && item.year != null ? `${item.month} ${item.year}` : '—')}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={() => navigation.navigate('BillingForm', { mode: 'view', bill: item })}
        >
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.invoiceButton]}
          onPress={() => sendInvoice(item.id)}
        >
          <Text style={styles.buttonText}>Send Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BillingForm', { mode: 'add' })}
      >
        <Text style={styles.addButtonText}>+ Create New Bill</Text>
      </TouchableOpacity>
      <FlatList
        data={bills}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${String(item.id ?? item.billId ?? 'bill')}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No billing records found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#2196F3',
  },
  invoiceButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
