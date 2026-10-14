import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config/api";
import * as Location from "expo-location";
import CustomAlert from "../components/CustomAlert";
export default function AddAddressScreen() {
  const navigation = useNavigation<any>();
  const [addressType, setAddressType] = useState("Home");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
const [latitude, setLatitude] = useState<number | null>(null);
const [longitude, setLongitude] = useState<number | null>(null);
const [loading, setLoading] = useState(false);
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");
const [alertAction, setAlertAction] = useState<"none" | "back">("none");

const showCustomAlert = (
  title: string,
  message = "",
  action: "none" | "back" = "none"
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertAction(action);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  const action = alertAction;

  setAlertVisible(false);
  setAlertAction("none");

  if (action === "back") {
    navigation.goBack();
  }
};

  const saveAddress = async () => {
    try {
      if (!address.trim()) {
  showCustomAlert("Please enter an address");
  return;
}
if (address.trim().length < 15) {
  showCustomAlert(
  "Incomplete Address",
  "Please enter your complete address.\n\nExample: H.No, Street/Area, Kodad, Telangana, Pincode"
);
  return;
}
if (!phone.trim()) {
  showCustomAlert("Please enter a phone number");
  return;
}

if (phone.length !== 10) {
  showCustomAlert("Please enter a valid 10-digit phone number");
  return;
}
      const token = await AsyncStorage.getItem("token");
      if (!token) {
  showCustomAlert("Error", "Please login again.");
  return;
}
      await axios.post(  `${API_URL}/api/addresses`,{
          type: addressType,
          address,
          phone,
          latitude,
          longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     showCustomAlert("Success", "Address Added");
      navigation.goBack();
    } catch (error: any) {
  console.log("ADD ADDRESS ERROR =", error.response?.data);
  console.log("ADD ADDRESS STATUS =", error.response?.status);
  console.log("ADD ADDRESS MESSAGE =", error.message);

  showCustomAlert(
    "Failed to save address",
    error.response?.data?.message || error.message
  );
}
  };
   const getCurrentLocation = async () => {
      setLoading(true);
    try {
      // Check if location service is enabled
      const enabled =
        await Location.hasServicesEnabledAsync();
    if (!enabled) {
  setLoading(false);
  showCustomAlert(
    "Location Disabled",
    "Please enable location services"
  );
  return;
  }
      // Ask permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
  setLoading(false);
  showCustomAlert(
    "Permission Denied",
    "Location permission is required."
  );
  return;
}
      // Get current location
      const location =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High,
        });
        setLatitude(
    location.coords.latitude
  );
  setLongitude(
    location.coords.longitude
  );
  
        const addressData =
    await Location.reverseGeocodeAsync({
      latitude:
        location.coords.latitude,
  
      longitude:
        location.coords.longitude,
    });

    console.log(addressData);
      console.log(
        'Latitude:',
        location.coords.latitude
      );
      console.log(
        'Longitude:',
        location.coords.longitude
      );
     setLoading(false);
  
    }catch (error) {
  setLoading(false);
  console.log(error);
 showCustomAlert("Error", "Unable to fetch your current location.");
}
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.backButton}
  >
    <Ionicons
      name="arrow-back"
      size={26}
      color="#000"
    />
  </TouchableOpacity>

  <Text style={styles.title}>Add Address</Text>
</View>

      <Text style={styles.label}>Address Type</Text>

      <View style={styles.typeRow}>
        {["Home", "Work", "Other"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.typeButton,
              addressType === item && styles.selected,
            ]}
            onPress={() => setAddressType(item)}
          >
            <Text
              style={{
                color: addressType === item ? "#fff" : "#000",
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Address</Text>

      {/* <TextInput
        style={styles.input}
        placeholder="Enter Address"
        value={address}
        onChangeText={setAddress}
        multiline
      /> */}
        
       <TextInput
  style={styles.input}
  placeholder="Enter Address"
  value={address}
  onChangeText={(text) => {
    setAddress(text);

    // Clear old GPS coordinates when user manually changes address
    setLatitude(null);
    setLongitude(null);
  }}
  multiline
/>

      <TouchableOpacity
  style={styles.locationButton}
  onPress={getCurrentLocation}
  disabled={loading}
>
  <Text style={styles.locationButtonText}>
    {loading ? "Fetching Location..." : "📍 Use Current Location"}
  </Text>
</TouchableOpacity>
     

      <Text style={styles.label}>Phone Number</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Phone"
        value={phone}
        keyboardType="phone-pad"
        onChangeText={setPhone}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveAddress}
      >
        <Text style={styles.buttonText}>
          Save Address
        </Text>
      </TouchableOpacity>

      
<CustomAlert
  visible={alertVisible}
  title={alertTitle}
  message={alertMessage}
  onClose={closeCustomAlert}
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},

backButton: {
  marginRight: 15,
},

title: {
  fontSize: 22,
  fontWeight: "bold",
},
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  label: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },

  typeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  typeButton: {
    borderWidth: 1,
    borderColor: "#0A8A2A",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },

  selected: {
    backgroundColor: "#0A8A2A",
  },

  button: {
    marginTop: 40,
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  locationButton: {
  backgroundColor: "#0A8A2A",
  padding: 14,
  borderRadius: 10,
  marginTop: 15,
  alignItems: "center",
},

locationButtonText: {
  color: "#fff",
  fontWeight: "600",
},
});