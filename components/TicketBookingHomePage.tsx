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

let bookedseat = [];

const RedBusUI = () => {
  const params:any = useGlobalSearchParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [seatbooked, setSeatBooked] = useState([]);
  const [mobile, setMobile] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [busData, setBusData] = useState([]);
  const [seats, setSeats] = useState([]);
  const [seatOptions, setSeatOptions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

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

  const GetSeatData = useCallback(async (selectedBusNumber) => {
    if (!selectedBusNumber) return; // Prevent call if no bus number
    setRefreshing(true);
    try {
      const [busResponse, ticketResponse] = await Promise.all([
        axios.get(`https://rssb-ticket.vercel.app/bus/${selectedBusNumber}`),
        axios.get(`https://rssb-ticket.vercel.app/ticketbybus/${selectedBusNumber}`).catch(() => ({ status: 200, data: [] })),
      ]);

      if (ticketResponse.status === 200) {
        setSeatBooked(ticketResponse.data);
        ticketResponse.data.map((item)=>{
          return bookedseat.push(item.seatNumber);
        });
        console.log("DATA",bookedseat);
      }

      if (busResponse.status === 200) {
        setSeatOptions(generateSeatNumbers(busResponse.data[0]?.totalSeat));
      } else {
        Alert.alert("Error", "Failed to fetch seat data.");
      }

    } catch (error) {
      Alert.alert("Error", "Failed to fetch seat data. Please check your network and try again.");
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load bus data only once on mount
  useEffect(() => {
    GetBusData();
  }, [GetBusData]);

  // Load initial params only once
  useEffect(() => {
    const loadParams = async () => {
      try {
        const storedId = await AsyncStorage.getItem("Id");
        const isStoredIdEmpty = !storedId || storedId === "";
        const hasValidParams =
          params &&
          params._id &&
          (params.name || params.mobileNumber || params.busNumber || params.seatNumber) &&
          Object.keys(params).length > 0;

        if (isStoredIdEmpty && hasValidParams) {
          console.log('PARAMS',params)
          setIsUpdate(true);
          const seatsArray = params?.seatNumber ? params.seatNumber.split(",") : [];
          setName(params?.name || "");
          setMobile(params?.mobileNumber || "");
          setBusNumber(params?.busNumber || "");
          setSeats(seatsArray);
          await GetSeatData(params?.busNumber?.trim());
          await AsyncStorage.setItem("Id", params?._id);
        }
      } catch (error) {
        console.error("Error handling params:", error);
      }
    };

    loadParams();
  }, [params]); // Empty dependency array to run only once on mount

  // Fetch seat data only when busNumber changes
  useEffect(() => {
    if (busNumber && !isUpdate) { // Avoid redundant call during update mode
      GetSeatData(busNumber);
    }
  }, [busNumber, GetSeatData]);

  // const generateSeatNumbers = (totalSeats) => {
  //   let finalTemp = bookedseat.map(subArr => subArr[0].split(',')).flat();
  //   return Array.from({ length: totalSeats }, (_, i) => (i + 1).toString());
  // };

  const generateSeatNumbers = (totalSeats) => {
    let finalTemp = bookedseat.map(subArr => subArr[0].split(',')).flat();
    const reservedSeats = new Set(finalTemp);
    const availableSeats = [];
    
    for (let i = 1; i <= totalSeats; i++) {
        const seat = i.toString();
        if (!reservedSeats.has(seat)) {
            availableSeats.push(seat);
        }
    }
    
    return availableSeats;
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
      if (isUpdate) {
        response = await axios.put(`https://rssb-ticket.vercel.app/update/${params?._id}`, bookingData);
      } else {
        response = await axios.post("https://rssb-ticket.vercel.app/book", bookingData);
      }

      if (response.status === 200) {
        Alert.alert("Success", isUpdate ? "Ticket updated successfully!" : "Ticket booked successfully!");
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={GetBusData} />}
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
            <Text style={styles.submitText}>{isUpdate ? "Update Booking" : "Submit Booking"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

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