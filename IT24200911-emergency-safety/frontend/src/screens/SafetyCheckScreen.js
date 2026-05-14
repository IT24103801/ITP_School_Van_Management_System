import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Switch } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function SafetyCheckScreen() {
  const [checks, setChecks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkItems, setCheckItems] = useState({
    brakes: false,
    tires: false,
    lights: false,
    fuel: false,
    firstAidKit: false,
    fireExtinguisher: false
  });

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    try {
      const response = await axios.get(`${API_URL}/safety-checks`);
      setChecks(response.data.data);
    } catch (error) {
      console.error('Error fetching safety checks:', error);
    }
  };

  const submitCheck = async () => {
    const passedItems = Object.values(checkItems).filter(v => v).length;
    const overallStatus = passedItems === 6 ? 'Pass' : passedItems >= 4 ? 'Needs Attention' : 'Fail';

    try {
      await axios.post(`${API_URL}/safety-checks`, {
        vanId: 'VAN-001',
        driverId: 'DRV-001',
        checkItems,
        overallStatus
      });
      setModalVisible(false);
      setCheckItems({ brakes: false, tires: false, lights: false, fuel: false, firstAidKit: false, fireExtinguisher: false });
      fetchChecks();
    } catch (error) {
      console.error('Error submitting check:', error);
    }
  };

  const renderCheck = ({ item }) => (
    <View style={styles.checkCard}>
      <View style={styles.header}>
        <Text style={styles.checkId}>{item.checkId}</Text>
        <Text style={[styles.status, styles[`status${item.overallStatus.replace(' ', '')}`]]}>
          {item.overallStatus}
        </Text>
      </View>
      <Text style={styles.info}>Van: {item.vanId} | Driver: {item.driverId}</Text>
      <View style={styles.itemsGrid}>
        {Object.entries(item.checkItems).map(([key, value]) => (
          <Text key={key} style={styles.item}>
            {value ? '✅' : '❌'} {key}
          </Text>
        ))}
      </View>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ New Safety Check</Text>
      </TouchableOpacity>

      <FlatList
        data={checks}
        renderItem={renderCheck}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Safety Check</Text>
          {Object.entries(checkItems).map(([key, value]) => (
            <View key={key} style={styles.checkRow}>
              <Text style={styles.checkLabel}>{key}</Text>
              <Switch value={value} onValueChange={(v) => setCheckItems({...checkItems, [key]: v})} />
            </View>
          ))}
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={submitCheck}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  addButton: { backgroundColor: '#34C759', padding: 15, margin: 10, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  list: { padding: 10 },
  checkCard: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  checkId: { fontSize: 16, fontWeight: 'bold' },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, color: '#fff' },
  statusPass: { backgroundColor: '#34C759' },
  statusNeedsAttention: { backgroundColor: '#FF9500' },
  statusFail: { backgroundColor: '#FF3B30' },
  info: { fontSize: 14, color: '#666', marginBottom: 10 },
  itemsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { fontSize: 12, marginRight: 15, marginBottom: 5 },
  time: { fontSize: 12, color: '#999', marginTop: 10 },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  checkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  checkLabel: { fontSize: 16 },
  modalButtons: { flexDirection: 'row', marginTop: 20 },
  cancelButton: { backgroundColor: '#999', padding: 15, borderRadius: 5, flex: 1, marginRight: 5, alignItems: 'center' },
  submitButton: { backgroundColor: '#34C759', padding: 15, borderRadius: 5, flex: 1, marginLeft: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
