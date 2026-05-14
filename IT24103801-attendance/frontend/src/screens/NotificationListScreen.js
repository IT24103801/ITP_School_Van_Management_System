import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { ATTENDANCE_API_URL as API_URL } from '../config/attendanceApi';

export default function NotificationListScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        params: { includeCancelled: 'true' },
      });
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notifications/${id}`, { is_read: true });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const resend = async (id) => {
    try {
      await axios.post(`${API_URL}/notifications/${id}/resend`);
      Alert.alert('Sent', 'A new delivery attempt was recorded');
      fetchNotifications();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const cancelQueued = async (id) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/cancel`);
      fetchNotifications();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.error || e.message);
    }
  };

  const deliveryColor = (status) => {
    switch (status) {
      case 'delivered':
        return '#4CAF50';
      case 'failed':
        return '#F44336';
      case 'queued':
      case 'sending':
        return '#FF9800';
      case 'cancelled':
        return '#9E9E9E';
      default:
        return '#2196F3';
    }
  };

  const renderItem = ({ item }) => {
    const unread = !(item.isRead ?? item.is_read);
    const sent = item.sentAt ?? item.sent_at ?? item.created_at;
    const ds = item.deliveryStatus || 'delivered';
    const deliveredAt = item.parentDeliveredAt;
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => markAsRead(item.id)}
          activeOpacity={0.9}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.title}>{item.title}</Text>
            {unread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.message}>{item.message}</Text>
          <View style={styles.deliveryRow}>
            <Text style={[styles.deliveryBadge, { color: deliveryColor(ds) }]}>
              {String(ds).toUpperCase()}
            </Text>
            {deliveredAt ? (
              <Text style={styles.deliveredHint}>
                Parent notified: {new Date(deliveredAt).toLocaleString()}
              </Text>
            ) : null}
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.type}>{item.type.toUpperCase()}</Text>
            <Text style={styles.date}>
              {sent ? new Date(sent).toLocaleDateString() : ''}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.actions}>
          {ds === 'failed' ? (
            <TouchableOpacity style={styles.actionBtn} onPress={() => resend(item.id)}>
              <Text style={styles.actionText}>Resend</Text>
            </TouchableOpacity>
          ) : null}
          {ds === 'queued' || ds === 'sending' ? (
            <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => cancelQueued(item.id)}>
              <Text style={styles.actionText}>Cancel queued</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notifications</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 15 },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333', flex: 1 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  message: { fontSize: 14, color: '#666', marginBottom: 8 },
  deliveryRow: { marginBottom: 8 },
  deliveryBadge: { fontWeight: 'bold', fontSize: 12 },
  deliveredHint: { fontSize: 11, color: '#888', marginTop: 4 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: { fontSize: 12, color: '#007AFF', fontWeight: 'bold' },
  date: { fontSize: 12, color: '#999' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  actionBtn: { backgroundColor: '#007AFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  cancelBtn: { backgroundColor: '#9E9E9E' },
  actionText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
});
