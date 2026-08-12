import React from "react";
import {View,Text,StyleSheet,TouchableOpacity,Alert,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {API_URL} from "../config/api";

// const BASE_URL = "http://192.168.0.112:5000/api";

export default function CancelSubscriptionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const cancelSubscription = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/subscriptions/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        Alert.alert(
          "Success",
          "Subscription Cancelled",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("MySubscriptions"),
            },
          ]
        );
      } else {
        Alert.alert(json.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>
          Cancel Subscription
        </Text>
      </View>

      <View style={styles.card}>
        <Ionicons
          name="warning"
          size={70}
          color="#f44336"
        />

        <Text style={styles.heading}>
          Are you sure?
        </Text>

        <Text style={styles.message}>
          Once cancelled, your future milk deliveries
          will stop immediately.
        </Text>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={cancelSubscription}
        >
          <Text style={styles.buttonText}>
            Yes, Cancel Subscription
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.keepText}>
            Keep Subscription
          </Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
  },

  card: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 15,
  },

  message: {
    marginTop: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },

  cancelButton: {
    width: "100%",
    marginTop: 35,
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 10,
  },

  keepButton: {
    width: "100%",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  keepText: {
    textAlign: "center",
    color: "#2E7D32",
    fontWeight: "700",
  },
});