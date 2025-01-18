import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Help = () => {
  const [searchType, setSearchType] = useState('Ticket');
  const [loading, setLoading] = useState(false);
  const [busData, setBusData] = useState<any[]>([]);
  const [ticketData, setTicketData] = useState<any[]>([]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (searchType === 'Bus') {
        const response = await axios.get('https://rssb-ticket.vercel.app/bus');
        console.log('Bus data:', response.data);
        if (response.status === 200) {
          setBusData(response.data);
        } else {
          Alert.alert('Error', 'Failed to fetch bus data.');
        }
      } else {
        const response = await axios.get('https://rssb-ticket.vercel.app/ticket');
        console.log('Ticket data:', response.data);
        if (response.status === 200) {
          setTicketData(response.data);
        } else {
          Alert.alert('Error', 'Failed to fetch ticket data.');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert(`No ${searchType} Found!`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const dataToExport = searchType === 'Bus' ? busData : ticketData;
      console.log('Data to export:', dataToExport);
      if (!dataToExport || dataToExport.length === 0) {
        Alert.alert('Error', 'No data available to download.');
        return;
      }
  
      // Flatten nested data and handle seatNumber array, excluding unwanted fields
      const flattenObject = (obj: any) => {
        const result: any = {};
        for (const key in obj) {
          // Skip the fields that should not be included in the export
          if (
            key === '_id' ||
            key === 'createdAt' ||
            key === 'updatedAt' ||
            key === '__v'
          ) {
            continue;
          }
  
          if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const flatObject = flattenObject(obj[key]);
            for (const subKey in flatObject) {
              result[`${key}.${subKey}`] = flatObject[subKey];
            }
          } else if (Array.isArray(obj[key])) {
            result[key] = obj[key].join(', '); // Convert array to comma-separated string
          } else {
            result[key] = obj[key];
          }
        }
        return result;
      };
  
      const flattenedData = dataToExport.map((item) => {
        const flatItem = flattenObject(item);
  
        // Ensure Bus Number and Seat Number are explicitly included if available
        flatItem['BusNumber'] = item.busNumber || 'N/A';
  
        // If searchType is 'Bus', we don't want the 'SeatNumber' field
        if (searchType === 'Bus') {
          delete flatItem['SeatNumber']; // Remove SeatNumber for Bus data
        } else {
          flatItem['SeatNumber'] = Array.isArray(item.seatNumber)
            ? item.seatNumber.join(', ') // Convert array to string
            : item.seatNumber || 'N/A';
        }
  
        return flatItem;
      });
  
      console.log('Flattened data:', flattenedData);
  
      // Convert to worksheet
      const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  
      // Create workbook and append sheet
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, searchType);
  
      // Write the workbook to binary format
      const binaryExcel = XLSX.write(workbook, {
        type: 'base64',
        bookType: 'xlsx',
      });
  
      // Save the file locally
      const fileUri = `${FileSystem.documentDirectory}${searchType}_Data.xlsx`;
      await FileSystem.writeAsStringAsync(fileUri, binaryExcel, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error during download:', error);
      Alert.alert('Error', 'Failed to download the data.');
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchAllData();
  }, [searchType]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>RSSB Ticket Search</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setSearchType('Ticket')}
            >
              <View style={styles.radioCircle}>
                {searchType === 'Ticket' && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>Ticket</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setSearchType('Bus')}
            >
              <View style={styles.radioCircle}>
                {searchType === 'Bus' && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>Bus</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleDownload} style={styles.searchButton}>
            <Text style={styles.submitText}>Download</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color="rgba(138,1,2,255)" />}
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
  subcontainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginBottom: '25%',
  },
  header: {
    backgroundColor: 'rgba(138,1,2,255)',
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
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '4%',
  },
  radioContainer: {
    flexDirection: 'row',
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
    marginRight: 5,
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
  searchButton: {
    backgroundColor: 'rgba(138,1,2,255)',
    padding: '4%',
    borderRadius: 5,
    marginTop: '5%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Help;
