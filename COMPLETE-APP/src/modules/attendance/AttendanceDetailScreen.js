import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import { ATTENDANCE_API_URL as API_URL } from '../../config/attendanceApi';

const STATUSES = ['Picked Up', 'Dropped Safely', 'Absent', 'Late'];

export default function AttendanceDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [eventType, setEventType] = useState('');

  const load = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/attendance/${id}`);
      const row = data.data;
      setStatus(row.status || '');
      setNotes(row.notes || '');
      setEventType(row.eventType || '');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not load attendance log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async () => {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/attendance/${id}`, { status, notes, eventType: eventType || null });
      Alert.alert('Saved', 'Attendance log updated', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  const archive = async () => {
    Alert.alert('Archive log', 'Mark this entry as archived?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        onPress: async () => {
          try {
            await axios.patch(`${API_URL}/attendance/${id}/archive`);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.error || e.message);
          }
        },
      },
    ]);
  };

  const remove = async () => {
    Alert.alert('Delete permanently', 'Remove this log from the database?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/attendance/${id}`);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Error', e.response?.data?.error || e.message);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Status (correct mistaken marker)</Text>
      <View style={styles.row}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.chip, status === s && styles.chipOn]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.chipText, status === s && styles.chipTextOn]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Event type</Text>
      <View style={styles.row}>
        {['Boarding', 'Alighting', ''].map((t) => (
          <TouchableOpacity
            key={t || 'clear'}
            style={[styles.chip, eventType === t && styles.chipOn]}
            onPress={() => setEventType(t)}
          >
            <Text style={[styles.chipText, eventType === t && styles.chipTextOn]}>
              {t || 'Clear'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.area]}
        value={notes}
        onChangeText={setNotes}
        multiline
        placeholder="Admin notes"
      />

      <TouchableOpacity style={styles.primary} onPress={save} disabled={saving}>
        <Text style={styles.primaryText}>{saving ? 'Saving…' : 'Save changes'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondary} onPress={archive}>
        <Text style={styles.secondaryText}>Archive this log</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.danger} onPress={remove}>
        <Text style={styles.dangerText}>Delete permanently</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  label: { fontWeight: 'bold', marginTop: 12, marginBottom: 8, color: '#333' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  chipOn: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  chipText: { color: '#333' },
  chipTextOn: { color: '#fff', fontWeight: 'bold' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  area: { minHeight: 100, textAlignVertical: 'top' },
  primary: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  secondary: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryText: { color: '#fff', fontWeight: 'bold' },
  danger: {
    borderWidth: 1,
    borderColor: '#F44336',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
  dangerText: { color: '#F44336', fontWeight: 'bold' },
});
