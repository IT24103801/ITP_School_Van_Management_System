import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { ATTENDANCE_API_URL as API_URL } from '../config/attendanceApi';

export default function DailyReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editNotes, setEditNotes] = useState({});

  const load = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/daily-reports`);
      setReports(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const generateToday = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await axios.post(`${API_URL}/daily-reports/generate`, { reportDate: today });
      await load();
      Alert.alert('Done', 'Daily report generated');
    } catch (e) {
      const err = e.response?.data;
      if (err?.error?.includes('already exists')) {
        Alert.alert('Exists', 'Report for today exists. Regenerate with force?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Regenerate',
            onPress: async () => {
              const today = new Date().toISOString().split('T')[0];
              await axios.post(`${API_URL}/daily-reports/generate`, {
                reportDate: today,
                force: true,
              });
              await load();
            },
          },
        ]);
      } else {
        Alert.alert('Error', err?.error || e.message);
      }
    }
  };

  const saveNotes = async (item) => {
    const notes = editNotes[item.id] !== undefined ? editNotes[item.id] : item.adminNotes;
    try {
      await axios.put(`${API_URL}/daily-reports/${item.id}`, { adminNotes: notes });
      await load();
      Alert.alert('Saved');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const publish = async (item) => {
    try {
      await axios.put(`${API_URL}/daily-reports/${item.id}`, { status: 'published' });
      await load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const removeDraft = async (item) => {
    if (item.status === 'published') {
      Alert.alert('Delete published report?', 'This requires force.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await axios.delete(`${API_URL}/daily-reports/${item.id}?force=1`);
            await load();
          },
        },
      ]);
      return;
    }
    try {
      await axios.delete(`${API_URL}/daily-reports/${item.id}`);
      await load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title || item.reportDate}</Text>
      <Text style={styles.meta}>
        {item.reportDate} · {item.status}
      </Text>
      <Text style={styles.summary} numberOfLines={3}>
        {item.summaryText}
      </Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Admin notes"
        value={
          editNotes[item.id] !== undefined ? editNotes[item.id] : item.adminNotes || ''
        }
        onChangeText={(t) => setEditNotes((prev) => ({ ...prev, [item.id]: t }))}
        multiline
      />
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => saveNotes(item)}>
          <Text style={styles.btnText}>Save notes</Text>
        </TouchableOpacity>
        {item.status === 'draft' && (
          <TouchableOpacity style={[styles.btn, styles.btnGreen]} onPress={() => publish(item)}>
            <Text style={styles.btnText}>Publish</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => removeDraft(item)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.generate} onPress={generateToday}>
        <Text style={styles.generateText}>Generate report for today</Text>
      </TouchableOpacity>
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<Text style={styles.empty}>No reports yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  generate: {
    margin: 16,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  generateText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  meta: { color: '#888', marginTop: 4, marginBottom: 8 },
  summary: { color: '#555', marginBottom: 8 },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  btn: { backgroundColor: '#2196F3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  btnGreen: { backgroundColor: '#4CAF50' },
  btnRed: { backgroundColor: '#f44336' },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
