import axios from "axios";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import CustomSelect from "./Utils/CustomSelect";
import CustomDropdown from "./Utils/CustomSelect";
import MultiSelectDropdown from "./Utils/MultiSelectDropdown";

const { height: screenHeight } = Dimensions.get("window");
const { width } = Dimensions.get("window");

const RedBusUI = () => {

  const params = useGlobalSearchParams();
  const [name, setName] = useState<any>("");
  const [mobile, setMobile] = useState<any>("");
  const [busNumber, setBusNumber] = useState<any>("");
  const [isValid, setIsValid] = useState(true);
  const [busData, setBusData] = useState<any[]>([]);
  const [seats, setSeats] = useState<any>([]);
  const [busDetails, setBusDetails] = useState<any>(null); // For storing bus details
  const [seatOptions, setSeatOptions] = useState([]); // For storing seat options dynamically

  useEffect(() => {
    if (params.seatNumber) {
      const Seats: any = [params.seatNumber];
      const splitValues = Seats[0]?.split(",");
      setName(params.name);
      setMobile(params.mobileNumber);
      setBusNumber(params.busNumber);
      setSeats(splitValues);
    } else {
      GetBusData(); // Fetch bus data if no parameters are provided
    }
  }, [params.name, params.mobileNumber, params.busNumber, params.seatNumber]);

  console.log('seats==========================',seats);

  const GetBusData = async () => {
    try {
      const response = await axios.get("https://rssb-ticket.vercel.app/bus");
      if (response.status === 200) {
        setBusData(response.data);
      } else {
        Alert.alert("Error", "Failed to fetch bus data.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to Get the Bus. Please check your network and try again."
      );
    }
  };

  React.useEffect(()=>{
    GetSeatData(busNumber);
  },[]);

  React.useEffect(()=>{
    GetSeatData(busNumber);
  },[busNumber]);
  // Fetch bus details by bus number
  const GetSeatData = async (busNumber: string) => {
    try {
      const response = await axios.get(
        `https://rssb-ticket.vercel.app/bus/${busNumber}`
      );
      if (response.status === 200) {
        setBusDetails(response.data); // Set the fetched bus details
      } else {
        Alert.alert("Error", "Failed to fetch bus details.");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to Get bus details. Please check your network and try again."
      );
    }
  };

  function getTotalSeatsByBusNumber(dataArray, busNumber) {
    const bus = dataArray.find(item => item.busNumber === busNumber);
    return bus ?  generateSeatNumbers(bus.totalSeat) : null; 
  }

  const generateSeatNumbers = (busDetails) => {
    const totalSeats = busDetails; // Ensure this field exists in the response
    if (!totalSeats) return []; // If totalSeats is not present, return an empty array
    const seatNumbers = Array.from({ length: totalSeats }, (_, i) => (i + 1).toString());
    setSeatOptions(seatNumbers); // Now set the seatOptions state correctly
    console.log('Seat Number Options ==================',seatNumbers)
  };

  const handleSubmit = async () => {
    if (!name || !mobile || !busNumber || seats.length <= 0) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const bookingData = {
      name: name,
      mobileNumber: mobile,
      busNumber: busNumber,
      seatNumber: seats.join(","), // Combine seats into a string
    };

    try {
      if (params?._id) {
        const response = await axios.put(
          `https://rssb-ticket.vercel.app/update/${params?._id}`,
          bookingData
        );

        if (response.status === 200) {
          setName("");
          setMobile("");
          setBusNumber("");
          setSeats([]);
          setSeatOptions([]);
          Alert.alert("Success", "Ticket updated successfully!");
        } else {
          Alert.alert(
            "Error",
            "Something went wrong while updating. Please try again."
          );
        }
      } else {
        const response = await axios.post(
          "https://rssb-ticket.vercel.app/book",
          bookingData
        );

        if (response.status === 200) {
          setName("");
          setMobile("");
          setBusNumber("");
          setSeats([]);
          setSeatOptions([]);

          Alert.alert("Success", "Ticket booked successfully!");
        } else {
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to submit the booking. Please check your network and try again."
      );
    }
  };

  const fontColor = "#333";

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

          <Text style={[styles.label, { color: fontColor }]}>
            Mobile Number
          </Text>
          <TextInput
        placeholder="Enter your mobile number"
        style={[
          styles.input,
          !isValid && styles.inputError, // Apply error style when invalid
        ]}
        value={mobile}
        onChangeText={(text) => {
          const numericValue = text.replace(/[^0-9]/g, ""); // Allow only numbers
          setMobile(numericValue);
          setIsValid(numericValue.length === 10); // Validate length
        }}
        keyboardType="phone-pad"
        placeholderTextColor="#999"
        maxLength={10} // Prevent input longer than 10 characters
      />

          <Text style={[styles.label, { color: fontColor }]}>Bus Number</Text>
          <CustomDropdown
            options={busData.map((bus) => bus.busNumber)} // Map bus data for dropdown options
            selectedValue={busNumber} // Bind to busNumber state
            onSelect={(value) => {
              setBusNumber(value); 
              getTotalSeatsByBusNumber(busDetails,value)
            }}
            placeholder="Select Bus"
          />

          <Text style={[styles.label, { color: fontColor, marginTop: "2.7%" }]}>
            Seat Numbers
          </Text>
          <MultiSelectDropdown
            options={seatOptions} // Use the updated seat options
            selectedValues={seats}
            onSelect={(values) => setSeats(values)}
            placeholder="Select Seats"
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
            <Text style={styles.submitText}>
              {params.seatNumber ? "Update Booking" : "Submit Booking"}
            </Text>
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
    fontSize: 4,
    height: "90%",
  },
  subcontainer: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    height: "90%",
    marginBottom: "25%",
  },
  selectBox: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingLeft: "3%",
  },
  dropdown: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  dropdownText: {
    color: "#333",
    fontSize: 16,
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
  inputError: {
    borderColor: "red", // Highlight the border in red for invalid input
  },
  card: {
    marginHorizontal: "5%",
    marginTop: "5%",
    padding: "5%",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  label: { fontSize: 15, fontWeight: "500", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: "3%",
    marginBottom: "4%",
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: "rgba(138,1,2,255)",
    marginTop: "7%",
    padding: "4%",
    borderRadius: 5,
    marginBottom: "2%",
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default RedBusUI;
