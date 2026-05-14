import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL } from '../config/api';

export default function ScheduleScreen() {
  const [schedules, setSchedules] = useState([]);

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
      <Text style={styles.info}>Departure: {item.departureTime}</Text>
      <Text style={styles.info}>Arrival: {item.arrivalTime}</Text>
      <Text style={styles.info}>Days: {days}</Text>
      {item.specialNotes ? (
        <Text style={styles.notes}>Notes: {item.specialNotes}</Text>
      ) : null}
    </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={schedules}
        renderItem={renderSchedule}
        keyExtractor={(item, index) => String(item.id ?? index)}
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
});
