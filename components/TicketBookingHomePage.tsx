import axios from 'axios';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions, // Import Dimensions
} from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
const { height: screenHeight } = Dimensions.get('window'); // Get screen height
const { width } = Dimensions.get('window');

const RedBusUI = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [seats, setSeats] = useState([]);

  const data = [
    { key: '1', value: 'Mobiles'},
    { key: '2', value: 'Appliances' },
    { key: '3', value: 'Cameras' },
    { key: '4', value: 'Computers'},
    { key: '5', value: 'Vegetables' },
    { key: '6', value: 'Dairy Products' },
    { key: '7', value: 'Drinks' },
  ];


  const handleSubmit = async () => {
    if (!name || !mobile || !busNumber || seats.length <= 0) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const bookingData = {
      name: name,
      mobileNumber: mobile,
      busNumber: busNumber,
      seatNumber: seats,
    };

    try {
      const response = await axios.post('http://192.168.1.8:8000/book', bookingData);
      console.log({response})
      if (response.status === 200) {
        setName('');
        setMobile('');
        setBusNumber('');
        setSeats([]);
        Alert.alert(`Success Bus added successfully!`);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error({error});
      Alert.alert(`Failed to add the bus. Please check your network and try again.`);
    }
  };

  // Define the global font color variable
  const fontColor = '#333';

  return (
    <ScrollView style={styles.container}>
      {/*Header*/}
      <View style={styles.subcontainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>RSSB Ticket Booking App</Text>
      </View>
      {/* Form */}
      <View style={styles.card}>
        <Text style={[styles.label, { color: fontColor }]}>Name</Text>
        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor={fontColor}  // Apply placeholder color
        />

        <Text style={[styles.label, { color: fontColor }]}>Mobile Number</Text>
        <TextInput
          placeholder="Enter your mobile number"
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          placeholderTextColor={fontColor}  // Apply placeholder color
        />

        <Text style={[styles.label, { color: fontColor }]}>Bus Number</Text>
        <SelectList
          setSelected={(val:any) => setBusNumber(val)}
          data={data}
          save="value"
          placeholder="Add Bus Number"
          boxStyles={styles.selectBox}
          dropdownStyles={styles.dropdown}
          dropdownTextStyles={styles.dropdownText}
          search={false} // Disable search if not needed
        />

        {/* Remaining Form */}
        <Text style={[styles.label, { color: fontColor, marginTop: '2.7%' }]}>Seat Numbers</Text>
        
          <View style={styles.seatRow}>
            <MultipleSelectList 
                setSelected={(val:any) => setSeats(val)} 
                data={data} 
                save="value"
                // onSelect={() => alert(seats)} 
                label="Categories"
                placeholder="Add Seat Number"
                boxStyles={styles.selectBox}
                dropdownStyles={styles.dropdown}
                dropdownTextStyles={styles.dropdownText}
                search={false} // Disable search if not needed
            />
          </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
          <Text style={styles.submitText}>Submit Booking</Text>
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
    fontSize: 4,
    height: '90%', // 90% of screen height
  },
  subcontainer:{
    flex: 1,
    backgroundColor: '#f7f7f7',
    height: '90%',
    marginBottom: '25%',
  },
  selectBox: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: '3%',
  },
  dropdown: {
    width: width * 0.8,
    // height: '38%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  dropdownText: {
    color: '#333',
    fontSize: 16,
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
  tab: { paddingVertical: '3%' },
  tabText: { fontSize: 15, fontWeight: 'bold' },
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
  seatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '4%' },
  removeSeat: { marginLeft: 10 },
  addSeatButton: {
    alignItems: 'center',
    marginBottom: '4%',
    padding: '3%',
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  addSeatText: { color: '#333', fontSize: 15, fontWeight: 'bold' },
  searchButton: {
    backgroundColor: 'rgba(138,1,2,255)',
    padding: '4%',
    borderRadius: 5,
    marginBottom: '10%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});

export default RedBusUI;
