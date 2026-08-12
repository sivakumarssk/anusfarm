import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
   Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {API_URL} from "../config/api";

// const BASE_URL = "http://192.168.0.112:5000/api";

export default function EditSubscriptionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [loading, setLoading] = useState(true);

  const [frequency, setFrequency] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [nextDeliveryDate, setNextDeliveryDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/subscriptions/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (json.success) {
        const sub = json.subscriptions.find(
          (x: any) => x.id == id
        );

        if (sub) {
          setFrequency(sub.frequency);
          setDeliveryTime(sub.delivery_time);
          setNextDeliveryDate(sub.next_delivery_date);
        }
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const updateSubscription = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/subscriptions/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            frequency,
            delivery_time: deliveryTime,
            next_delivery_date: nextDeliveryDate,
          }),
        }
      );

      const json = await res.json();

      if (json.success) {
        Alert.alert(
          "Success",
          "Subscription Updated Successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Edit Subscription
        </Text>
      </View>

      <View style={styles.card}>

        <Text style={styles.label}>
          Frequency
        </Text>

        <View style={styles.row}>
          {["Daily", "Weekly", "Monthly"].map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                frequency === item && styles.selected,
              ]}
              onPress={() => setFrequency(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  frequency === item && {
                    color: "#fff",
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Delivery Time
        </Text>

        <View style={styles.row}>
          {["Morning", "Evening"].map(item => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                deliveryTime === item && styles.selected,
              ]}
              onPress={() =>
                setDeliveryTime(item)
              }
            >
              <Text
                style={[
                  styles.optionText,
                  deliveryTime === item && {
                    color: "#fff",
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          Next Delivery Date
        </Text>

       {/* <TouchableOpacity
  style={styles.input}
  onPress={() => setShowDatePicker(true)}
>
  <Text>
    {nextDeliveryDate || "Select Date"}
  </Text>
</TouchableOpacity> */}
<TouchableOpacity
  style={styles.input}
  onPress={() => setShowDatePicker(true)}
>
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    }}
  >
    <Text
      style={{
        color: nextDeliveryDate ? "#000" : "#888",
      }}
    >
      {nextDeliveryDate || "Select Next Delivery Date"}
    </Text>

    <Ionicons
      name="calendar-outline"
      size={22}
      color="#2E7D32"
    />
  </View>
</TouchableOpacity>
{showDatePicker && (
  <DateTimePicker
    value={
      nextDeliveryDate
        ? new Date(nextDeliveryDate)
        : new Date()
    }
    mode="date"
    display={Platform.OS === "ios" ? "spinner" : "default"}
    minimumDate={new Date()}
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);

      if (event.type === "dismissed") {
        return;
      }

      if (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(
          selectedDate.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
          selectedDate.getDate()
        ).padStart(2, "0");

        setNextDeliveryDate(`${year}-${month}-${day}`);
      }
    }}
  />
)}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={updateSubscription}
        >
          <Text style={styles.saveText}>
            Save Changes
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

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  option: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },

  selected: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },

  optionText: {
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
  },

  saveButton: {
    marginTop: 30,
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
  },

  saveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});