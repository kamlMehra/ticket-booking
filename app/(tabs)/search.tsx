import axios from 'axios';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');

const RedBusUI = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchtype, setSearchType] = useState('Ticket');
  const [busData, setBusData] = useState<any[]>([]);
  const [ticketdata,setTciketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchBus = async (query:any) => {
    if (!query) {
      Alert.alert('Error', 'Please enter a search query.');
      return;
    }
    try {
      const response = await axios.get(`http://192.168.1.8:8000/bus/${query}`);
      if (response.status === 200) {
        setBusData(response.data);
        console.log(response.data);
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
  const handleSearchTicket = async (query:any) => {
    if (!query) {
      Alert.alert('Error', 'Please enter a search query.');
      return;
    }
    try {
      const response = await axios.get(`http://192.168.1.8:8000/ticket/${query}`);
      if (response.status === 200) {
        setTciketData(response.data);
        console.log(response.data);
      } else {
        Alert.alert('Error', 'Failed to fetch Ticket data.');
      }
    } catch (error) {
      console.error({ error });
      Alert.alert('Error', 'Unable to fetch data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery) {
      Alert.alert('Error', 'Please enter a search query.');
      return;
    }
     searchtype == "Bus" ? handleSearchBus(searchQuery) : handleSearchTicket(searchQuery);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>RSSB Ticket Search</Text>
        </View>
        {/* Search Field */}
        <View style={styles.card}>
          <View style={styles.radioGroup}>
                      <TouchableOpacity
                        style={styles.radioContainer}
                        onPress={() => setSearchType('Ticket')}
                      >
                        <View style={styles.radioCircle}>
                          {searchtype === 'Ticket' && <View style={styles.radioChecked} />}
                        </View>
                        <Text style={styles.radioLabel}>Ticket</Text>
                      </TouchableOpacity>
          
                      <TouchableOpacity
                        style={styles.radioContainer}
                        onPress={() => setSearchType('Bus')}
                      >
                        <View style={styles.radioCircle}>
                          {searchtype === 'Bus' && <View style={styles.radioChecked} />}
                        </View>
                        <Text style={styles.radioLabel}>Bus</Text>
                      </TouchableOpacity>
                    </View>
          <Text style={styles.label}>Search</Text>
          <TextInput
            placeholder="Search here"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#333"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.submitText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '13%',
  },
  searchButton: {
    backgroundColor: '#f00',
    padding: '4%',
    borderRadius: 5,
    marginTop: '5%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subcontainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginBottom: '25%',
  },
  header: {
    backgroundColor: '#rgba(138,1,2,255)',
    padding: '4%',
    borderRadius: 7,
    marginHorizontal: '5%',
  },
  headerText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginHorizontal: '5%',
    marginTop: '5%',
    padding: '5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  label: { fontSize: 15, fontWeight: '500', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: '3%',
    marginBottom: '4%',
    fontSize: 15,
  },
  radioGroup: {
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-around', // Space items evenly
    alignItems: 'center', // Align items vertically
    marginBottom: '4%',
  },
  radioContainer: {
    flexDirection: 'row', // Arrange circle and label in a row
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(138,1,2,255)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5, // Add spacing between the circle and label
  },
  radioChecked: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(138,1,2,255)',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
});

export default RedBusUI;
