import React, {  useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../config/api";
import { useFocusEffect } from "@react-navigation/native";
import  {useCallback} from "react";
const NotificationScreen = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

 useFocusEffect(
  useCallback(() => {
    fetchNotifications();
  }, [])
);
  // const fetchNotifications = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");

  //     const response = await fetch(
  //       `${API_URL}/api/notifications`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const data = await response.json();

  //     if (data.success) {
  //       setNotifications(data.notifications);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchNotifications = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    console.log("TOKEN =", token);

    const response = await fetch(
      `${API_URL}/api/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    console.log("NOTIFICATION DATA =", data);

    if (data.success) {
      setNotifications(data.notifications);
    }

  } catch (error) {
    console.log("NOTIFICATION ERROR =", error);
  } finally {
    setLoading(false);
  }
};

  const markAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      await fetch(
        `${API_URL}/api/notifications/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            No Notifications
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.type}>{item.type}</Text>

            <Text style={styles.message}>
              {item.message}
            </Text>

            <Text style={styles.time}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },

  type: {
    fontWeight: "700",
    fontSize: 16,
    color: "#0A8A2A",
  },

  message: {
    marginTop: 5,
    fontSize: 15,
  },

  time: {
    marginTop: 8,
    color: "gray",
    fontSize: 12,
  },
});