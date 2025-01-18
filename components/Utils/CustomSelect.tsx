import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  VirtualizedList,
  StyleSheet,
} from 'react-native';

const CustomSelect = ({ options, onSelectionChange, multiSelect = false, defaultSelection = [] }: any) => {
  const [selectedValues, setSelectedValues] = useState<any[]>([]);  // Ensuring it's always an array
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (defaultSelection && Array.isArray(defaultSelection) && defaultSelection.length > 0) {
      setSelectedValues(defaultSelection);
      onSelectionChange(defaultSelection);
    }
  }, [defaultSelection]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionPress = (item: any) => {
    if (multiSelect) {
      const isSelected = selectedValues.includes(item);
      const updatedSelection = isSelected
        ? selectedValues.filter((value: any) => value !== item)
        : [...selectedValues, item];

      setSelectedValues(updatedSelection);
      onSelectionChange(updatedSelection);
    } else {
      setSelectedValues([item]);
      onSelectionChange([item]);
      setIsDropdownOpen(false);
    }
  };

  const getItem = (data: any, index: any) => data[index];
  const getItemCount = (data: any) => data.length;

  console.log('selectedValues-------------------------------->', selectedValues);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.selectBox} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>
          {Array.isArray(selectedValues) && selectedValues.length > 0
            ? selectedValues.join(', ')  // Join only if it's a valid array with elements
            : 'Select an option'}
        </Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <VirtualizedList
            data={options}
            initialNumToRender={5}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionContainer}
                onPress={() => handleOptionPress(item)}
              >
                <Text
                  style={
                    selectedValues.includes(item)
                      ? styles.selectedOptionText
                      : styles.optionText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            getItem={getItem}
            getItemCount={getItemCount}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'center',
    marginTop: '1%',
  },
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedText: {
    color: '#333',
    fontSize: 16,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#333',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    maxHeight: 200,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  optionContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    fontSize: 16,
    color: 'rgba(138,1,2,255)',
  },
});

export default CustomSelect;
