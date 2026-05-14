import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL } from '../config/api';

function parseStudentCount(stop) {
  const raw = stop.assignedStudentIdsJson ?? stop.assigned_student_ids_json;
  if (raw == null || raw === '') return 0;
  try {
    const arr = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return Array.isArray(arr) ? arr.length : 0;
  } catch {
    return 0;
  }
}

export default function RouteDetailScreen({ route }) {
  const routeId = route.params?.routeId;
  const [routeData, setRouteData] = useState(null);
  const [stopPoints, setStopPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRouteDetails = useCallback(async () => {
    if (routeId == null || routeId === '') {
      setError('Missing route id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [routeRes, stopsRes] = await Promise.all([
        axios.get(`${API_URL}/routes/${routeId}`),
        axios.get(`${API_URL}/stops`, { params: { routeDbId: routeId } }),
      ]);
      setRouteData(routeRes.data.data);
      setStopPoints(Array.isArray(stopsRes.data.data) ? stopsRes.data.data : []);
    } catch (e) {
      console.error('Error fetching route details:', e);
      setError(e.response?.status === 404 ? 'Route not found' : 'Failed to load route');
      setRouteData(null);
      setStopPoints([]);
    } finally {
      setLoading(false);
    }
  }, [routeId]);

  useEffect(() => {
    fetchRouteDetails();
  }, [fetchRouteDetails]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>Loading route…</Text>
      </View>
    );
  }

  if (error || !routeData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'No data'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{routeData.routeName}</Text>
        <Text style={styles.info}>Route ID: {routeData.routeId}</Text>
        <Text style={styles.info}>Van ID: {routeData.vanId}</Text>
        {routeData.distanceKm != null && (
          <Text style={styles.info}>Distance: {String(routeData.distanceKm)} km</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stop points</Text>
        {stopPoints.length === 0 ? (
          <Text style={styles.muted}>No stops defined yet.</Text>
        ) : (
          stopPoints.map((stop, index) => {
            const lat = stop.latitude != null ? Number(stop.latitude) : null;
            const lng = stop.longitude != null ? Number(stop.longitude) : null;
            const label = stop.label || `Stop ${index + 1}`;
            const key = stop.id != null ? `stop-${stop.id}` : `stop-idx-${index}`;
            return (
              <View key={key} style={styles.stopCard}>
                <Text style={styles.stopName}>
                  {stop.sequenceOrder != null ? `${stop.sequenceOrder}. ` : `${index + 1}. `}
                  {label}
                </Text>
                <Text style={styles.stopInfo}>Type: {stop.stopType || 'both'}</Text>
                <Text style={styles.stopInfo}>
                  Location:{' '}
                  {lat != null && !Number.isNaN(lat) && lng != null && !Number.isNaN(lng)
                    ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                    : '—'}
                </Text>
                <Text style={styles.stopInfo}>Students linked: {parseStudentCount(stop)}</Text>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loading: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#c00',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  muted: {
    fontSize: 14,
    color: '#888',
  },
  stopCard: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  stopName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  stopInfo: {
    fontSize: 14,
    color: '#666',
  },
});
