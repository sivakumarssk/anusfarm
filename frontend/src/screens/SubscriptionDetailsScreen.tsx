import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const BASE_URL = "http://192.168.0.112:5000/api";

export default function SubscriptionDetailsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { subscriptionId } = route.params;

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    getSubscription();
  }, []);

  const getSubscription = async () => {
    try {
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
        const item = json.subscriptions.find(
          (x: any) => x.id == subscriptionId
        );

        setSubscription(item);
      }
    } catch (e) {
      console.log(e);
    }

    setLoading(false);
  };

  const pauseSubscription = async () => {
    navigation.navigate("PauseSubscription", {
      id: subscription.id,
    });
  };

  const resumeSubscription = async () => {
    const token = await AsyncStorage.getItem("token");

    await fetch(
      `${BASE_URL}/subscriptions/${subscription.id}/resume`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    Alert.alert("Success", "Subscription resumed");

    getSubscription();
  };
        const cancelSubscription = () => {
  navigation.navigate("CancelSubscription", {
    id: subscription.id,
  });
};      
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!subscription) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>No Subscription Found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Subscription Details
          </Text>
        </View>

        <View style={styles.card}>

          <Text style={styles.heading}>
            {subscription.plan}
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>
              Frequency
            </Text>

            <Text style={styles.value}>
              {subscription.frequency}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Delivery Time
            </Text>

            <Text style={styles.value}>
              {subscription.delivery_time}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Next Delivery
            </Text>

            <Text style={styles.value}>
              {subscription.next_delivery_date}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Status
            </Text>

            <Text
              style={[
                styles.status,
                subscription.status === "Active"
                  ? styles.active
                  : subscription.status ===
                    "Paused"
                  ? styles.paused
                  : styles.cancelled,
              ]}
            >
              {subscription.status}
            </Text>
          </View>

          <Text style={styles.productHeading}>
            Products
          </Text>

          {subscription.items?.map(
            (item: any) => (
              <View
                key={item.id}
                style={styles.productRow}
              >
                <Text>
                  {item.product_name}
                </Text>

                <Text>
                  Qty {item.quantity}
                </Text>
              </View>
            )
          )}
          <View style={styles.buttonContainer}>
          {subscription.status === "Active" && (
            <>
              <TouchableOpacity
                style={styles.pauseButton}
                onPress={pauseSubscription}>
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate("EditSubscription", {
                    id: subscription.id,
                  })
                }>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelSubscription}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
style={styles.calendarButton}
onPress={() =>
navigation.navigate(
"DeliveryCalendar",
{
id: subscription.id
}
)
}
>

<Text style={styles.buttonText}>
Delivery Calendar
</Text>

</TouchableOpacity>

                    {subscription.status === "Paused" && (
            <TouchableOpacity
              style={styles.resumeButton}
              onPress={resumeSubscription}
            >
              <Text style={styles.buttonText}>
                Resume
              </Text>
            </TouchableOpacity>
          )}

        </View>

      </View>

      </ScrollView>
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
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },

  label: {
    fontSize: 15,
    color: "#555",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
  },

  status: {
    fontWeight: "700",
  },

  active: {
    color: "green",
  },

  paused: {
    color: "orange",
  },

  cancelled: {
    color: "red",
  },

  productHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },

  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  buttonContainer: {
    marginTop: 25,
  },

  pauseButton: {
    backgroundColor: "#ff9800",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  resumeButton: {
    backgroundColor: "#4caf50",
    padding: 14,
    borderRadius: 10,
  },

  editButton: {
    backgroundColor: "#2196f3",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: "#f44336",
    padding: 14,
    borderRadius: 10,
  },
  calendarButton: {
  backgroundColor: "#673AB7",
  padding: 14,
  borderRadius: 10,
  marginBottom: 10,
},

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});

