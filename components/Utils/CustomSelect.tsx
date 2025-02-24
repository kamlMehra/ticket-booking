import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

const CustomDropdown = ({ options, selectedValue, onSelect, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setIsVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Trigger to open dropdown */}
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.selectedText}>
          {selectedValue || placeholder || 'Select an option'}
        </Text>
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        transparent
        visible={isVisible}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Get screen dimensions for dynamic height
const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownTrigger: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  selectedText: {
    color: '#333',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: '80%',
    maxHeight:'60%',
    minHeight:'40%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    elevation: 5,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    color: '#333',
  },
});

export default CustomDropdown;
