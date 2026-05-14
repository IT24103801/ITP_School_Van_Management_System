import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import axios from 'axios';
import { EMERGENCY_API_URL as API_URL } from '../../config/api';

export default function BroadcastAlertScreen() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'General',
    priority: 'Medium',
    targetAudience: 'All Parents',
    createdBy: 'Admin'
  });

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      const response = await axios.get(`${API_URL}/broadcasts`);
      setBroadcasts(response.data.data);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
    }
  };

  const sendBroadcast = async () => {
    if (!formData.title || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await axios.post(`${API_URL}/broadcasts`, formData);
      Alert.alert('Success', 'Broadcast sent successfully');
      setModalVisible(false);
      setFormData({ title: '', message: '', type: 'General', priority: 'Medium', targetAudience: 'All Parents', createdBy: 'Admin' });
      fetchBroadcasts();
    } catch (error) {
      Alert.alert('Error', 'Failed to send broadcast');
    }
  };

  const renderBroadcast = ({ item }) => (
    <View style={styles.broadcastCard}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={[styles.priority, styles[`priority${item.priority}`]]}>
          {item.priority}
        </Text>
      </View>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.audience}>To: {item.targetAudience}</Text>
      <Text style={styles.time}>{new Date(item.sentAt || item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.sendButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.sendButtonText}>📢 Send Broadcast Alert</Text>
      </TouchableOpacity>

      <FlatList
        data={broadcasts}
        renderItem={renderBroadcast}
        keyExtractor={(item, index) => `${String(item.id ?? item.alertId ?? 'broadcast')}-${index}`}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Send Broadcast Alert</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Alert Title"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Message"
              value={formData.message}
              onChangeText={(text) => setFormData({ ...formData, message: text })}
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={sendBroadcast}>
                <Text style={styles.buttonText}>Send</Text>
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
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  broadcastCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priority: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    color: '#fff',
  },
  priorityHigh: { backgroundColor: '#FF3B30' },
  priorityMedium: { backgroundColor: '#FF9500' },
  priorityLow: { backgroundColor: '#34C759' },
  type: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  audience: {
    fontSize: 12,
    color: '#666',
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
    backgroundColor: '#007AFF',
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
