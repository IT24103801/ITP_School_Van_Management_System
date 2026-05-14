import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL } from '../../config/api';

export default function RouteListScreen({ navigation }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState(null);
  const [form, setForm] = useState({
    routeId: '',
    routeName: '',
    vanId: '',
    distanceKm: '',
    plannedPathJson: '[]',
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const getRouteIdentifier = (item) => item?.id ?? item?.routeId;
  const getRouteIdentifierCandidates = (item) => {
    const values = [item?.id, item?.routeId].filter((v) => v != null && String(v).trim() !== '');
    return [...new Set(values.map((v) => String(v).trim()))];
  };

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

  const resetForm = () => {
    setEditingRouteId(null);
    setForm({ routeId: '', routeName: '', vanId: '', distanceKm: '', plannedPathJson: '[]' });
  };

  const submitRoute = async () => {
    if (!form.routeId || !form.routeName || !form.vanId) {
      Alert.alert('Missing fields', 'Route ID, Route Name and Van ID are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        routeId: form.routeId.trim(),
        routeName: form.routeName.trim(),
        vanId: form.vanId.trim(),
        distanceKm: form.distanceKm ? Number(form.distanceKm) : null,
        plannedPathJson: form.plannedPathJson || '[]',
      };
      if (editingRouteId) {
        try {
          await axios.put(`${API_URL}/routes/${editingRouteId}`, payload);
        } catch (updateError) {
          if (updateError.response?.status !== 404 || !payload.routeId) throw updateError;
          await axios.put(`${API_URL}/routes/${payload.routeId}`, payload);
        }
      } else {
        await axios.post(`${API_URL}/routes`, payload);
      }
      resetForm();
      fetchRoutes();
    } catch (error) {
      Alert.alert('Save failed', error.response?.data?.error || 'Could not save route.');
    } finally {
      setSaving(false);
    }
  };

  const editRoute = (item) => {
    const identifier = getRouteIdentifier(item);
    if (identifier == null || identifier === '') {
      Alert.alert('Cannot edit route', 'Missing route identifier for this record.');
      return;
    }
    setEditingRouteId(identifier);
    setForm({
      routeId: String(item.routeId || ''),
      routeName: String(item.routeName || ''),
      vanId: String(item.vanId || ''),
      distanceKm: item.distanceKm == null ? '' : String(item.distanceKm),
      plannedPathJson: item.plannedPathJson || '[]',
    });
  };

  const removeRoute = (item) => {
    const identifiers = getRouteIdentifierCandidates(item);
    if (identifiers.length === 0) {
      Alert.alert('Delete failed', 'Missing route identifier for this record.');
      return;
    }
    Alert.alert('Delete route', 'Remove this route from the database?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            let deleted = false;
            let lastError = null;
            for (const identifier of identifiers) {
              try {
                await axios.delete(`${API_URL}/routes/${identifier}`);
                deleted = true;
                if (String(editingRouteId) === String(identifier)) resetForm();
                break;
              } catch (deleteError) {
                lastError = deleteError;
                if (deleteError.response?.status !== 404) {
                  throw deleteError;
                }
              }
            }
            if (!deleted) throw lastError || new Error('Could not delete route');
            fetchRoutes();
          } catch (error) {
            Alert.alert('Delete failed', error.response?.data?.error || 'Could not delete route.');
          }
        },
      },
    ]);
  };

  const renderRoute = ({ item }) => {
    const identifier = getRouteIdentifier(item);
    return (
      <View style={styles.routeCard}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RouteDetail', {
              routeId: identifier,
              routeCode: item.routeId,
            })
          }
        >
          <Text style={styles.routeName}>{item.routeName}</Text>
          <Text style={styles.routeId}>Route ID: {item.routeId}</Text>
          <Text style={styles.vanId}>Van: {item.vanId}</Text>
          <Text style={[styles.status, item.isActive ? styles.active : styles.inactive]}>
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </TouchableOpacity>
        <View style={styles.cardActions}>
          <Button title="Edit" onPress={() => editRoute(item)} />
          <Button title="Delete" color="#d9534f" onPress={() => removeRoute(item)} />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <Button title="Live Tracking" onPress={() => navigation.navigate('LiveTracking')} />
        <Button title="Schedules" onPress={() => navigation.navigate('Schedule')} />
      </View>

      <View style={styles.form}>
        <Text style={styles.formTitle}>{editingRouteId ? 'Update Route Mapping' : 'Create Route Mapping'}</Text>
        <TextInput style={styles.input} placeholder="Route ID" value={form.routeId} onChangeText={(v) => setForm((p) => ({ ...p, routeId: v }))} />
        <TextInput style={styles.input} placeholder="Route Name" value={form.routeName} onChangeText={(v) => setForm((p) => ({ ...p, routeName: v }))} />
        <TextInput style={styles.input} placeholder="Van ID" value={form.vanId} onChangeText={(v) => setForm((p) => ({ ...p, vanId: v }))} />
        <TextInput style={styles.input} placeholder="Distance (km)" value={form.distanceKm} keyboardType="numeric" onChangeText={(v) => setForm((p) => ({ ...p, distanceKm: v }))} />
        <TextInput
          style={[styles.input, styles.largeInput]}
          placeholder='Planned Path JSON e.g. [{"lat":6.9,"lng":79.8}]'
          value={form.plannedPathJson}
          onChangeText={(v) => setForm((p) => ({ ...p, plannedPathJson: v }))}
          multiline
        />
        <View style={styles.formButtons}>
          <Button title={saving ? 'Saving...' : editingRouteId ? 'Update Route' : 'Create Route'} onPress={submitRoute} disabled={saving} />
          {editingRouteId ? <Button title="Cancel Edit" onPress={resetForm} color="#666" /> : null}
        </View>
      </View>
      
      {loading ? (
        <Text style={styles.loading}>Loading routes...</Text>
      ) : (
        <FlatList
          data={routes}
          renderItem={renderRoute}
          keyExtractor={(item, index) => `${String(item.id ?? item.routeId ?? 'route')}-${index}`}
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
    backgroundColor: '#fff',
  },
  largeInput: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cardActions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
