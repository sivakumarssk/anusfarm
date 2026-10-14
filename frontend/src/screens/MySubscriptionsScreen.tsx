import React, { useEffect, useState } from "react";
import {View,Text,FlatList,TouchableOpacity, StyleSheet,Alert,Modal,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";
export default function MySubscriptionsScreen() {
  const navigation = useNavigation<any>();

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [pauseModal, setPauseModal] = useState(false);

  const [selectedSubscription, setSelectedSubscription] =
    useState<number | null>(null);

  const [pauseFrom, setPauseFrom] = useState(new Date());
  const [pauseTo, setPauseTo] = useState(new Date());

  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");
const [alertConfirmAction, setAlertConfirmAction] =
  useState<(() => void) | null>(null);
const [alertCancelText, setAlertCancelText] = useState<string | undefined>(
  undefined
);
const [alertButtonText, setAlertButtonText] = useState("OK");

const showCustomAlert = (
  title: string,
  message: string,
  onConfirm?: () => void,
  cancelText?: string,
  buttonText = "OK"
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertConfirmAction(() => onConfirm ?? null);
  setAlertCancelText(cancelText);
  setAlertButtonText(buttonText);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);
  setAlertConfirmAction(null);
  setAlertCancelText(undefined);
};

const confirmCustomAlert = () => {
  const action = alertConfirmAction;
  closeCustomAlert();
  action?.();
};
  useEffect(() => {
    loadSubscriptions();
  }, []);

  // ==============================
  // GET SUBSCRIPTIONS
  // ==============================

  const loadSubscriptions = async () => {
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

      console.log(
        "MY SUBSCRIPTIONS API:",
        JSON.stringify(json, null, 2)
      );

      if (json.success) {
        setSubscriptions(json.subscriptions);
      }
    } catch (error) {
      console.log("GET SUBSCRIPTIONS ERROR:", error);
    }
  };

  // ==============================
  // OPEN SUBSCRIPTION DETAILS
  // ==============================

const openSubscriptionDetails = (id: number) => {
  console.log("OPEN SUBSCRIPTION DETAILS:", id);

  navigation.navigate("SubscriptionDetails" as never, {
    subscriptionId: id,
  } as never);
};
  // ==============================
  // PAUSE
  // ==============================

  const pauseSubscription = (id: number) => {
    setSelectedSubscription(id);
    setPauseModal(true);
  };

  const confirmPause = async () => {
    if (!selectedSubscription) return;

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/subscriptions/${selectedSubscription}/pause`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pause_from:
              pauseFrom.toISOString().split("T")[0],

            pause_to:
              pauseTo.toISOString().split("T")[0],
          }),
        }
      );

      const json = await res.json();

      console.log(
        "PAUSE RESPONSE:",
        json
      );

      setPauseModal(false);

     if (json.success) {
  showCustomAlert("Success", "Subscription Paused");
  loadSubscriptions();
} else {
  showCustomAlert(
    "Error",
    json.message || "Unable to pause subscription"
  );
}
    } catch (error) {
      console.log(
        "PAUSE ERROR:",
        error
      );
showCustomAlert("Error", "Something went wrong");
    }
  };

  // ==============================
  // RESUME
  // ==============================

  const resumeSubscription = async (
    id: number
  ) => {
    try {
      const token =
        await AsyncStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/subscriptions/${id}/resume`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const json = await res.json();

      console.log(
        "RESUME RESPONSE:",
        json
      );

      if (json.success) {
  showCustomAlert("Success", "Subscription Resumed");
  loadSubscriptions();
} else {
  showCustomAlert(
    "Error",
    json.message || "Unable to resume subscription"
  );
}
    } catch (error) {
      console.log(
        "RESUME ERROR:",
        error
      );
    }
  };

  // ==============================
  // CANCEL
  // ==============================

  const cancelSubscription = async (
    id: number
  ) => {
    try {
      const token =
        await AsyncStorage.getItem("token");

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

      console.log(
        "CANCEL RESPONSE:",
        json
      );

      if (json.success) {
  showCustomAlert("Success", "Subscription Cancelled");
  loadSubscriptions();
} else {
  showCustomAlert(
    "Error",
    json.message || "Unable to cancel subscription"
  );
}
    } catch (error) {
      console.log(
        "CANCEL ERROR:",
        error
      );
    }
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <>
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

      <Text style={styles.headerTitle}>
        My Subscriptions
      </Text>
    </View>
      <FlatList
        data={subscriptions}
        keyExtractor={(item: any) =>
          item.id.toString()
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        renderItem={({ item }: any) => (
          <View style={styles.card}>

            {/* CLICK THIS AREA TO OPEN DETAILS */}

            <TouchableOpacity
              onPress={() =>
                openSubscriptionDetails(
                  item.id
                )
              }
              activeOpacity={0.7}
            >
              <Text style={styles.title}>
                {item.plan}
              </Text>

              <Text style={styles.info}>
                Frequency : {item.frequency}
              </Text>

              <Text style={styles.info}>
                Delivery Time :{" "}
                {item.delivery_time}
              </Text>

              <Text style={styles.info}>
                Next Delivery :{" "}
                {item.next_delivery_date}
              </Text>

              <Text style={styles.info}>
                Status :{" "}
                <Text
                  style={
                    item.status
                      ?.toLowerCase() ===
                    "active"
                      ? styles.active
                      : item.status
                          ?.toLowerCase() ===
                        "paused"
                      ? styles.paused
                      : styles.cancelled
                  }
                >
                  {item.status}
                </Text>
              </Text>

              <Text style={styles.viewDetails}>
                Tap to view subscription details →
              </Text>
            </TouchableOpacity>

            {/* ACTIVE BUTTONS */}

            {item.status?.toLowerCase() ===
              "active" && (
              <>
                <TouchableOpacity
                  style={styles.pause}
                  onPress={() =>
                    pauseSubscription(
                      item.id
                    )
                  }
                >
                  <Text style={styles.btnText}>
                    Pause
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancel}
                  onPress={() =>
  showCustomAlert(
    "Cancel Subscription",
    "Are you sure you want to cancel?",
    () => cancelSubscription(item.id),
    "No",
    "Yes"
  )
}
                >
                  <Text style={styles.btnText}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* PAUSED */}

            {item.status?.toLowerCase() ===
              "paused" && (
              <TouchableOpacity
                style={styles.resume}
                onPress={() =>
                  resumeSubscription(
                    item.id
                  )
                }
              >
                <Text style={styles.btnText}>
                  Resume
                </Text>
              </TouchableOpacity>
            )}

            {/* CANCELLED */}

            {item.status?.toLowerCase() ===
              "cancelled" && (
              <Text
                style={styles.cancelledText}
              >
                Subscription Cancelled
              </Text>
            )}
          </View>
        )}
      />

      {/* ==============================
          PAUSE MODAL
      ============================== */}

      <Modal
        visible={pauseModal}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setPauseModal(false)
        }
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>
              Pause Subscription
            </Text>

            <Text style={{ fontFamily: "Inter-Regular" }}>
  Pause From
</Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() =>
                setShowFromPicker(true)
              }
            >
              <Text style={{ fontFamily: "Inter-Regular" }}>
  {pauseFrom.toDateString()}
</Text>
            </TouchableOpacity>

            {showFromPicker && (
              <DateTimePicker
                value={pauseFrom}
                mode="date"
                onChange={(
                  event,
                  date
                ) => {
                  setShowFromPicker(false);

                  if (date) {
                    setPauseFrom(date);
                  }
                }}
              />
            )}

           <Text style={{ fontFamily: "Inter-Regular" }}>
              Pause To
            </Text>

            <TouchableOpacity
              style={styles.dateButton}
              onPress={() =>
                setShowToPicker(true)
              }
            >
              <Text style={{ fontFamily: "Inter-Regular" }}>
                {pauseTo.toDateString()}
              </Text>
            </TouchableOpacity>

            {showToPicker && (
              <DateTimePicker
                value={pauseTo}
                mode="date"
                onChange={(
                  event,
                  date
                ) => {
                  setShowToPicker(false);

                  if (date) {
                    setPauseTo(date);
                  }
                }}
              />
            )}

            <TouchableOpacity
              style={styles.confirm}
              onPress={confirmPause}
            >
              <Text style={styles.btnText}>
                Confirm Pause
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancel}
              onPress={() =>
                setPauseModal(false)
              }
            >
              <Text style={styles.btnText}>
                Cancel
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
      <CustomAlert
  visible={alertVisible}
  title={alertTitle}
  message={alertMessage}
  buttonText={alertButtonText}
  cancelText={alertCancelText}
  onClose={closeCustomAlert}
  onConfirm={confirmCustomAlert}
/>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 15,
  paddingTop: 50,
  paddingBottom: 15,
  // backgroundColor: "#fff",
},

backButton: {
  marginRight: 15,
},

headerTitle: {
  fontSize: 16,
  fontFamily: "Inter-Bold",
},
  card: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 4,
    marginTop:30
    
  },

 title: {
  fontSize: 14,
  fontFamily: "Inter-Bold",
  marginBottom: 10,
},

  info: {
  marginBottom: 6,
  fontFamily: "Inter-Regular",
  fontSize:13
},

 active: {
  color: "green",
  fontFamily: "Inter-Bold",
},

 paused: {
  color: "orange",
  fontFamily: "Inter-Bold",
},

 cancelled: {
  color: "red",
  fontFamily: "Inter-Bold",
},

 viewDetails: {
  color: "#673AB7",
  fontFamily: "Inter-Bold",
  marginTop: 12,
  marginBottom: 5,
  fontSize:11
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
  fontFamily: "Inter-Bold",
},
  cancelledText: {
  color: "red",
  fontFamily: "Inter-Bold",
  marginTop: 10,
},

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor:
      "rgba(0,0,0,0.5)",
  },

  modalBox: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 15,
  },

 modalTitle: {
  fontSize: 18,
  fontFamily: "Inter-Bold",
  marginBottom: 20,
},

  dateButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },

  confirm: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
});