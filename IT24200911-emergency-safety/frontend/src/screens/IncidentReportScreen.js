import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';

export default function IncidentReportScreen() {
  const [incidents, setIncidents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    vanId: '',
    driverId: '',
    type: 'Breakdown',
    severity: 'Medium',
    description: ''
  });

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await axios.get(`${API_URL}/incidents`);
      setIncidents(response.data.data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const createIncident = async () => {
    try {
      await axios.post(`${API_URL}/incidents`, formData);
      setModalVisible(false);
      setFormData({ vanId: '', driverId: '', type: 'Breakdown', severity: 'Medium', description: '' });
      fetchIncidents();
    } catch (error) {
      console.error('Error creating incident:', error);
    }
  };

  const renderIncident = ({ item }) => (
    <View style={styles.incidentCard}>
      <View style={styles.header}>
        <Text style={styles.incidentId}>{item.incidentId}</Text>
        <Text style={[styles.severity, styles[`severity${item.severity}`]]}>
          {item.severity}
        </Text>
      </View>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.info}>Van: {item.vanId} | Driver: {item.driverId}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Report New Incident</Text>
      </TouchableOpacity>

      <FlatList
        data={incidents}
        renderItem={renderIncident}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Incident</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Van ID"
              value={formData.vanId}
              onChangeText={(text) => setFormData({ ...formData, vanId: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Driver ID"
              value={formData.driverId}
              onChangeText={(text) => setFormData({ ...formData, driverId: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={createIncident}>
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  incidentCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  incidentId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  severity: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#fff',
  },
  severityLow: { backgroundColor: '#34C759' },
  severityMedium: { backgroundColor: '#FF9500' },
  severityHigh: { backgroundColor: '#FF3B30' },
  severityCritical: { backgroundColor: '#8B0000' },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  info: {
    fontSize: 12,
    color: '#999',
  },
  status: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 5,
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#999',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
