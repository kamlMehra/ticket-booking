import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
export const Routes = {
  Home: '/(tabs)/index',
  Search: '/(tabs)/search',
  AddBus: '/(tabs)/addBus',
};

const RedBusUI = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('Ticket');
  const [busData, setBusData] = useState<any[]>([]);
  const [ticketData, setTicketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isupdate,setIsUpdate] = useState(false);

  const router = useRouter();


  // Fetch all buses or tickets when the search type changes
  useEffect(() => {
    fetchAllData();
  }, [searchType,isupdate]);

  const formatDateToDDMMYY = (isoDate:any) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}/${month}/${year}`;
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      if (searchType == 'Bus') {
        const response = await axios.get('https://rssb-ticket.vercel.app/bus');
        if (response.status === 200) {
          setBusData(response.data);
        } else {
          Alert.alert('Error', 'Failed to fetch bus data.');
        }
      } else {
        const response = await axios.get('https://rssb-ticket.vercel.app/ticket');
        if (response.status === 200) {
          setTicketData(response.data);
        } else {
          Alert.alert('Error', 'Failed to fetch ticket data.');
        }
      }
    } catch (error) {
      Alert.alert(`No ${searchType} Found!`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchAllData();
      return;
    }

    setLoading(true);
    setBusData([]);
    setTicketData([]);
    try {
      if (searchType == 'Bus') {
        const response = await axios.get(`https://rssb-ticket.vercel.app/bus/${searchQuery}`);
        if (response.status === 200) {
          setBusData(response.data);
        } else {
          Alert.alert('Error', 'Failed to fetch bus data.');
        }
      } else {
        const response = await axios.get(`https://rssb-ticket.vercel.app/ticket/${searchQuery}`);
        if (response.status === 200) {
          setTicketData(response.data);
        } else {
          Alert.alert('Error', 'Failed to fetch ticket data.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to fetch data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTicket = (type:any, ticket: any) => {
    try {
      router.push({
        pathname: '/(tabs)',
        params: {
          _id: ticket._id,
          name: ticket.name,
          mobileNumber: ticket.mobileNumber,
          busNumber: ticket.busNumber,
          seatNumber: ticket.seatNumber,
        },
      });
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to edit. Please check your network connection.');
    }
  };

  const handleEditBus = (type:any, bus: any) => {
    try {
      
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to edit. Please check your network connection.');
    }
  };
  
  

  const handleDelete = async (type: string, id: string) => {
    Alert.alert('Delete', `Are you sure you want to delete this ${type}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            const endpoint =
              type === 'Bus'
                ? `https://rssb-ticket.vercel.app/deletebus/${id}`
                : `https://rssb-ticket.vercel.app/cancel/${id}`;
            const response = await axios.delete(endpoint);
            if (response.status === 200) {
              Alert.alert('Success', `${type} deleted successfully.`);
              if (type === 'Bus') {
                setBusData(busData.filter((bus) => bus.id !== id));
              } else {
                setTicketData(ticketData.filter((ticket) => ticket.id !== id));
              }
              setIsUpdate(!isupdate);
            } else {
              Alert.alert('Error', `Failed to delete ${type}.`);
            }
          } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Unable to delete. Please check your network connection.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subcontainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>RSSB Ticket Search</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setSearchType("Ticket")}
            >
              <View style={styles.radioCircle}>
                {searchType === "Ticket" && (
                  <View style={styles.radioChecked} />
                )}
              </View>
              <Text style={styles.radioLabel}>Ticket</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioContainer}
              onPress={() => setSearchType("Bus")}
            >
              <View style={styles.radioCircle}>
                {searchType === "Bus" && <View style={styles.radioChecked} />}
              </View>
              <Text style={styles.radioLabel}>Bus</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Search</Text>
          <TextInput
            placeholder="Search here"
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#333"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.submitText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="rgba(138,1,2,255)" />
        )}

        { searchType == 'Bus' ?
        busData.map((bus) => (
          <View key={bus._id} style={styles.resultCard}>
            <Text style={styles.resultTitle}>Bus Details</Text>
            <Text style={styles.resultText}>Bus Number: {bus.busNumber}</Text>
            <Text style={styles.resultText}>Total Seats: {bus.totalSeat}</Text>
            <Text style={styles.resultText}>
              Available Seats: {bus.availableSeat}
            </Text>
            <Text style={styles.resultText}>
              Ticket Price: ₹{bus.ticketPrice}
            </Text>
            <Text style={styles.resultText}>
              Start Date:{" "}
              {formatDateToDDMMYY(bus.startDate)}
            </Text>
            <Text style={styles.resultText}>Start Time: {bus.startTime}</Text>
            <Text style={styles.resultText}>From: {bus.fromLocation}</Text>
            <Text style={styles.resultText}>To: {bus.toLocation}</Text>
            <Text style={styles.resultText}>Purpose: {bus.visitPurpose}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEditBus("Bus", bus)}
              >
                <Icon name="edit" size={25} color="#4caf50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete("Bus", bus._id)}
              >
                <Icon name="delete" size={25} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )) : null}

        { searchType == 'Ticket' ?
        ticketData.map((ticket) => (
          <View key={ticket._id} style={styles.resultCard}>
            <Text style={styles.resultTitle}>Ticket Details</Text>
            <Text style={styles.resultText}>Passenger Name: {ticket.name}</Text>
            <Text style={styles.resultText}>Mobile Number: {ticket.mobileNumber}</Text>
            <Text style={styles.resultText}>Bus Number: {ticket.busNumber}</Text>
            <Text style={styles.resultText}>
              Seat Numbers: {ticket.seatNumber.join(", ")}
            </Text>
            <View style={styles.actionButtons}>
              {/* Edit Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleEditTicket("Ticket", ticket)} // Pass the ticket data here
              >
                <Icon name="edit" size={25} color="#4caf50" />
              </TouchableOpacity>
        
              {/* Delete Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete("Ticket", ticket._id)} // Pass ticket ID for deletion
              >
                <Icon name="delete" size={25} color="#f44336" />
              </TouchableOpacity>
            </View>
          </View>
        )) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Styles remain unchanged
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingTop: '13%',
  },
  subcontainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    marginBottom: '25%',
  },
  header: {
    backgroundColor: 'rgba(138,1,2,255)',
    padding: '4%',
    borderRadius: 7,
    marginHorizontal: '5%',
  },
  headerText: {
    color: '#fff',
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    marginHorizontal: '5%',
    marginTop: '5%',
    padding: '5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: '3%',
    marginBottom: '4%',
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: 'rgba(138,1,2,255)',
    padding: '4%',
    borderRadius: 5,
    marginTop: '5%',
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '4%',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(138,1,2,255)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioChecked: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(138,1,2,255)',
  },
  radioLabel: {
    fontSize: 15,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  iconButton: {
    marginHorizontal: 5,
  },
  resultCard: {
    marginHorizontal: '5%',
    marginTop: '5%',
    padding: '5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 15,
    marginBottom: 5,
  },
});

export default RedBusUI;
