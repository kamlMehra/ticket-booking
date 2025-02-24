import axios from "axios";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import CustomDropdown from "./Utils/CustomSelect";
import MultiSelectDropdown from "./Utils/MultiSelectDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

// GLOBAL VARIABLE
let issubmit = false;

const RedBusUI = () => {
  const params:any = useGlobalSearchParams();
  const router = useRouter();
  const [name, setName] = useState<any>("");
  const [mobile, setMobile] = useState<any>("");
  const [busNumber, setBusNumber] = useState<any>("");
  const [isValid, setIsValid] = useState<any>(true);
  const [busData, setBusData] = useState<any>([]);
  const [seats, setSeats] = useState<any>([]);
  const [seatOptions, setSeatOptions] = useState<any>([]);
  const [refreshing, setRefreshing] = useState<any>(false);
  const [isupdate,setIsUpdate] = useState<any>(false);

  const GetBusData = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axios.get("https://rssb-ticket.vercel.app/bus");
      if (response.status === 200) {
        setBusData(response.data);
      } else {
        Alert.alert("Error", "Failed to fetch bus data.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get the bus. Please check your network and try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const GetSeatData = useCallback(async (busNumber) => {
    setRefreshing(true);
    try {
      const response = await axios.get(`https://rssb-ticket.vercel.app/bus/${busNumber}`);
      if (response.status === 200) {
        setSeatOptions(generateSeatNumbers(response?.data[0]?.totalSeat));
      } else {
        Alert.alert("Error", "Failed to fetch seat data.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch seat data. Please check your network and try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    GetBusData();
  }, [GetBusData]);

  useEffect(() => {
    const loadParams = async () => {
      try {
        const storedId = await AsyncStorage.getItem('Id');
        
        // Check if storedId is null, undefined, or empty string
        const isStoredIdEmpty = !storedId || storedId === '';
        
        // Check if params have meaningful data
        const hasValidParams = params && 
          params._id && 
          (params.name || params.mobileNumber || params.busNumber || params.seatNumber) &&
          Object.keys(params).length > 0;

        // Only set state if storedId is empty AND params have data
        if (isStoredIdEmpty && hasValidParams) {
          setIsUpdate(true);
          const Seats:any = params?.seatNumber ? params?.seatNumber.split(",") : [];
          setName(params?.name || "");
          setMobile(params?.mobileNumber || "");
          setBusNumber(params?.busNumber || "");
          setSeats(Seats);
          await GetSeatData(params?.busNumber?.trim());
          await AsyncStorage.setItem('Id', params?._id);
        }
      } catch (error) {
        console.error('Error handling params:', error);
      }
    };

    loadParams();
  }, [params, GetSeatData]);

  useEffect(() => {
    if (busNumber) {
      GetSeatData(busNumber);
    }
  }, [busNumber, GetSeatData]);

  const generateSeatNumbers = (totalSeats) => {
    return Array.from({ length: totalSeats }, (_, i) => (i + 1).toString());
  };

  const handleSubmit = async () => {
    if (!name || !mobile || !busNumber || seats.length === 0) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const bookingData = {
      name,
      mobileNumber: mobile,
      busNumber,
      seatNumber: seats.join(","),
    };

    try {
      let response;
      if (isupdate) {
        response = await axios.put(`https://rssb-ticket.vercel.app/update/${params?._id}`, bookingData);
      } else {
        response = await axios.post("https://rssb-ticket.vercel.app/book", bookingData);
      }

      if (response.status === 200) {
        Alert.alert("Success", isupdate ? "Ticket updated successfully!" : "Ticket booked successfully!");
        resetForm();
        GetBusData();
        GetSeatData(busNumber);
        setIsUpdate(false);
        router.replace("/(tabs)/search");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit the booking. Please check your network and try again.");
    }
  };

  const resetForm = () => {
    setName("");
    setMobile("");
    setBusNumber("");
    setSeats([]);
    setSeatOptions([]);
  };

  return (
    <ScrollView 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={GetBusData} />
      }
    >
      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>RSSB Ticket Booking App</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholderTextColor="#333"
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            placeholder="Enter your mobile number"
            style={[styles.input, !isValid && styles.inputError]}
            value={mobile}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setMobile(numericValue);
              setIsValid(numericValue.length === 10);
            }}
            keyboardType="phone-pad"
            maxLength={10}
            placeholderTextColor="#333"
          />

          <Text style={styles.label}>Bus Number</Text>
          <CustomDropdown
            options={busData.map((bus) => bus.busNumber)}
            selectedValue={busNumber}
            onSelect={setBusNumber}
            placeholder="Select Bus"
          />

          <Text style={styles.label}>Seat Numbers</Text>
          <MultiSelectDropdown
            options={seatOptions}
            selectedValues={seats}
            onSelect={setSeats}
            placeholder="Select Seats"
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
            <Text style={styles.submitText}>{isupdate ? "Update Booking" : "Submit Booking"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingTop: "13%",
  },
  subcontainer: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    marginBottom: "25%",
  },
  header: {
    backgroundColor: "rgba(138,1,2,255)",
    padding: "4%",
    borderRadius: 7,
    marginHorizontal: "5%",
  },
  headerText: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    marginHorizontal: "5%",
    marginTop: "5%",
    padding: "5%",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: "3%",
    marginBottom: "4%",
    fontSize: 15,
  },
  inputError: {
    borderColor: "red",
  },
  searchButton: {
    backgroundColor: "rgba(138,1,2,255)",
    marginTop: "7%",
    padding: "4%",
    borderRadius: 5,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RedBusUI;