import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors_app from './colors_app';

const App = () => {
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [ticketFair, setTicketFair] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [type, setType] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const ticketFairOptions = [
    { label: '400', value: '400' },
    { label: '450', value: '450' },
    { label: '550', value: '550' },
  ];

  const typeOptions = [
    { label: 'Satsang', value: 'Satsang' },
    { label: 'Sewa', value: 'Sewa' },
  ];

  const handleDateChange = (event: any, selectedDate: any, isStartDate = true) => {
    if (isStartDate) {
      setShowStartDatePicker(false);
      if (selectedDate) setStartDate(selectedDate.toISOString().split('T')[0]);
    } else {
      setShowEndDatePicker(false);
      if (selectedDate) setEndDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>RSSB Booking App</Text>
        </View>

        {/* Name */}
        <View style={styles.rowContainer}>
          <IconButton icon="account" iconColor={colors_app.lightModeColor} size={24} />
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        {/* Mobile No. */}
        <View style={styles.rowContainer}>
          <IconButton icon="phone" iconColor={colors_app.lightModeColor} size={24} />
          <TextInput
            placeholder="Mobile No."
            value={mobileNo}
            onChangeText={setMobileNo}
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        {/* Ticket Fair */}
        <View style={styles.rowContainer}>
          <IconButton icon="cash" iconColor={colors_app.lightModeColor} size={24} />
          <Dropdown
            style={styles.dropdown}
            data={ticketFairOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Ticket Fair"
            value={ticketFair}
            onChange={(item) => setTicketFair(item.value)}
          />
        </View>

        {/* Type */}
        <View style={styles.rowContainer}>
          <IconButton icon="check" iconColor={colors_app.lightModeColor} size={24} />
          <Dropdown
            style={styles.dropdown}
            data={typeOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Type"
            value={type}
            onChange={(item) => setType(item.value)}
          />
        </View>

                {/* From */}
                <View style={styles.rowContainer}>
          <IconButton icon="map-marker" iconColor={colors_app.lightModeColor} size={24} />
          <TextInput
            placeholder="From"
            value={from}
            onChangeText={setFrom}
            style={styles.input}
          />
        </View>

        {/* To */}
        <View style={styles.rowContainer}>
          <IconButton icon="map-marker" iconColor={colors_app.lightModeColor} size={24} />
          <TextInput
            placeholder="To"
            value={to}
            onChangeText={setTo}
            style={styles.input}
          />
        </View>

        {/* Bus Number */}
        <View style={styles.rowContainer}>
          <IconButton icon="bus" iconColor={colors_app.lightModeColor} size={24} />
          <TextInput
            placeholder="Bus Number"
            value={busNumber}
            onChangeText={setBusNumber}
            style={styles.input}
          />
        </View>

        {/* Seat Number */}
        <View style={styles.rowContainer}>
          <IconButton icon="seat" iconColor={colors_app.lightModeColor} size={24} />
          <Button mode="contained" style={styles.button}onPress={() => setSeatNumber('Selected Seat')}>
            {seatNumber || 'Select Seat'}
          </Button>
        </View>

        {/* Start Date */}
        <View style={styles.rowContainer}>
          <IconButton icon="calendar" iconColor={colors_app.lightModeColor} size={24} />
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => setShowStartDatePicker(true)}
          >
            {startDate || 'Select Start Date'}
          </Button>
          {/* End Date */}
          <Button
            mode="contained"
            style={styles.buttonEndDate}
            onPress={() => setShowEndDatePicker(true)}
          >
            {endDate || 'Select End Date'}
          </Button>
        </View>
        {/* Start Date Picker*/}
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate ? new Date(startDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => handleDateChange(e, date, true)}
          />
        )}

        {/* End Date Picker*/}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate ? new Date(endDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, date) => handleDateChange(e, date, false)}
          />
        )}

        {/* Save Button */}
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => {
            console.log({
              name,
              mobileNo,
              ticketFair,
              busNumber,
              seatNumber,
              from,
              to,
              startDate,
              endDate,
              type,
            });
          }}
        >
          Save
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 10,
  },
  header: {
    backgroundColor: colors_app.lightModeColor,
    padding: 15,
    marginTop: 30,
    borderRadius: 15,
    marginBottom: 10,
  },
  headerText: {
    color: colors_app.white,
    fontSize: 30,
    fontWeight: 500,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    borderRadius: 5,
    borderColor: colors_app.black,
    borderWidth: 0.5,
    flex: 1,
    marginLeft: 10,
  },
  dropdown: {
    flex: 1,
    marginLeft: 10,
    padding: 8,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: colors_app.black,
  },
  button: {
    backgroundColor: colors_app.lightModeColor,
  },
  buttonEndDate: {
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colors_app.lightModeColor,
  },
});

export default App;
