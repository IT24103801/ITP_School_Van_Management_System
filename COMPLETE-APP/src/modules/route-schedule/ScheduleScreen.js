import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL } from '../../config/api';

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    routeId: '',
    vanId: '',
    session: 'morning',
    departureTime: '',
    arrivalTime: '',
    specialNotes: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await axios.get(`${API_URL}/schedules`);
      setSchedules(response.data.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      routeId: '',
      vanId: '',
      session: 'morning',
      departureTime: '',
      arrivalTime: '',
      specialNotes: '',
    });
  };

  const saveSchedule = async () => {
    try {
      const payload = {
        routeId: Number(form.routeId),
        vanId: form.vanId,
        session: form.session,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        specialNotes: form.specialNotes || null,
      };
      if (!payload.routeId || !payload.vanId || !payload.departureTime || !payload.arrivalTime) {
        Alert.alert('Missing fields', 'Route, van, departure and arrival are required.');
        return;
      }
      if (editingId) {
        await axios.put(`${API_URL}/schedules/${editingId}`, payload);
      } else {
        await axios.post(`${API_URL}/schedules`, payload);
      }
      resetForm();
      fetchSchedules();
    } catch (error) {
      Alert.alert('Save failed', error.response?.data?.error || 'Could not save schedule.');
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      routeId: String(item.routeId ?? ''),
      vanId: String(item.vanId ?? ''),
      session: String(item.session ?? 'morning'),
      departureTime: String(item.departureTime ?? ''),
      arrivalTime: String(item.arrivalTime ?? ''),
      specialNotes: String(item.specialNotes ?? ''),
    });
  };

  const cancelSchedule = async (id) => {
    try {
      await axios.patch(`${API_URL}/schedules/${id}/cancel`, {
        cancelDate: new Date().toISOString().slice(0, 10),
        reason: 'Cancelled from mobile app',
      });
      fetchSchedules();
    } catch (error) {
      Alert.alert('Cancel failed', error.response?.data?.error || 'Could not cancel schedule.');
    }
  };

  const deleteSchedule = (id) => {
    Alert.alert('Delete schedule', 'Remove this trip slot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/schedules/${id}`);
            if (editingId === id) resetForm();
            fetchSchedules();
          } catch (error) {
            Alert.alert('Delete failed', error.response?.data?.error || 'Could not delete schedule.');
          }
        },
      },
    ]);
  };

  const renderSchedule = ({ item }) => {
    const session = item.session ? String(item.session) : '—';
    const days =
      Array.isArray(item.dayOfWeek) && item.dayOfWeek.length > 0
        ? item.dayOfWeek.join(', ')
        : '—';
    return (
    <View style={styles.scheduleCard}>
      <Text style={styles.session}>{session.toUpperCase()} Session</Text>
      <Text style={styles.info}>Van: {item.vanId}</Text>
      <Text style={styles.info}>Route DB ID: {item.routeId}</Text>
      <Text style={styles.info}>Departure: {item.departureTime}</Text>
      <Text style={styles.info}>Arrival: {item.arrivalTime}</Text>
      <Text style={styles.info}>Days: {days}</Text>
      <Text style={styles.info}>Status: {item.isActive ? 'Active' : 'Cancelled/Inactive'}</Text>
      {item.specialNotes ? (
        <Text style={styles.notes}>Notes: {item.specialNotes}</Text>
      ) : null}
      <View style={styles.actions}>
        <Button title="Edit" onPress={() => startEdit(item)} />
        <Button title="Cancel Trip" color="#f0ad4e" onPress={() => cancelSchedule(item.id)} />
        <Button title="Delete" color="#d9534f" onPress={() => deleteSchedule(item.id)} />
      </View>
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.formTitle}>{editingId ? 'Update Schedule' : 'Create Schedule'}</Text>
        <TextInput style={styles.input} placeholder="Route DB ID" keyboardType="numeric" value={form.routeId} onChangeText={(v) => setForm((p) => ({ ...p, routeId: v }))} />
        <TextInput style={styles.input} placeholder="Van ID" value={form.vanId} onChangeText={(v) => setForm((p) => ({ ...p, vanId: v }))} />
        <TextInput style={styles.input} placeholder="Session (morning/afternoon)" value={form.session} onChangeText={(v) => setForm((p) => ({ ...p, session: v }))} />
        <TextInput style={styles.input} placeholder="Departure Time (HH:mm)" value={form.departureTime} onChangeText={(v) => setForm((p) => ({ ...p, departureTime: v }))} />
        <TextInput style={styles.input} placeholder="Arrival Time (HH:mm)" value={form.arrivalTime} onChangeText={(v) => setForm((p) => ({ ...p, arrivalTime: v }))} />
        <TextInput style={styles.input} placeholder="Special notes" value={form.specialNotes} onChangeText={(v) => setForm((p) => ({ ...p, specialNotes: v }))} />
        <View style={styles.actions}>
          <Button title={editingId ? 'Update' : 'Create'} onPress={saveSchedule} />
          {editingId ? <Button title="Cancel Edit" color="#666" onPress={resetForm} /> : null}
        </View>
      </View>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={(item, index) => `${String(item.id ?? item.routeId ?? 'schedule')}-${index}`}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
  },
  form: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  scheduleCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  session: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  notes: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
