import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import io from 'socket.io-client';
import axios from 'axios';
import { ROUTE_SCHEDULE_API_URL as API_URL, ROUTE_SCHEDULE_SOCKET_URL as SOCKET_URL } from '../../config/api';

function routeMarkerCoord(route) {
  const lat = route.currentGPS_latitude != null ? Number(route.currentGPS_latitude) : null;
  const lng = route.currentGPS_longitude != null ? Number(route.currentGPS_longitude) : null;
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { latitude: lat, longitude: lng };
}

export default function LiveTrackingScreen() {
  const [location, setLocation] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const routesRef = useRef([]);
  const trackingIntervalRef = useRef(null);

  useEffect(() => {
    routesRef.current = routes;
    if (!selectedRouteId && routes.length > 0) {
      setSelectedRouteId(routes[0].id);
    }
  }, [routes]);

  useEffect(() => {
    requestLocationPermission();
    fetchActiveRoutes();

    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socket.on('gps-update', (data) => {
      setRoutes((prev) =>
        prev.map((route) =>
          route.id === data.routeId
            ? {
                ...route,
                currentGPS_latitude: data.latitude,
                currentGPS_longitude: data.longitude,
                currentGPS_timestamp: data.timestamp,
              }
            : route
        )
      );
    });

    return () => {
      socket.disconnect();
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
    const loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  const fetchActiveRoutes = async () => {
    try {
      const response = await axios.get(`${API_URL}/routes/active-gps`);
      setRoutes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const startTracking = async () => {
    if (tracking) return;
    setTracking(true);
    trackingIntervalRef.current = setInterval(async () => {
      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        const targetId = selectedRouteId || routesRef.current[0]?.id;
        if (targetId) {
          await axios.put(`${API_URL}/routes/${targetId}/gps`, {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch (e) {
        console.warn('Tracking tick failed:', e?.message);
      }
    }, 5000);
  };

  const stopTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }
    setTracking(false);
  };

  const cycleRoute = () => {
    if (routes.length === 0) return;
    const index = routes.findIndex((r) => r.id === selectedRouteId);
    const next = routes[(index + 1) % routes.length];
    setSelectedRouteId(next.id);
  };

  const clearTrail = async () => {
    const targetId = selectedRouteId || routes[0]?.id;
    if (!targetId) {
      Alert.alert('No route', 'No route available to clear breadcrumb trail.');
      return;
    }
    try {
      await axios.delete(`${API_URL}/routes/${targetId}/gps-trail`);
      Alert.alert('Done', 'GPS breadcrumb history cleared for selected route.');
    } catch (error) {
      Alert.alert('Failed', error.response?.data?.error || 'Could not clear GPS trail.');
    }
  };

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) || null;

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker coordinate={location} title="Current Location" pinColor="blue" />

          {routes.map((route, index) => {
            const coord = routeMarkerCoord(route);
            if (!coord) return null;
            return (
              <Marker
                key={`${String(route.id ?? route.routeId ?? 'route')}-${index}`}
                coordinate={coord}
                title={route.routeName || route.routeId}
                pinColor="red"
              />
            );
          })}
        </MapView>
      )}

      <View style={styles.controls}>
        <Text style={styles.routeText}>
          Tracking route: {selectedRoute ? `${selectedRoute.routeName || selectedRoute.routeId} (#${selectedRoute.id})` : 'none'}
        </Text>
        <Button title="Switch Route" onPress={cycleRoute} />
        <View style={styles.gap} />
        <Button
          title={tracking ? 'Stop tracking' : 'Start tracking (demo GPS upload)'}
          onPress={tracking ? stopTracking : startTracking}
        />
        <View style={styles.gap} />
        <Button title="Clear Breadcrumb Trail" color="#d9534f" onPress={clearTrail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  routeText: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 8,
    borderRadius: 6,
    fontSize: 12,
    color: '#333',
  },
  gap: {
    height: 8,
  },
});
