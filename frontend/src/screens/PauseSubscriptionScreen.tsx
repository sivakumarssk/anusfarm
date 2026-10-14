import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";

export default function PauseSubscriptionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [pauseFrom, setPauseFrom] = useState("");
  const [pauseTo, setPauseTo] = useState("");
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");
const [navigateAfterAlert, setNavigateAfterAlert] = useState(false);

const showCustomAlert = (
  title: string,
  message: string,
  navigate = false
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setNavigateAfterAlert(navigate);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);

  if (navigateAfterAlert) {
    setNavigateAfterAlert(false);
    navigation.goBack();
  }
};

  const pauseSubscription = async () => {
if (!pauseFrom || !pauseTo) {
showCustomAlert(
"Missing Dates",
"Please enter both pause and resume dates."
);
return;
}

if (pauseFrom > pauseTo) {
showCustomAlert(
"Invalid Dates",
"Resume date must be on or after the pause date."
);
return;
}

try {
const token = await AsyncStorage.getItem("token");


const res = await fetch(
  `${API_URL}/subscriptions/${id}/pause`,
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
  showCustomAlert(
    "Success",
    "Subscription Paused Successfully",
    true
  );
} else {
  showCustomAlert(
    "Unable to Pause",
    json.message || "Unable to pause subscription."
  );
}


} catch (e) {
console.log(e);


showCustomAlert(
  "Error",
  "Something went wrong. Please try again."
);


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
  placeholderTextColor="#999"
  value={pauseFrom}
  onChangeText={setPauseFrom}
  style={styles.input}
  maxLength={10}
/>

        <Text style={styles.label}>
          Resume On
        </Text>

        <TextInput
          placeholder="YYYY-MM-DD"
           placeholderTextColor="#999"
          value={pauseTo}
          onChangeText={setPauseTo}
          style={styles.input}
          maxLength={10}
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
<CustomAlert
  visible={alertVisible}
  title={alertTitle}
  message={alertMessage}
  buttonText="OK"
  onClose={closeCustomAlert}
/>
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
  fontFamily: "Inter-Bold",
  fontSize: 22,
  marginLeft: 10,
  color: "#000",
},

label: {
  fontFamily: "Inter-SemiBold",
  marginBottom: 8,
  marginTop: 12,
  color: "#222",
},

input: {
  fontFamily: "Inter-Regular",
  fontSize: 15,
  color: "#000",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 10,
  padding: 12,
},

buttonText: {
  fontFamily: "Inter-Bold",
  color: "#fff",
  textAlign: "center",
  fontSize: 15,
},

 

  card: {
    margin: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

 

  

  button: {
    marginTop: 25,
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 10,
  },

 
});