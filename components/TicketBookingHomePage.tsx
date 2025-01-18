import axios from 'axios';
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import CustomSelect from './Utils/CustomSelect';

const { height: screenHeight } = Dimensions.get('window');
const { width } = Dimensions.get('window');

const RedBusUI = () => {
  const params = useGlobalSearchParams();
  const [name, setName] = useState<any>('');
  const [mobile, setMobile] = useState<any>('');
  const [busNumber, setBusNumber] = useState<any>('');
  const [seats, setSeats] = useState([]);
 useEffect(()=>{
   if(params.seatNumber){
     const Seats:any = [params.seatNumber];
     const splitValues = Seats[0]?.split(',');
     setName(params.name);
     setMobile(params.mobileNumber);
     setBusNumber(params.busNumber);
     setSeats(splitValues);
    }},[params.name,params.mobileNumber,params.busNumber,params.seatNumber])

    
    const Seats:any = [params.seatNumber];
    const splitValues = Seats[0]?.split(',');

    console.log('params-------------------------------->',params)
  

  const data = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  // console.log('params-------------------------------->',params.seatNumber)
  // console.log('FinalSeats-------------------------------->',splitValues)

  const handleSelectionChange = useCallback((selectedItems: any) => {
    // Only update if selected items are different from current seats
    if (JSON.stringify(selectedItems) !== JSON.stringify(seats)) {
      setSeats(selectedItems);
      // console.log('Selected Items:', selectedItems);
    }
  }, [seats]);

  const handleSubmit = async () => {
    // Validation: Ensure all fields are filled and valid
    if (!name || !mobile || !busNumber || seats.length <= 0) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
  
    // Prepare the data to be sent in the request
    const bookingData = {
      name: name,
      mobileNumber: mobile,
      busNumber: busNumber,
      seatNumber: seats.join(','), // Combine seats into a string
    };
  
    try {
      // If there's an existing booking ID, perform an update
      if (params?._id) { // Assuming bookingId is passed as a prop or stored in state
        const response = await axios.put(`https://rssb-ticket.vercel.app/update/${params?._id}`, bookingData);
  
        if (response.status === 200) {
          // Reset the form if update is successful
          setName('');
          setMobile('');
          setBusNumber('');
          setSeats([]);
          Alert.alert('Success', 'Ticket updated successfully!');
        } else {
          Alert.alert('Error', 'Something went wrong while updating. Please try again.');
        }
      } else {
        // If no bookingId, proceed with creating a new booking
        const response = await axios.post('https://rssb-ticket.vercel.app/book', bookingData);
  
        if (response.status === 200) {
          // Reset the form after successful booking
          setName('');
          setMobile('');
          setBusNumber('');
          setSeats([]);
          Alert.alert('Success', 'Ticket booked successfully!');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the booking. Please check your network and try again.');
    }
  };
  

  const fontColor = '#333';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>RSSB Ticket Booking App</Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.label, { color: fontColor }]}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor={fontColor}
          />

          <Text style={[styles.label, { color: fontColor }]}>Mobile Number</Text>
          <TextInput
            placeholder="Enter your mobile number"
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            placeholderTextColor={fontColor}
          />

          <Text style={[styles.label, { color: fontColor }]}>Bus Number</Text>
          <CustomSelect
            options={data}
            onSelectionChange={(val: any) => setBusNumber(val[0])}
            multiSelect={false}
            defaultSelection={busNumber ? [busNumber] : []}
            style={styles.selectBox}
            dropdownStyle={styles.dropdown}
            textStyle={styles.dropdownText}
          />

          <Text style={[styles.label, { color: fontColor, marginTop: '2.7%' }]}>Seat Numbers</Text>
          <CustomSelect
            options={data}
            onSelectionChange={handleSelectionChange}
            multiSelect={true}
            defaultSelection={seats}
            style={styles.selectBox}
            dropdownStyle={styles.dropdown}
            textStyle={styles.dropdownText}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
            <Text style={styles.submitText}>{params.seatNumber ? 'Update Booking' : 'Submit Booking'}</Text>
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
    height: '90%',
  },
  subcontainer: {
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
  searchButton: {
    backgroundColor: 'rgba(138,1,2,255)',
    marginTop: '7%',
    padding: '4%',
    borderRadius: 5,
    marginBottom: '2%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RedBusUI;
