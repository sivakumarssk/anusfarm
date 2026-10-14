// import React, { useState } from "react";
// import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert,} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "../config/api";

// const AddMoneyScreen = () => {
//   const navigation = useNavigation<any>();
//   const [amount, setAmount] = useState("");

//   const handleAddMoney = async () => {
//     if (!amount || Number(amount) <= 0) {
//       Alert.alert("Enter a valid amount");
//       return;
//     }

//     try {
//       const token = await AsyncStorage.getItem("token");

//       const response = await fetch(`${API_URL}/api/wallet/add-money`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           amount: Number(amount),
//         }),
//       });

//       const data = await response.json();

//       if (data.success) {
//         Alert.alert("Success", "Money added successfully");
//         navigation.goBack();
//       } else {
//         Alert.alert("Error", data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       Alert.alert("Something went wrong");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>

//         <Text style={styles.title}>Add Money</Text>
//       </View>

//       <Text style={styles.label}>Enter Amount</Text>

//       <TextInput
//         placeholder="₹ 0"
//         keyboardType="numeric"
//         value={amount}
//         onChangeText={setAmount}
//         style={styles.input}
//       />

//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleAddMoney}
//       >
//         <Text style={styles.buttonText}>Add Money</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default AddMoneyScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//     padding: 16,
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     marginLeft: 12,
//   },

//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//   },

//   input: {
//     height: 50,
//     borderWidth: 1,
//     borderColor: "#DDD",
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     backgroundColor: "#FFF",
//   },

//   button: {
//     backgroundColor: "#008015",
//     marginTop: 30,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 10,
//   },

//   buttonText: {
//     color: "#FFF",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });


import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";

const AddMoneyScreen = () => {
  const navigation = useNavigation<any>();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // CUSTOM ALERT STATE
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

  // ADD MONEY
  const handleAddMoney = async () => {
    const enteredAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(enteredAmount) || enteredAmount <= 0) {
      showCustomAlert(
        "Invalid Amount",
        "Please enter a valid amount greater than zero."
      );
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        showCustomAlert(
          "Login Required",
          "Please login again to add money."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/wallet/add-money`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: enteredAmount,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        showCustomAlert(
          "Success",
          "Money added successfully.",
          "back"
        );
      } else {
        showCustomAlert(
          "Error",
          data.message || "Unable to add money. Please try again."
        );
      }
    } catch (error) {
      console.log("ADD MONEY ERROR:", error);

      showCustomAlert(
        "Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Add Money</Text>
      </View>

      {/* AMOUNT */}
      <Text style={styles.label}>Enter Amount</Text>

      <TextInput
        placeholder="₹ 0"
        placeholderTextColor="#999"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        editable={!loading}
      />

      {/* ADD MONEY BUTTON */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleAddMoney}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {loading ? "Adding Money..." : "Add Money"}
        </Text>
      </TouchableOpacity>

      {/* CUSTOM ALERT */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeCustomAlert}
      />
    </SafeAreaView>
  );
};

export default AddMoneyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontFamily: "Inter-SemiBold",
    marginLeft: 12,
    color: "#000",
  },

  label: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    marginBottom: 10,
    color: "#000",
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    fontFamily: "Inter-Regular",
    fontSize: 15,
    color: "#000",
  },

  button: {
    backgroundColor: "#008015",
    marginTop: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFF",
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
  },
});