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

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const RedBusUI = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [seats, setSeats] = useState([{ seatNumber: '' }]);


  const addSeat = () => {
    setSeats([...seats, { seatNumber: '' }]);
  };

  const removeSeat = (index:any) => {
    const updatedSeats = [...seats];
    updatedSeats.splice(index, 1);
    setSeats(updatedSeats);
  };

  const handleSeatChange = (value:any, index:any) => {
    const updatedSeats = [...seats];
    updatedSeats[index].seatNumber = value;
    setSeats(updatedSeats);
  };

  const handleSubmit = () => {
    if (!name || !mobile || !busNumber || seats.some((seat:any) => !seat.seatNumber)) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const bookingData = {
      name,
      mobile,
      busNumber,
      seats: seats.map((seat:any) => seat.seatNumber),
    };

    Alert.alert('Booking Successful', JSON.stringify(bookingData, null, 2));
  };

  // Define the global font color variable
  const fontColor = '#333';

  return (
    <ScrollView style={styles.container}>
      {/*Header*/}
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
        <TextInput
          placeholder="Enter the bus number"
          style={styles.input}
          value={busNumber}
          onChangeText={setBusNumber}
          keyboardType="phone-pad"
          placeholderTextColor={fontColor}  // Apply placeholder color
        />

        {/* Remaining Form */}
        <Text style={[styles.label, { color: fontColor }]}>Seat Numbers</Text>
        {seats.map((seat:any, index:any) => (
          <View key={index} style={styles.seatRow}>
            <TextInput
              placeholder={`Seat ${index + 1}`}
              style={[styles.input, { flex: 1 }]}
              value={seat.seatNumber}
              onChangeText={(value:any) => handleSeatChange(value, index)}
              placeholderTextColor={fontColor}  // Apply placeholder color
            />
            <TouchableOpacity onPress={() => removeSeat(index)}>
              <Text style={[styles.removeSeat, { color: fontColor }]}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity onPress={addSeat} style={styles.addSeatButton}>
          <Text style={styles.addSeatText}>Add Seat</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
          <Text style={styles.submitText}>Submit Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '7%',
    height: screenHeight * 0.8, // 90% of screen height
  },
  header: {
    backgroundColor: '#f00',
    padding: '4%',
    borderRadius: 7,
    marginBottom: '2%',
    marginRight: '5%',
    marginLeft: '5%',
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
    backgroundColor: '#f00',
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
