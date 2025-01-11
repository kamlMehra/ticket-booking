import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

// Get the screen dimensions for responsive design
const { width } = Dimensions.get('window');

const App = () => {
  const [selected, setSelected] = useState('');

  const data = [
    { key: '1', value: 'Mobiles'},
    { key: '2', value: 'Appliances' },
    { key: '3', value: 'Cameras' },
    { key: '4', value: 'Computers'},
    { key: '5', value: 'Vegetables' },
    { key: '6', value: 'Dairy Products' },
    { key: '7', value: 'Drinks' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Category</Text>
      <SelectList
        setSelected={(val:any) => setSelected(val)}
        data={data}
        save="value"
        placeholder="Choose a category"
        boxStyles={styles.selectBox}
        dropdownStyles={styles.dropdown}
        dropdownTextStyles={styles.dropdownText}
        search={false} // Disable search if not needed
      />
      <Text style={styles.selectedText}>Selected: {selected}</Text>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  selectBox: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  dropdown: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
  },
  dropdownText: {
    color: '#333',
    fontSize: 16,
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 20,
    color: '#333',
  },
});

export default App;
