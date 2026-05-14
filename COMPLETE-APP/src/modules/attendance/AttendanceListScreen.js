import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { ATTENDANCE_API_URL as API_URL } from '../../config/attendanceApi';

export default function AttendanceListScreen({ navigation }) {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [studentId, setStudentId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [archiveBefore, setArchiveBefore] = useState('');

  const fetchAttendance = async () => {
    try {
      const params = {};
      if (studentId.trim()) params.studentId = studentId.trim();
      if (startDate.trim()) params.startDate = startDate.trim();
      if (endDate.trim()) params.endDate = endDate.trim();
      params.archived = showArchived ? 'all' : 'false';

      const response = await axios.get(`${API_URL}/attendance`, { params });
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchAttendance();
    }, [studentId, startDate, endDate, showArchived])
  );

  const applyFilters = () => {
    setLoading(true);
    fetchAttendance();
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance();
  };

  const bulkArchive = async () => {
    if (!archiveBefore.trim()) {
      Alert.alert('Date required', 'Enter archive-before date (YYYY-MM-DD)');
      return;
    }
    Alert.alert(
      'Archive old logs',
      `Archive all non-archived logs before ${archiveBefore}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          onPress: async () => {
            try {
              await axios.post(`${API_URL}/attendance/bulk-archive`, {
                beforeDate: archiveBefore.trim(),
              });
              Alert.alert('Done', 'Logs archived');
              fetchAttendance();
            } catch (e) {
              Alert.alert('Error', e.response?.data?.error || e.message);
            }
          },
        },
      ]
    );
  };

  const statusColor = (status) => {
    if (!status) return '#999';
    if (status === 'Absent') return '#F44336';
    return '#4CAF50';
  };

  const renderItem = ({ item }) => {
    const sid = item.studentId ?? item.student_id;
    const rid = item.routeId ?? item.route_id;
    const status = item.status ?? '';
    const ev = item.eventType || item.event_type;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('AttendanceDetail', { id: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.studentName}>Student ID: {sid}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor(status) }]}>
            <Text style={styles.statusText}>{String(status).toUpperCase()}</Text>
          </View>
        </View>
        {ev ? <Text style={styles.cardText}>Event: {ev}</Text> : null}
        <Text style={styles.cardText}>Date: {new Date(item.date).toLocaleDateString()}</Text>
        <Text style={styles.cardText}>Route: {rid}</Text>
        {item.archived ? <Text style={styles.archived}>Archived</Text> : null}
        {item.notes ? <Text style={styles.notes}>Notes: {item.notes}</Text> : null}
        <Text style={styles.tapHint}>Tap to edit / archive / delete</Text>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.filters}>
      <Text style={styles.filterTitle}>Filter logs</Text>
      <TextInput
        style={styles.filterInput}
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.filterInput}
        placeholder="Start date YYYY-MM-DD"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.filterInput}
        placeholder="End date YYYY-MM-DD"
        value={endDate}
        onChangeText={setEndDate}
      />
      <View style={styles.row}>
        <Text>Show archived</Text>
        <Switch value={showArchived} onValueChange={setShowArchived} />
      </View>
      <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
        <Text style={styles.applyBtnText}>Apply filters</Text>
      </TouchableOpacity>
      <Text style={styles.filterTitle}>End-of-term archive</Text>
      <TextInput
        style={styles.filterInput}
        placeholder="Archive all before YYYY-MM-DD"
        value={archiveBefore}
        onChangeText={setArchiveBefore}
      />
      <TouchableOpacity style={styles.archiveBtn} onPress={bulkArchive}>
        <Text style={styles.applyBtnText}>Bulk archive</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={attendance}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${String(item.id ?? item.studentId ?? 'attendance')}-${index}`}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No attendance records found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 15, paddingBottom: 40 },
  filters: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  filterTitle: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  filterInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  applyBtn: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, alignItems: 'center' },
  archiveBtn: { backgroundColor: '#9C27B0', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  applyBtnText: { color: '#fff', fontWeight: 'bold' },
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
    marginBottom: 10,
  },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  cardText: { fontSize: 14, color: '#666', marginBottom: 5 },
  archived: { color: '#9C27B0', fontWeight: '600', marginTop: 4 },
  notes: { fontSize: 14, color: '#999', fontStyle: 'italic', marginTop: 5 },
  tapHint: { fontSize: 11, color: '#007AFF', marginTop: 8 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#999' },
});
