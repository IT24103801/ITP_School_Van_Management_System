import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import { ATTENDANCE_API_URL as API_URL } from '../../config/attendanceApi';

export default function DelayAlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [routeId, setRouteId] = useState('');
  const [minutes, setMinutes] = useState('10');
  const [message, setMessage] = useState('Van running behind schedule');

  const load = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/delay-alerts`, {
        params: { status: 'active' },
      });
      setAlerts(data.data || []);
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

  const postDelay = async () => {
    if (!routeId.trim()) {
      Alert.alert('Route required', 'Enter a route ID');
      return;
    }
    try {
      await axios.post(`${API_URL}/delay-alerts`, {
        routeId: Number(routeId),
        estimatedDelayMinutes: Number(minutes) || 0,
        message,
        source: 'manual',
        status: 'active',
      });
      setRouteId('');
      await load();
      Alert.alert('Posted', 'Delay alert created');
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const bumpMinutes = async (item, delta) => {
    const n = Math.max(0, (item.estimatedDelayMinutes || 0) + delta);
    try {
      await axios.put(`${API_URL}/delay-alerts/${item.id}`, {
        estimatedDelayMinutes: n,
      });
      await load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const dismiss = async (item) => {
    try {
      await axios.patch(`${API_URL}/delay-alerts/${item.id}/dismiss`);
      await load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const remove = async (item) => {
    try {
      await axios.delete(`${API_URL}/delay-alerts/${item.id}`);
      await load();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Route {item.routeId}</Text>
      <Text style={styles.body}>{item.message}</Text>
      <Text style={styles.meta}>
        Delay: {item.estimatedDelayMinutes} min · {item.source}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => bumpMinutes(item, -5)}>
          <Text style={styles.btnText}>-5 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => bumpMinutes(item, 5)}>
          <Text style={styles.btnText}>+5 min</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnGreen]} onPress={() => dismiss(item)}>
          <Text style={styles.btnText}>Dismiss</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnRed]} onPress={() => remove(item)}>
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
      <View style={styles.form}>
        <Text style={styles.label}>Route ID</Text>
        <TextInput
          style={styles.input}
          value={routeId}
          onChangeText={setRouteId}
          keyboardType="numeric"
          placeholder="e.g. 1"
        />
        <Text style={styles.label}>Estimated delay (minutes)</Text>
        <TextInput
          style={styles.input}
          value={minutes}
          onChangeText={setMinutes}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Message</Text>
        <TextInput style={styles.input} value={message} onChangeText={setMessage} />
        <TouchableOpacity style={styles.postBtn} onPress={postDelay}>
          <Text style={styles.postBtnText}>Post delay notice</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.section}>Active delays</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item, index) => `${String(item.id ?? item.routeId ?? 'delay')}-${index}`}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
        }
        ListEmptyComponent={<Text style={styles.empty}>No active delays</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  form: { padding: 16, backgroundColor: '#fff', marginBottom: 8 },
  label: { fontWeight: 'bold', marginTop: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  postBtn: {
    backgroundColor: '#FF9800',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  postBtnText: { color: '#fff', fontWeight: 'bold' },
  section: { paddingHorizontal: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  body: { marginTop: 6, color: '#444' },
  meta: { marginTop: 8, color: '#888', fontSize: 12 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  btn: { backgroundColor: '#2196F3', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 },
  btnGreen: { backgroundColor: '#4CAF50' },
  btnRed: { backgroundColor: '#f44336' },
  btnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
});
