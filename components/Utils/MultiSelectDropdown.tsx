import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

const MultiSelectDropdown = ({ options, selectedValues, onSelect, placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (selectedValues && selectedValues.length > 0) {
      setSelectedItems(selectedValues);
    } else {
      setSelectedItems([]); // Clear selected items if selectedValues is empty or null
    }
  }, [selectedValues]); // This will trigger every time selectedValues changes

  const handleSelect = (item) => {
    let updatedSelection;
    if (selectedItems.includes(item)) {
      updatedSelection = selectedItems.filter((i) => i !== item); // Remove if already selected
    } else {
      updatedSelection = [...selectedItems, item]; // Add if not selected
    }
    setSelectedItems(updatedSelection);
    onSelect(updatedSelection);
  };

  const renderSelectedText = () => {
    if (selectedItems.length === 0) {
      return placeholder || 'Select options';
    }
    return selectedItems.join(', ');
  };

  return (
    <View style={styles.container}>
      {/* Trigger to open dropdown */}
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.selectedText}>{renderSelectedText()}</Text>
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
                  style={[
                    styles.option,
                    selectedItems.includes(item) && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedItems.includes(item) && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
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
    maxHeight: height * 0.6, // 60% of screen height
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
  selectedOption: {
    backgroundColor: '#e6f7ff',
  },
  selectedOptionText: {
    color: '#007aff',
  },
});

export default MultiSelectDropdown;
