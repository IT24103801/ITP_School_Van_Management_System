import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { PARENT_STUDENT_API_URL as API_URL } from '../../config/api';

export default function ParentListScreen({ navigation }) {
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchParents();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchParents();
    }, [])
  );

  const getDisplayName = (item) => {
    if (item?.name) return String(item.name);
    const first = String(item?.firstName || '').trim();
    const last = String(item?.lastName || '').trim();
    return `${first} ${last}`.trim() || 'Unnamed Parent';
  };

  const fetchParents = async () => {
    try {
      const response = await axios.get(`${API_URL}/parents`);
      setParents(response.data.data);
    } catch (error) {
      console.error('Error fetching parents:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchParents();
  };

  const deleteParent = async (id) => {
    Alert.alert(
      'Delete Parent',
      'Are you sure you want to delete this parent?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/parents/${id}`);
              fetchParents();
            } catch (error) {
              console.error('Error deleting parent:', error);
              Alert.alert('Error', 'Failed to delete parent');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ParentForm', { mode: 'edit', parent: item })}
      >
        <Text style={styles.name}>{getDisplayName(item)}</Text>
        <Text style={styles.cardText}>Email: {item.email}</Text>
        <Text style={styles.cardText}>Phone: {item.phone}</Text>
        <Text style={styles.cardText}>Address: {item.address}</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => navigation.navigate('ParentForm', { mode: 'edit', parent: item })}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => deleteParent(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ParentForm', { mode: 'add' })}
      >
        <Text style={styles.addButtonText}>+ Add New Parent</Text>
      </TouchableOpacity>
      <FlatList
        data={parents}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${String(item.id ?? item.parentId ?? 'parent')}-${index}`}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No parents found</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
