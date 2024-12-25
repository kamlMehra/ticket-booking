// Import necessary libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';

const BusTicketBookingHomePage = () => {



  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}> 
        <Text style={styles.headerText}>RSSB Ticketing App</Text>
      </View>

      {/* Categories Section */}
      <View style={styles.categories}>
        <TouchableOpacity style={styles.categoryCard}>
          <Image style={styles.categoryImage} source={require('../assets/images/icon.png')} />
          <Text style={styles.categoryText}>City A to City B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.categoryCard}>
          <Image style={styles.categoryImage} source={require('../assets/images/icon.png')} />
          <Text style={styles.categoryText}>City C to City D</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  searchButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sectionTitle: {
    display: "flex",
    textAlign: "center",
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  categoryCard: {
    alignItems: 'center',
  },
  categoryImage: {
    width: 60,
    height: 60,
  },
  categoryText: {
    marginTop: 5,
    fontSize: 14,
  },
  featuredSection: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  featuredCard: {
    marginBottom: 20,
  },
  featuredImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  featuredText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  container1: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header1: {
    backgroundColor: '#6200EE',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  headerText1: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchSection1: {
    marginTop: 20,
  },
  inputContainer1: {
    marginBottom: 15,
  },
  inputLabel1: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input1: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  datePickerButton1: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  datePickerText1: {
    fontSize: 16,
    color: '#555',
  },
  searchButton1: {
    backgroundColor: '#E53935',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BusTicketBookingHomePage;
