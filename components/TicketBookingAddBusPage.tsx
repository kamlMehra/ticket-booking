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
import { Picker } from '@react-native-picker/picker'; // Import Picker

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

  const handleSubmit = () => {
    if (!price || !busNumber || !seatNumber || !to || !from || !date || !time || !ticketType) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const bookingData = {
      price,
      date: formatDate(date),
      time: formatTime(time),
      busNumber,
      seatNumber,
      to,
      from,
      ticketType,
    };

    Alert.alert('Booking Successful', JSON.stringify(bookingData, null, 2));
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
          keyboardType="numeric"
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
          onChangeText={setSeatNumber}
          placeholderTextColor="#333"
        />

        <Text style={styles.label}>Ticket Type</Text>
        <Picker
          selectedValue={ticketType}
          style={styles.picker}
          onValueChange={(itemValue: React.SetStateAction<string>) => setTicketType(itemValue)}
        >
          <Picker.Item label="Sewa Ticket" value="Sewa Ticket" />
          <Picker.Item label="Satsang Ticket" value="Satsang Ticket" />
        </Picker>

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
    paddingTop: '10%',
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
    marginBottom: '10%',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AddBus;
