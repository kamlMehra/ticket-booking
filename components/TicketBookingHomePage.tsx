import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput,Platform, NativeSyntheticEvent, KeyboardAvoidingView, ScrollView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeHeader = () => {

  //Date Time showing Logic 
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busNo, setbusNo] = useState('');
  const [seatNo, setseatNo] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleFromChange = (text: React.SetStateAction<string>) => setFrom(text);
  const handleToChange = (text: React.SetStateAction<string>) => setTo(text);
  const handleBusNoChange = (text: React.SetStateAction<string>) => setbusNo(text);
  const handleSeatNoChange = (text: React.SetStateAction<string>) => setseatNo(text);

  interface DateChangeEvent extends NativeSyntheticEvent<NativeSyntheticEventSource> {
    timestamp: number;
    nativeEvent: {
      timestamp: number;
    };
  }
  
  const onChange = (event: DateChangeEvent | null, selectedDate: Date | undefined) => {
    const currentDate = selectedDate ?? date; 
    setShowDatePicker(Platform.OS === 'ios'); 
    setDate(currentDate); 
  };

  interface TimeChangeEvent extends NativeSyntheticEvent<NativeSyntheticEventSource> {
    timestamp: number;
    nativeEvent: {
      timestamp: number;
    };
  }
  
  const onChangeTime = (event: TimeChangeEvent | null, selectedTime: Date | undefined) => {
    const currentHour = selectedTime ?? time;
    setShowTimePicker(Platform.OS === 'ios');
    setTime(currentHour);
  };

  const showMode = (currentMode: string) => {
    if (currentMode === 'date') {
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
    }
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  //Date Time End


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.banner}>
                <Text style={styles.bannerText}>RSSB Ticket Booking</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                  <Image 
                    source={require('../assets/images/bus.png')} 
                    style={styles.buttonImage} 
                  />
                  <Text style={styles.buttonText}>Add new{'\n'}Bus</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Image 
                    source={require('../assets/images/ticket.png')} 
                    style={styles.buttonImage} 
                  />
                  <Text style={styles.buttonText}>Book{'\n'}Tickets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                  <Image 
                    source={require('../assets/images/search.png')} 
                    style={styles.buttonImage} 
                  />
                  <Text style={styles.buttonText}>Search{'\n'}Buses</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Content Section */}
            <View style={styles.contentContainer}>
              <View style={styles.row}>
                <Image source={require('../assets/images/bus.png')} style={styles.icon} />
                <Text style={styles.label}>From</Text>
                <TextInput
                  style={styles.input}
                  value={from}
                  onChangeText={handleFromChange}
                />
              </View>
              <View style={styles.row}>
                <Image source={require('../assets/images/bus.png')} style={styles.icon} />
                <Text style={styles.label}>To    </Text>
                <TextInput style={styles.input} value={to} onChangeText={handleToChange} />
              </View>
              <View style={styles.row}>
                <Image source={require('../assets/images/calendar.png')} style={styles.icon} />
                <Text style={styles.label}>Date of Journey</Text>
                <TouchableOpacity onPress={showDatepicker}>
                  <Text style={styles.dateText}>{date.toDateString()}</Text>
                </TouchableOpacity>
                </View>
                <View style={styles.row}>
                  <Image source={require('../assets/images/time.png')} style={styles.icon} /> 
                  <Text style={styles.label}>Time of Journey</Text>
                  <TouchableOpacity onPress={showTimepicker}>
                  <Text style={styles.dateText}>{time.toLocaleTimeString()}</Text> 
                  </TouchableOpacity>
                </View>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChange}
                />
              )}
              {showTimePicker && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="default"
                  onChange={onChangeTime}
                />
              )}
              <View style={styles.row}>
                <Image source={require('../assets/images/bus.png')} style={styles.icon} />
                <Text style={styles.label}>Bus No.</Text>
                <TextInput
                  style={styles.input}
                  value={busNo}
                  onChangeText={handleBusNoChange}
                />
              </View>
              <View style={styles.row}>
                <Image source={require('../assets/images/seat.png')} style={styles.icon} />
                <Text style={styles.label}>No. of Seats</Text>
                <TextInput
                  style={styles.input}
                  value={seatNo}
                  onChangeText={handleSeatNoChange}
                />
              </View>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Bus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1, 
    },
  headerContainer: {
    flex: 0.2,
  },
  banner: {
    backgroundColor: '#3a0ca3', // Example: Golden color for spirituality
    padding: 10,
    alignItems: 'center',
  },
  bannerText: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#ffffff', // Green color
    padding: 15,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 15,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  buttonImage: {
    width: 30, 
    height: 30,
    marginRight: 5,
  },
  //second part
  contentContainer: {
    borderRadius: 15,
    margin: 25,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000000',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3a0ca3',
  },
  saveButton: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#3a0ca3', // Green color
    padding: 15,
    borderRadius: 15,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

// Example of how to add it to your application's homepage
const HomePage = () => {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader /> 
      {/* Rest of your home page content */}
    </View>
  );
};

export default HomePage;