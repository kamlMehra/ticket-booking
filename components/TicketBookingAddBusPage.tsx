import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import axios from 'axios'; // Import Axios

const { height: screenHeight } = Dimensions.get('window');

const AddBus = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [price, setPrice] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [ticketType, setTicketType] = useState('Sewa Ticket');

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setDate(date);
    }
    setShowDatePicker(false);
  };

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setTime(date);
    }
    setShowTimePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined);
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString(undefined);
  };

  const handleSubmit = async () => {
    if (!price || !busNumber || !seatNumber || !to || !from || !date || !time || !ticketType) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
  
    const bookingData = {
      busNumber: busNumber, // string
      startTime: formatTime(time), // string
      fromLocation: from, // string
      toLocation: to, // string
      visitPurpose: ticketType, // string (either 'Sewa Ticket' or 'Satsang Ticket')
      startDate: date.toISOString(), // date in ISO format (string)
      ticketPrice: parseFloat(price), // number
      availableSeat: parseInt(seatNumber), // number
      totalSeat: parseInt(seatNumber), // number
    };
  
    try {
      const response = await axios.post('http://192.168.1.6:8000/addbus', bookingData);
      console.log({response})
      if (response.status === 200) {
        Alert.alert(`Success Bus added successfully!`);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error({error});
      Alert.alert(`Failed to add the bus. Please check your network and try again.`);
    }
  };
  
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>RSSB Ticket Booking App</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Bus Number</Text>
        <TextInput
          placeholder="Enter the bus number"
          style={styles.input}
          value={busNumber}
          onChangeText={setBusNumber}
          placeholderTextColor="#333"
        />

<Text style={styles.label}>To</Text>
        <TextInput
          placeholder="Enter destination"
          style={styles.input}
          value={to}
          onChangeText={setTo}
          placeholderTextColor="#333"
        />

        <Text style={styles.label}>From</Text>
        <TextInput
          placeholder="Enter departure location"
          style={styles.input}
          value={from}
          onChangeText={setFrom}
          placeholderTextColor="#333"
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          placeholder="Enter the price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="phone-pad"
          placeholderTextColor="#333"
        />

        <Text style={styles.label}>Start Date of Journey</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.datePickerButtonText}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Time of Journey</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.datePickerButtonText}>{formatTime(time)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={onTimeChange}
          />
        )}

        <Text style={styles.label}>Total Seats</Text>
        <TextInput
          placeholder="Enter the total number of Seats"
          style={styles.input}
          value={seatNumber}
          keyboardType="phone-pad"
          onChangeText={setSeatNumber}
          placeholderTextColor="#333"
        />

        <Text style={styles.label}>Ticket Type</Text>
        <View style={styles.radioGroup}>
          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setTicketType('Sewa Ticket')}
          >
            <View style={styles.radioCircle}>
              {ticketType === 'Sewa Ticket' && <View style={styles.radioChecked} />}
            </View>
            <Text style={styles.radioLabel}>Sewa Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioContainer}
            onPress={() => setTicketType('Satsang Ticket')}
          >
            <View style={styles.radioCircle}>
              {ticketType === 'Satsang Ticket' && <View style={styles.radioChecked} />}
            </View>
            <Text style={styles.radioLabel}>Satsang Ticket</Text>
          </TouchableOpacity>
        </View>


        <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Add Bus</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '13%',
    height: screenHeight * 0.8,
  },
  header: {
    backgroundColor: '#f00',
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
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: '3%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: '3%',
    marginBottom: '4%',
    fontSize: 15,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
    marginBottom: '4%',
  },
  datePickerButtonText: {
    fontSize: 15,
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: '4%',
  },
  searchButton: {
    backgroundColor: '#f00',
    padding: '4%',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: '25%',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
    borderColor: '#f00',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5, // Add spacing between the circle and label
  },
  radioChecked: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#f00',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
  
});

export default AddBus;
