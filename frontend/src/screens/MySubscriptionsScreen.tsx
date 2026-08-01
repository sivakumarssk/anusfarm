import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.112:5000/api";

export default function MySubscriptionsScreen() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    const token = await AsyncStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/subscriptions/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    if (json.success) {
      setSubscriptions(json.subscriptions);
    }
  };

  const pauseSubscription = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(
      `${BASE_URL}/subscriptions/${id}/pause`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pause_from: "2026-08-05",
          pause_to: "2026-08-10",
        }),
      }
    );

    Alert.alert("Paused");

    loadSubscriptions();
  };

  const resumeSubscription = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(
      `${BASE_URL}/subscriptions/${id}/resume`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert("Resumed");

    loadSubscriptions();
  };

  const cancelSubscription = async (id: number) => {
    const token = await AsyncStorage.getItem("token");

    await fetch(
      `${BASE_URL}/subscriptions/${id}/cancel`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert("Cancelled");

    loadSubscriptions();
  };

  return (
    <FlatList
      data={subscriptions}
      keyExtractor={(item: any) => item.id.toString()}
      renderItem={({ item }: any) => (
        <View style={styles.card}>
          <Text style={styles.title}>
            {item.plan}
          </Text>

          <Text>
            Frequency : {item.frequency}
          </Text>

          <Text>
            Next Delivery : {item.next_delivery_date}
          </Text>

          <Text>
            Status : {item.status}
          </Text>

          {item.status == "Active" && (
            <>
              <TouchableOpacity
                style={styles.pause}
                onPress={() =>
                  pauseSubscription(item.id)
                }
              >
                <Text style={styles.btnText}>
                  Pause
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancel}
                onPress={() =>
                  cancelSubscription(item.id)
                }
              >
                <Text style={styles.btnText}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          )}

          {item.status == "Paused" && (
            <TouchableOpacity
              style={styles.resume}
              onPress={() =>
                resumeSubscription(item.id)
              }
            >
              <Text style={styles.btnText}>
                Resume
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  pause: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  resume: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  cancel: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});