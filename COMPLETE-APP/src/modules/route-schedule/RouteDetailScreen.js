import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL } from '../../config/api';

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
  const routeDbId = route.params?.routeId;
  const routeCode = route.params?.routeCode;
  const routeIdentifier = routeDbId ?? routeCode;
  const [routeData, setRouteData] = useState(null);
  const [stopPoints, setStopPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stopForm, setStopForm] = useState({
    id: null,
    label: '',
    latitude: '',
    longitude: '',
    sequenceOrder: '1',
    stopType: 'both',
    assignedStudentIdsJson: '[]',
  });

  const fetchRouteDetails = useCallback(async () => {
    if (routeIdentifier == null || routeIdentifier === '') {
      setError('Missing route id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let resolvedRoute = null;

      try {
        const routeRes = await axios.get(`${API_URL}/routes/${routeIdentifier}`);
        resolvedRoute = routeRes.data?.data || null;
      } catch (detailErr) {
        // Fallback for environments where /routes/:id is inconsistent:
        // load full list and resolve client-side by DB id or business routeId.
        const listRes = await axios.get(`${API_URL}/routes`);
        const allRoutes = Array.isArray(listRes.data?.data) ? listRes.data.data : [];
        const matchText = String(routeIdentifier);
        const matchNumber = Number(routeIdentifier);
        resolvedRoute =
          allRoutes.find((r) => String(r?.id) === matchText) ||
          allRoutes.find((r) => !Number.isNaN(matchNumber) && Number(r?.id) === matchNumber) ||
          (routeCode ? allRoutes.find((r) => String(r?.routeId) === String(routeCode)) : null) ||
          allRoutes.find((r) => String(r?.routeId) === matchText) ||
          null;
        if (!resolvedRoute) {
          throw detailErr;
        }
      }

      setRouteData(resolvedRoute);
      const resolvedRouteDbId = resolvedRoute?.id;

      if (resolvedRouteDbId != null && resolvedRouteDbId !== '') {
        const stopsRes = await axios.get(`${API_URL}/stops`, {
          params: { routeDbId: resolvedRouteDbId },
        });
        setStopPoints(Array.isArray(stopsRes.data.data) ? stopsRes.data.data : []);
      } else {
        setStopPoints([]);
      }
    } catch (e) {
      console.error('Error fetching route details:', e);
      setError(e.response?.status === 404 ? 'Route not found' : 'Failed to load route');
      setRouteData(null);
      setStopPoints([]);
    } finally {
      setLoading(false);
    }
  }, [routeIdentifier, routeCode]);

  useEffect(() => {
    fetchRouteDetails();
  }, [fetchRouteDetails]);

  const resetStopForm = () => {
    setStopForm({
      id: null,
      label: '',
      latitude: '',
      longitude: '',
      sequenceOrder: String(stopPoints.length + 1),
      stopType: 'both',
      assignedStudentIdsJson: '[]',
    });
  };

  const submitStop = async () => {
    if (!routeData?.id) return;
    try {
      const payload = {
        routeDbId: routeData.id,
        label: stopForm.label || null,
        latitude: Number(stopForm.latitude),
        longitude: Number(stopForm.longitude),
        sequenceOrder: Number(stopForm.sequenceOrder),
        stopType: stopForm.stopType || 'both',
        assignedStudentIdsJson: stopForm.assignedStudentIdsJson || '[]',
      };
      if (Number.isNaN(payload.latitude) || Number.isNaN(payload.longitude) || Number.isNaN(payload.sequenceOrder)) {
        Alert.alert('Invalid stop', 'Latitude, longitude and sequence must be numbers.');
        return;
      }
      if (stopForm.id) {
        await axios.put(`${API_URL}/stops/${stopForm.id}`, payload);
      } else {
        await axios.post(`${API_URL}/stops`, payload);
      }
      resetStopForm();
      fetchRouteDetails();
    } catch (e) {
      Alert.alert('Stop save failed', e.response?.data?.error || 'Could not save stop.');
    }
  };

  const startEditStop = (stop) => {
    setStopForm({
      id: stop.id,
      label: String(stop.label || ''),
      latitude: String(stop.latitude ?? ''),
      longitude: String(stop.longitude ?? ''),
      sequenceOrder: String(stop.sequenceOrder ?? ''),
      stopType: String(stop.stopType || 'both'),
      assignedStudentIdsJson: String(stop.assignedStudentIdsJson || '[]'),
    });
  };

  const deleteStop = (stopId) => {
    Alert.alert('Delete stop', 'Remove this stop point?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/stops/${stopId}`);
            if (stopForm.id === stopId) resetStopForm();
            fetchRouteDetails();
          } catch (e) {
            Alert.alert('Delete failed', e.response?.data?.error || 'Could not delete stop.');
          }
        },
      },
    ]);
  };

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
        <View style={styles.formBlock}>
          <TextInput style={styles.input} placeholder="Label (e.g. Main Gate)" value={stopForm.label} onChangeText={(v) => setStopForm((p) => ({ ...p, label: v }))} />
          <TextInput style={styles.input} placeholder="Latitude" keyboardType="numeric" value={stopForm.latitude} onChangeText={(v) => setStopForm((p) => ({ ...p, latitude: v }))} />
          <TextInput style={styles.input} placeholder="Longitude" keyboardType="numeric" value={stopForm.longitude} onChangeText={(v) => setStopForm((p) => ({ ...p, longitude: v }))} />
          <TextInput style={styles.input} placeholder="Sequence order" keyboardType="numeric" value={stopForm.sequenceOrder} onChangeText={(v) => setStopForm((p) => ({ ...p, sequenceOrder: v }))} />
          <TextInput style={styles.input} placeholder="Stop type (pickup/dropoff/both)" value={stopForm.stopType} onChangeText={(v) => setStopForm((p) => ({ ...p, stopType: v }))} />
          <TextInput style={styles.input} placeholder='Assigned student IDs JSON e.g. ["S001"]' value={stopForm.assignedStudentIdsJson} onChangeText={(v) => setStopForm((p) => ({ ...p, assignedStudentIdsJson: v }))} />
          <View style={styles.actions}>
            <Button title={stopForm.id ? 'Update Stop' : 'Add Stop'} onPress={submitStop} />
            {stopForm.id ? <Button title="Cancel Edit" color="#666" onPress={resetStopForm} /> : null}
          </View>
        </View>
        {stopPoints.length === 0 ? (
          <Text style={styles.muted}>No stops defined yet. Add stops via the Route & Schedule API (`/api/stops`).</Text>
        ) : (
          stopPoints.map((stop, index) => {
            const lat = stop.latitude != null ? Number(stop.latitude) : null;
            const lng = stop.longitude != null ? Number(stop.longitude) : null;
            const label = stop.label || `Stop ${index + 1}`;
            const key = stop.id != null ? `stop-${stop.id}-${index}` : `stop-idx-${index}`;
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
                <View style={styles.actions}>
                  <Button title="Edit" onPress={() => startEditStop(stop)} />
                  <Button title="Delete" color="#d9534f" onPress={() => deleteStop(stop.id)} />
                </View>
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
  formBlock: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  actions: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
