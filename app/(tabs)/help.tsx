import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const BusManagement = () => {
  const [busData, setBusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [busOptions, setBusOptions] = useState<any[]>([]);

  const fetchBusData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.8:8000/bus');
      if (response.status === 200) {
        setBusData(response.data);

        // Generate key, value, and label array
        const options = response.data.map((bus: any) => ({
          key: bus.busNumber, // Keep the number as is
          value: bus.busNumber,
          label: bus.busNumber,
        }));
        setBusOptions(options);
        console.log('Formatted Bus Options:', options);
      } else {
        Alert.alert('Error', 'Failed to fetch bus data.');
      }
    } catch (error) {
      console.error({ error });
      Alert.alert('Error', 'Unable to fetch data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };
  console.log(busOptions)

  useEffect(() => {
    fetchBusData(); // Fetch data when the component mounts
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
      ) : busData.length === 0 ? (
        <Text style={styles.noDataText}>No buses available.</Text>
      ) : (
        <ScrollView>
          <Text style={styles.sectionTitle}>Bus Options:</Text>
          {busOptions.map((option) => (
            <View key={option.key} style={styles.card}>
              <Text style={styles.cardTitle}>Key: {option.key}</Text>
              
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 10,
  },
  loader: {
    marginTop: 20,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // For Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007BFF',
  },
});

export default BusManagement;
