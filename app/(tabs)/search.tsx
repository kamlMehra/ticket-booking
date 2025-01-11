import React, { useState } from "react";
import {
  Button,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { width, height } = Dimensions.get("window"); // To handle responsive scaling

const Example = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    const formattedDate = date.toDateString();
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Selected Date: {selectedDate || "None"}
      </Text>
      <TouchableOpacity style={styles.button} onPress={showDatePicker}>
        <Text style={styles.buttonText}>Show Date Picker</Text>
      </TouchableOpacity>
      <View style={styles.Datebutton}>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        customHeaderIOS={() => (
          <Text style={styles.modalHeader}>Pick a Date</Text>
        )}
      />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  Datebutton: {
    marginBottom: '40%',
  },
  label: {
    fontSize: width * 0.05, // Responsive font size
    marginBottom: 20,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: height * 0.02, // Responsive padding
    paddingHorizontal: width * 0.2,
    borderRadius: 10,
    elevation: 3, // Shadow for better UI
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalHeader: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#007BFF",
  },
});

export default Example;
