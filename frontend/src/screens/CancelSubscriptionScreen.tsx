// import React from "react";
// import {View,Text,StyleSheet,TouchableOpacity,Alert,} from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import {API_URL} from "../config/api";

// export default function CancelSubscriptionScreen() {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();

//   const { id } = route.params;

//   const cancelSubscription = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       const res = await fetch(`${API_URL}/api/subscriptions/${id}/cancel`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const json = await res.json();

//       if (json.success) {
//         Alert.alert(
//           "Success",
//           "Subscription Cancelled",
//           [
//             {
//               text: "OK",
//               onPress: () => navigation.navigate("MySubscriptions"),
//             },
//           ]
//         );
//       } else {
//         Alert.alert(json.message);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>

//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} />
//         </TouchableOpacity>

//         <Text style={styles.title}>
//           Cancel Subscription
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Ionicons
//           name="warning"
//           size={70}
//           color="#f44336"
//         />

//         <Text style={styles.heading}>
//           Are you sure?
//         </Text>

//         <Text style={styles.message}>
//           Once cancelled, your future milk deliveries
//           will stop immediately.
//         </Text>

//         <TouchableOpacity
//           style={styles.cancelButton}
//           onPress={cancelSubscription}
//         >
//           <Text style={styles.buttonText}>
//             Yes, Cancel Subscription
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.keepButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={styles.keepText}>
//             Keep Subscription
//           </Text>
//         </TouchableOpacity>

//       </View>

//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F7F7",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginLeft: 12,
//   },

//   card: {
//     margin: 20,
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 25,
//     alignItems: "center",
//   },

//   heading: {
//     fontSize: 24,
//     fontWeight: "700",
//     marginTop: 15,
//   },

//   message: {
//     marginTop: 15,
//     textAlign: "center",
//     color: "#666",
//     lineHeight: 22,
//   },

//   cancelButton: {
//     width: "100%",
//     marginTop: 35,
//     backgroundColor: "#f44336",
//     padding: 15,
//     borderRadius: 10,
//   },

//   keepButton: {
//     width: "100%",
//     marginTop: 15,
//     borderWidth: 1,
//     borderColor: "#2E7D32",
//     padding: 15,
//     borderRadius: 10,
//   },

//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "700",
//   },

//   keepText: {
//     textAlign: "center",
//     color: "#2E7D32",
//     fontWeight: "700",
//   },
// });

import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";

export default function CancelSubscriptionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { id } = route.params;

  const [loading, setLoading] = useState(false);

  // CUSTOM ALERT STATE
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState<"none" | "subscriptions">("none");

  const showCustomAlert = (
    title: string,
    message = "",
    action: "none" | "subscriptions" = "none"
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

    if (action === "subscriptions") {
      navigation.navigate("MySubscriptions");
    }
  };

  // CANCEL SUBSCRIPTION
  const cancelSubscription = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        showCustomAlert(
          "Login Required",
          "Please login again to cancel your subscription."
        );
        return;
      }

      const res = await fetch(
        `${API_URL}/api/subscriptions/${id}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      if (res.ok && json.success) {
        showCustomAlert(
          "Success",
          "Subscription cancelled successfully.",
          "subscriptions"
        );
      } else {
        showCustomAlert(
          "Error",
          json.message || "Unable to cancel subscription. Please try again."
        );
      }
    } catch (error) {
      console.log("CANCEL SUBSCRIPTION ERROR:", error);

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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Cancel Subscription
        </Text>
      </View>

      {/* CANCELLATION CARD */}
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

        {/* CANCEL BUTTON */}
        <TouchableOpacity
          style={[
            styles.cancelButton,
            loading && styles.disabledButton,
          ]}
          onPress={cancelSubscription}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Cancelling..."
              : "Yes, Cancel Subscription"}
          </Text>
        </TouchableOpacity>

        {/* KEEP SUBSCRIPTION BUTTON */}
        <TouchableOpacity
          style={styles.keepButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.keepText}>
            Keep Subscription
          </Text>
        </TouchableOpacity>
      </View>

      {/* CUSTOM ALERT */}
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
    fontFamily: "Inter-Bold",
    marginLeft: 12,
    color: "#000",
  },

  card: {
    margin: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
  },

  heading: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginTop: 15,
    color: "#000",
  },

  message: {
    marginTop: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },

  cancelButton: {
    width: "100%",
    marginTop: 35,
    backgroundColor: "#f44336",
    padding: 15,
    borderRadius: 10,
  },

  disabledButton: {
    opacity: 0.6,
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
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Inter-Bold",
    fontSize: 14,
  },

  keepText: {
    textAlign: "center",
    color: "#2E7D32",
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
  },
});