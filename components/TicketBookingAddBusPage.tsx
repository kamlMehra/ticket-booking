import React, { useEffect, useState } from 'react';
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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import { useGlobalSearchParams } from 'expo-router';

const { width } = Dimensions.get("window");

const AddBus = ({ busData }: { busData?: any }) => {
  const params = useGlobalSearchParams();
  const [date, setDate] = useState<any>(new Date());
  const [time, setTime] = useState<any>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<any>(false);
  const [showTimePicker, setShowTimePicker] = useState<any>(false);
  const [price, setPrice] = useState<any>('');
  const [busNumber, setBusNumber] = useState<any>('');
  const [seatNumber, setSeatNumber] = useState<any>('');
  const [to, setTo] = useState<any>('');
  const [from, setFrom] = useState<any>('');
  const [ticketType, setTicketType] = useState<any>('Sewa Bus');

  // Prefill the fields when busData is provided
  // useEffect(() => {
  //   if (params.busNumber) {
  //     setBusNumber(params.busNumber);
  //     setPrice(params.ticketPrice);
  //     setSeatNumber(params.totalSeat);
  //     setTo(params.toLocation);
  //     setFrom(params.fromLocation);
  //     setTicketType(params.visitPurpose);
  //     setDate(new Date(params.startDate as string));
  //     setTime(new Date(params.startTime as string));
  //   }
  // }, [params.busNumber, params.ticketPrice, params.totalSeat, params.toLocation, params.fromLocation, params.visitPurpose, params.startDate, params.startTime]);

  useEffect(() => {
    if (params.busNumber) {
      setBusNumber(params.busNumber);
      setPrice(params.ticketPrice);
      setSeatNumber(params.totalSeat);
      setTo(params.toLocation);
      setFrom(params.fromLocation);
      setTicketType(params.visitPurpose);
      setDate(new Date(params.startDate as string));
  
      // Parse params.startTime and set it to the time state
      if (params.startTime) {
        let StartTime:any = [params.startTime];
        console.log({StartTime});
        const [time, modifier] = StartTime[0]?.split(" ");
        let [hours, minutes, seconds] = time.split(":").map(Number);
        if (modifier === "pm" && hours < 12) hours += 12;
        if (modifier === "am" && hours === 12) hours = 0;
  
        const date = new Date();
        date.setHours(hours, minutes, seconds || 0);
        setTime(date);
      }
    }
  }, [
    params.busNumber,
    params.ticketPrice,
    params.totalSeat,
    params.toLocation,
    params.fromLocation,
    params.visitPurpose,
    params.startDate,
    params.startTime,
  ]);
  
  
  
  

  
  const formatDate = (date: Date) => date.toLocaleDateString();
  const formatTime = (time: Date) => time.toLocaleTimeString();

  const handleDateConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleTimeConfirm = (selectedTime: Date) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  };

  const handleSubmit = async () => {
    if (!price || !busNumber || !seatNumber || !to || !from || !date || !time || !ticketType) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const bookingData = {
      busNumber,
      startTime: formatTime(time),
      fromLocation: from,
      toLocation: to,
      visitPurpose: ticketType,
      startDate: date.toISOString(),
      ticketPrice: parseFloat(price),
      availableSeat: parseInt(seatNumber),
      totalSeat: parseInt(seatNumber),
    };

    try {
      if (busData) {
        // Update request
        const response = await axios.put(`https://rssb-ticket.vercel.app/updatebus/${busData.id}`, bookingData);
        if (response.status === 200) {
          Alert.alert('Success', 'Bus updated successfully!');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      } else {
        // Add request
        const response = await axios.post('https://rssb-ticket.vercel.app/addbus', bookingData);
        if (response.status === 200) {
          Alert.alert('Success', 'Bus added successfully!');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error({ error });
      Alert.alert('Error', 'Failed to add or update the bus. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subcontainer}>
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
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>{formatDate(date)}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleDateConfirm}
            onCancel={() => setShowDatePicker(false)}
          />

          <Text style={styles.label}>Time of Journey</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.datePickerButtonText}>{formatTime(time)}</Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => setShowTimePicker(false)}
          />

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
              onPress={() => setTicketType('Sewa Bus')}
            >
              <View style={styles.radioCircle}>
                {ticketType === 'Sewa Bus' && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>Sewa Bus</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setTicketType('Satsang Bus')}
            >
              <View style={styles.radioCircle}>
                {ticketType === 'Satsang Bus' && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>Satsang Bus</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>{busData ? 'Update Bus' : 'Add Bus'}</Text>
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
    height: '90%',
  },
  subcontainer:{
    flex: 1,
    backgroundColor: '#f7f7f7',
    height: '90%',
    marginBottom: '25%',
  },
  modalHeader: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#007BFF",
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
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 5,
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
    backgroundColor: 'rgba(138,1,2,255)',
    padding: '4%',
    borderRadius: 5,
    alignItems: 'center',
    // marginBottom: '25%',
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

export default AddBus;
