import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

type RootStackParamList = {
  CreateEncounter: { patientId: number };
};

type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, "CreateEncounter">;

const Dashboard = () => {
  const navigation = useNavigation<DashboardNavigationProp>()
  const [searchValue, setSearchValue] = useState<string>("");
  const [patientList, setPatientList] = useState<{ id: number, name: string }[]>([]);

  const handlePatientSearch = () => {
    console.log("Search Pressed", searchValue);
    const query = searchValue.toLowerCase();
    const results = patients.filter(patient => patient.name.toLowerCase().includes(query));
    console.log(results, "result");
    setPatientList(results);
  };

  const handleCreateEncounter = (id: number) => {
    console.log("Create Encounter for patient ID:", id);
    navigation.navigate("CreateEncounter", { patientId: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Search bar"
          value={searchValue}
          onChangeText={setSearchValue}
          style={styles.input}
          accessibilityLabel="Search input"
          accessibilityHint="Type your search query here"
        />
        <TouchableOpacity style={styles.iconButton} onPress={handlePatientSearch}>
          <Image style={styles.iconImage} source={require('../../assets/images/search-icon.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableHeaderText}>ID</Text>
          <Text style={styles.tableHeaderText}>Name</Text>
          <Text style={styles.tableHeaderText}>Action</Text>
        </View>
        {patientList.map(patient => (
          <View key={patient.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{patient.id}</Text>
            <Text style={styles.tableCell}>{patient.name}</Text>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCreateEncounter(patient.id)}
            >
              <Text style={styles.actionButtonText}>Create Encounter</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const patients = [
  { id: 1, name: 'Sara' },
  { id: 2, name: 'Saif' },
  { id: 3, name: 'Sadiya' },
  { id: 4, name: 'Sumbul' },
  { id: 5, name: 'Aiman' }
];

// Define your styles outside of the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    padding: 12,
    paddingRight: 100, // Space for the icon button
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 50,
    width: '100%',
    marginTop: 15,
  },
  iconButton: {
    position: 'absolute',
    right: 1, // Space from the right edge of the input
    top: '50%',
    transform: [{ translateY: -20 }], // Center the icon vertically
    width: 55, // Width of the button
    height: 55, // Height of the button
    borderRadius: 50, // Make it rounded
    backgroundColor: 'white', // Background color
    borderWidth: 1, // Border width
    borderColor: '#d1d5db', // Border color
    justifyContent: 'center', // Center the icon inside the button
    alignItems: 'center', // Center the icon inside the button
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 3 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 4, // Shadow for Android
  },
  iconImage: {
    width: 20,
    height: 20,
  },
  tableContainer: {
    marginTop: 20,
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#d1d5db',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  tableHeaderText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Dashboard;
