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
  Dimensions, // Import Dimensions
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const { height: screenHeight } = Dimensions.get('window'); // Get screen height

const RedBusUI = () => {
  const [isWomenOnly, setIsWomenOnly] = useState(false);
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [price, setPrice] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [seats, setSeats] = useState([{ seatNumber: '' }]);

  const onDateChange = (event:any, selectedDate:any) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const onEndDateChange = (event:any, selectedDate:any) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
    setShowEndDatePicker(false);
  };

  const formatDate = (date:any) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

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
    if (!name || !mobile || !price || !busNumber || seats.some((seat:any) => !seat.seatNumber)) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const bookingData = {
      name,
      mobile,
      price,
      date,
      endDate,
      busNumber,
      seats: seats.map((seat:any) => seat.seatNumber),
    };

    Alert.alert('Booking Successful', JSON.stringify(bookingData, null, 2));
  };

  // Define the global font color variable
  const fontColor = '#333';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: fontColor }]}>Satsang Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: fontColor }]}>Sewa Tickets</Text>
        </TouchableOpacity>
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

        <Text style={[styles.label, { color: fontColor }]}>Price</Text>
        <TextInput
          placeholder="Enter the price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="phone-pad"
          placeholderTextColor={fontColor}  // Apply placeholder color
        />

        <Text style={[styles.label, { color: fontColor }]}>Start Date of Journey</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.datePickerButtonText, { color: fontColor }]}>{formatDate(date)}</Text>
        </TouchableOpacity>
        <Modal
          transparent
          visible={showDatePicker}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
              <TouchableOpacity
                onPress={() => setShowDatePicker(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={[styles.label, { color: fontColor }]}>End Date of Journey</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={[styles.datePickerButtonText, { color: fontColor }]}>{formatDate(endDate)}</Text>
        </TouchableOpacity>
        <Modal
          transparent
          visible={showEndDatePicker}
          animationType="slide"
          onRequestClose={() => setShowEndDatePicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onEndDateChange}
                minimumDate={date}
              />
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
          <Text>Submit Booking</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '12%',
    height: screenHeight * 0.9, // 90% of screen height
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: '2%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    backgroundColor: '#fff',
  },
  datePickerButtonText: { fontSize: 15 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f00',
    borderRadius: 5,
  },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
  seatRow: { flexDirection: 'row', alignItems: 'center', marginBottom: '4%' },
  removeSeat: { marginLeft: 10 },
  addSeatButton: {
    alignItems: 'center',
    marginVertical: '4%',
    padding: '3%',
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  addSeatText: { color: '#333', fontSize: 15 },
  searchButton: {
    backgroundColor: '#f00',
    padding: '4%',
    borderRadius: 5,
    alignItems: 'center',
  }
});

export default RedBusUI;
