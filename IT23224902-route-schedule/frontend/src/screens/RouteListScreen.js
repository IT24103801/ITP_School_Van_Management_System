import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL } from '../config/api';

export default function RouteListScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get(`${API_URL}/routes`);
      setRoutes(response.data.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => navigation.navigate('RouteDetail', { routeId: item.id })}
    >
      <Text style={styles.routeName}>{item.routeName}</Text>
      <Text style={styles.routeId}>Route ID: {item.routeId}</Text>
      <Text style={styles.vanId}>Van: {item.vanId}</Text>
      <Text style={[styles.status, item.isActive ? styles.active : styles.inactive]}>
        {item.isActive ? 'Active' : 'Inactive'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Live Tracking" onPress={() => navigation.navigate('LiveTracking')} />
        <Button title="Schedules" onPress={() => navigation.navigate('Schedule')} />
      </View>
      
      {loading ? (
        <Text style={styles.loading}>Loading routes...</Text>
      ) : (
        <FlatList
          data={routes}
          renderItem={renderRoute}
          keyExtractor={(item, index) => String(item.id ?? item.routeId ?? index)}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  list: {
    padding: 10,
  },
  routeCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  routeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  routeId: {
    fontSize: 14,
    color: '#666',
  },
  vanId: {
    fontSize: 14,
    color: '#666',
  },
  status: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  active: {
    color: 'green',
  },
  inactive: {
    color: 'red',
  },
  loading: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});
