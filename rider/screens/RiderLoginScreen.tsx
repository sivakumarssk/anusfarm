
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://192.168.0.112:5000";

const RiderLoginScreen = ({ navigation }: any) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }

    if (phone.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10 digit phone number");
      return;
    }

    try {
      setLoading(true);

      console.log("RIDER LOGIN PHONE:", phone);

      const response = await axios.post(
        `${API_URL}/api/riders/login`,
        {
          phone: phone.trim(),
        }
      );

      console.log("RIDER LOGIN RESPONSE:", response.data);

      if (response.data.success) {
        // Save JWT token
        await AsyncStorage.setItem(
          "riderToken",
          response.data.token
        );

        // Save rider details
        await AsyncStorage.setItem(
          "riderData",
          JSON.stringify(response.data.rider)
        );

        console.log("RIDER TOKEN SAVED");
        console.log("RIDER DATA:", response.data.rider);

        navigation.replace("RiderHome");
      } else {
        Alert.alert(
          "Login Failed",
          response.data.message || "Unable to login"
        );
      }
    } catch (error: any) {
      console.log(
        "RIDER LOGIN ERROR:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Login Failed",
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>AnusFarm</Text>
        <Text style={styles.subtitle}>
          Rider Delivery App
        </Text>
      </View>

      <View style={styles.card}>

        <Text style={styles.title}>
          Rider Login
        </Text>

        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>
              Login
            </Text>
          )}
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default RiderLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#0A8A2A",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  loginButton: {
    height: 52,
    backgroundColor: "#0A8A2A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

