import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BASE_URL = "http://192.168.0.112:5000/api";

export default function PauseSubscriptionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [pauseFrom, setPauseFrom] = useState("");
  const [pauseTo, setPauseTo] = useState("");

  const pauseSubscription = async () => {
    if (!pauseFrom || !pauseTo) {
      Alert.alert("Enter both dates");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/subscriptions/${id}/pause`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pause_from: pauseFrom,
            pause_to: pauseTo,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        Alert.alert("Subscription Paused");
        navigation.goBack();
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
          Pause Subscription
        </Text>
      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Pause From
        </Text>

        <TextInput
          placeholder="YYYY-MM-DD"
          value={pauseFrom}
          onChangeText={setPauseFrom}
          style={styles.input}
        />

        <Text style={styles.label}>
          Resume On
        </Text>

        <TextInput
          placeholder="YYYY-MM-DD"
          value={pauseTo}
          onChangeText={setPauseTo}
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={pauseSubscription}
        >
          <Text style={styles.buttonText}>
            Pause Subscription
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
    marginLeft: 10,
  },

  card: {
    margin: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
  },

  button: {
    marginTop: 25,
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});