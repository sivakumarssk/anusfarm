import React, { useCallback, useState } from "react";
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,ActivityIndicator,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API_URL } from "../config/api";

const RiderHomeScreen = () => {
  const navigation = useNavigation<any>();

  const [rider, setRider] = useState<any>(null);

  const [orders, setOrders] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // =====================================================
  // FETCH DATA WHEN SCREEN GETS FOCUS
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      fetchRiderData();
    }, [])
  );

  // =====================================================
  // CHECK WHETHER DATE IS TODAY IN INDIA
  // =====================================================

  const isToday = (dateString: string) => {
    if (!dateString) {
      return false;
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return false;
      }

      const todayIST = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      const deliveryIST = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(date);

      return todayIST === deliveryIST;
    } catch (error) {
      console.log("DATE CHECK ERROR:", error);
      return false;
    }
  };

  // =====================================================
  // FETCH RIDER DATA
  // =====================================================

  const fetchRiderData = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("riderToken");

      console.log("RIDER TOKEN:", token);

      if (!token) {
        navigation.replace("RiderLogin");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // =====================================================
      // RIDER PROFILE
      // =====================================================

      const profileResponse = await axios.get(
        `${API_URL}/api/riders/profile`,
        {
          headers,
        }
      );

      console.log(
        "RIDER HOME PROFILE:",
        profileResponse.data
      );

      if (profileResponse.data?.rider) {
        setRider(profileResponse.data.rider);
      }

      // =====================================================
      // RIDER ORDERS
      // =====================================================

      const ordersResponse = await axios.get(
        `${API_URL}/api/riders/orders`,
        {
          headers,
        }
      );

      console.log(
        "RIDER HOME ORDERS:",
        ordersResponse.data
      );

      const orderList =
        ordersResponse.data?.orders || [];

      console.log(
        "RIDER ORDER COUNT:",
        orderList.length
      );

      setOrders(orderList);

      // =====================================================
      // RIDER SUBSCRIPTION DELIVERIES
      // =====================================================

      const subscriptionResponse =
        await axios.get(
          `${API_URL}/api/riders/subscription-deliveries`,
          {
            headers,
          }
        );

      console.log(
        "RIDER HOME SUBSCRIPTIONS:",
        JSON.stringify(
          subscriptionResponse.data,
          null,
          2
        )
      );

      const subscriptionList =
        subscriptionResponse.data?.deliveries || [];

      console.log(
        "TOTAL SUBSCRIPTION DELIVERIES:",
        subscriptionList.length
      );

      if (subscriptionList.length > 0) {
        console.log(
          "SUBSCRIPTION FIRST ITEM:",
          JSON.stringify(
            subscriptionList[0],
            null,
            2
          )
        );

        console.log(
          "SUBSCRIPTION DELIVERY_DATE:",
          subscriptionList[0]?.delivery_date
        );

        console.log(
          "SUBSCRIPTION DELIVERY_STATUS:",
          subscriptionList[0]?.delivery_status
        );
      }

      setSubscriptions(subscriptionList);
    } catch (error: any) {
      console.log(
        "RIDER HOME ERROR:",
        error.response?.data || error.message
      );

      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("riderToken");
        await AsyncStorage.removeItem("riderData");

        navigation.replace("RiderLogin");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // TODAY'S ORDERS
  // =====================================================

//   const todayOrders = orders.filter((order) => {
//     return isToday(order?.created_at);
//   });

//   const todaySubscriptions = subscriptions.filter(
//     (delivery) => {
//       return isToday(delivery?.delivery_date);
//     }
//   );
// ==========================================
// TODAY'S DATA
// ==========================================

const getLocalDateKey = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

const now = new Date();

const todayKey = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}-${String(
  now.getDate()
).padStart(2, "0")}`;

console.log("TODAY DATE:", todayKey);

const todayOrders = orders.filter((order) => {
  return getLocalDateKey(order.created_at) === todayKey;
});

const todaySubscriptions = subscriptions.filter((delivery) => {
  return (
    getLocalDateKey(delivery.delivery_date) ===
    todayKey
  );
});

console.log(
  "TODAY ORDERS:",
  todayOrders.length
);

console.log(
  "TODAY SUBSCRIPTIONS:",
  todaySubscriptions.length
);

  // =====================================================
  // DEBUG TODAY DATA
  // =====================================================

  console.log(
    "TODAY ORDERS:",
    todayOrders.length
  );

  console.log(
    "TODAY SUBSCRIPTIONS:",
    todaySubscriptions.length
  );

  // =====================================================
  // PENDING ORDERS
  // =====================================================

  const pendingOrders = todayOrders.filter(
    (order) => {
      return order?.status !== "Delivered";
    }
  );

  // =====================================================
  // PENDING SUBSCRIPTIONS
  // Delivered and Skipped are NOT pending
  // =====================================================

  const pendingSubscriptions =
    todaySubscriptions.filter(
      (delivery) => {
        return ![
          "Delivered",
          "Skipped",
        ].includes(
          delivery?.delivery_status
        );
      }
    );

  // =====================================================
  // DELIVERED ORDERS
  // =====================================================

  const deliveredOrders = todayOrders.filter(
    (order) => {
      return order?.status === "Delivered";
    }
  );

  // =====================================================
  // DELIVERED SUBSCRIPTIONS
  // =====================================================

  const deliveredSubscriptions =
    todaySubscriptions.filter(
      (delivery) => {
        return (
          delivery?.delivery_status ===
          "Delivered"
        );
      }
    );

  // =====================================================
  // TOTAL
  // =====================================================

  const totalToday =
    todayOrders.length +
    todaySubscriptions.length;

  const totalPending =
    pendingOrders.length +
    pendingSubscriptions.length;

  const totalDelivered =
    deliveredOrders.length +
    deliveredSubscriptions.length;

  // =====================================================
  // DEBUG FINAL COUNTS
  // =====================================================

  console.log(
    "PENDING ORDERS:",
    pendingOrders.length
  );

  console.log(
    "PENDING SUBSCRIPTIONS:",
    pendingSubscriptions.length
  );

  console.log(
    "DELIVERED ORDERS:",
    deliveredOrders.length
  );

  console.log(
    "DELIVERED SUBSCRIPTIONS:",
    deliveredSubscriptions.length
  );

  console.log(
    "TOTAL TODAY:",
    totalToday
  );

  console.log(
    "TOTAL PENDING:",
    totalPending
  );

  console.log(
    "TOTAL DELIVERED:",
    totalDelivered
  );

  // =====================================================
  // ONLINE / OFFLINE STATUS
  // =====================================================

  const toggleStatus = async () => {
    try {
      setUpdatingStatus(true);

      const token =
        await AsyncStorage.getItem("riderToken");

      if (!token) {
        navigation.replace("RiderLogin");
        return;
      }

      const newStatus =
        rider?.status === "Online"
          ? "Offline"
          : "Online";

      console.log(
        "CHANGING RIDER STATUS:",
        newStatus
      );

      const response = await axios.put(
        `${API_URL}/api/riders/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "STATUS RESPONSE:",
        response.data
      );

      if (response.data?.rider) {
        setRider(response.data.rider);
      }
    } catch (error: any) {
      console.log(
        "STATUS ERROR:",
        error.response?.data || error.message
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(
        "riderToken"
      );

      await AsyncStorage.removeItem(
        "riderData"
      );

      navigation.replace("RiderLogin");
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading rider dashboard...
        </Text>
      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.smallText}>
            Welcome
          </Text>

          <Text style={styles.title}>
            {rider?.name || "Rider"}
          </Text>

          <Text style={styles.vehicle}>
            {rider?.vehicle_type || ""}
            {" • "}
            {rider?.vehicle_number || ""}
          </Text>
        </View>

        {/* ONLINE / OFFLINE */}

        <TouchableOpacity
          style={[
            styles.statusButton,
            rider?.status === "Online"
              ? styles.onlineButton
              : styles.offlineButton,
          ]}
          onPress={toggleStatus}
          disabled={updatingStatus}
        >
          <View
            style={[
              styles.statusDot,
              rider?.status === "Online"
                ? styles.onlineDot
                : styles.offlineDot,
            ]}
          />

          <Text
            style={[
              styles.statusText,
              rider?.status === "Online"
                ? styles.onlineText
                : styles.offlineText,
            ]}
          >
            {updatingStatus
              ? "..."
              : rider?.status || "Offline"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================================================= */}
      {/* TODAY TITLE */}
      {/* ================================================= */}

      <Text style={styles.sectionTitle}>
        Today's Deliveries
      </Text>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <View style={styles.statsRow}>
  {/* ORDERS CARD */}
  <TouchableOpacity
    style={styles.statCard}
    onPress={() => navigation.navigate("RiderOrders")}
    activeOpacity={0.7}
  >
    <Text style={styles.statNumber}>
      {todayOrders.length}
    </Text>

    <Text style={styles.statTitle}>
      Orders
    </Text>

    <Text style={styles.statSubtitle}>
      {pendingOrders.length} pending
    </Text>
  </TouchableOpacity>

  {/* SUBSCRIPTIONS CARD */}
  <TouchableOpacity
    style={styles.statCard}
    onPress={() =>
      navigation.navigate("RiderSubscriptionDeliveries")
    }
    activeOpacity={0.7}
  >
    <Text style={styles.statNumber}>
      {todaySubscriptions.length}
    </Text>

    <Text style={styles.statTitle}>
      Subscriptions
    </Text>

    <Text style={styles.statSubtitle}>
      {pendingSubscriptions.length} pending
    </Text>
  </TouchableOpacity>
</View>

      {/* ================================================= */}
      {/* PROGRESS CARD */}
      {/* ================================================= */}

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>
          Today's Progress
        </Text>

        <View style={styles.progressRow}>
          {/* PENDING */}

          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>
              {totalPending}
            </Text>

            <Text style={styles.progressLabel}>
              Pending
            </Text>
          </View>

          <View style={styles.divider} />

          {/* DELIVERED */}

          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>
              {totalDelivered}
            </Text>

            <Text style={styles.progressLabel}>
              Delivered
            </Text>
          </View>

          <View style={styles.divider} />

          {/* TOTAL */}

          <View style={styles.progressItem}>
            <Text style={styles.progressNumber}>
              {totalToday}
            </Text>

            <Text style={styles.progressLabel}>
              Total
            </Text>
          </View>
        </View>
      </View>

      {/* ================================================= */}
      {/* ORDERS BUTTON */}
      {/* ================================================= */}

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() =>
          navigation.navigate(
            "RiderOrders"
          )
        }
      >
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>
            O
          </Text>
        </View>

        <View style={styles.mainButtonContent}>
          <Text style={styles.mainButtonTitle}>
            Assigned Orders
          </Text>

          <Text style={styles.mainButtonSubtitle}>
            {todayOrders.length} orders today
          </Text>
        </View>

        <Text style={styles.arrow}>
          →
        </Text>
      </TouchableOpacity>

      {/* ================================================= */}
      {/* SUBSCRIPTIONS BUTTON */}
      {/* ================================================= */}

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() =>
          navigation.navigate(
            "RiderSubscriptionDeliveries"
          )
        }
      >
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>
            S
          </Text>
        </View>

        <View style={styles.mainButtonContent}>
          <Text style={styles.mainButtonTitle}>
            Subscription Deliveries
          </Text>

          <Text style={styles.mainButtonSubtitle}>
            {todaySubscriptions.length} deliveries today
          </Text>
        </View>

        <Text style={styles.arrow}>
          →
        </Text>
      </TouchableOpacity>

      {/* ================================================= */}
      {/* DELIVERY SUMMARY */}
      {/* ================================================= */}

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Delivery Summary
        </Text>

        {/* PENDING ORDERS */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Pending Orders
          </Text>

          <Text style={styles.infoValue}>
            {pendingOrders.length}
          </Text>
        </View>

        {/* PENDING SUBSCRIPTIONS */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Pending Subscriptions
          </Text>

          <Text style={styles.infoValue}>
            {pendingSubscriptions.length}
          </Text>
        </View>

        {/* COMPLETED */}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            Completed Today
          </Text>

          <Text style={styles.infoValue}>
            {totalDelivered}
          </Text>
        </View>
      </View>

      {/* ================================================= */}
      {/* LOGOUT */}
      {/* ================================================= */}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RiderHomeScreen;

// =====================================================
// STYLES
// =====================================================


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
    fontFamily: "InterRegular",
  },

  header: {
    marginTop: 35,
    marginBottom: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  smallText: {
    fontSize: 13,
    color: "#777",
    fontFamily: "InterRegular",
  },

  title: {
    fontSize: 26,
    fontFamily: "InterBold",
    color: "#000",
    marginTop: 2,
  },

  vehicle: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    fontFamily: "InterRegular",
  },

  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  onlineButton: {
    backgroundColor: "#E8F5E9",
    borderColor: "#0A8A2A",
  },

  offlineButton: {
    backgroundColor: "#FFF0F0",
    borderColor: "#E53935",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  onlineDot: {
    backgroundColor: "#0A8A2A",
  },

  offlineDot: {
    backgroundColor: "#E53935",
  },

  statusText: {
    fontSize: 13,
    fontFamily: "InterBold",
  },

  onlineText: {
    color: "#0A8A2A",
  },

  offlineText: {
    color: "#E53935",
  },

  sectionTitle: {
    fontSize: 20,
    fontFamily: "InterBold",
    marginBottom: 15,
    color: "#000",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  statNumber: {
    fontSize: 30,
    fontFamily: "InterBold",
    color: "#0A8A2A",
  },

  statTitle: {
    fontSize: 14,
    fontFamily: "InterSemiBold",
    color: "#000",
    marginTop: 6,
  },

  statSubtitle: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
    fontFamily: "InterRegular",
  },

  progressCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  progressTitle: {
    fontSize: 16,
    fontFamily: "InterBold",
    marginBottom: 18,
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },

  progressItem: {
    alignItems: "center",
    flex: 1,
  },

  progressNumber: {
    fontSize: 22,
    fontFamily: "InterBold",
    color: "#0A8A2A",
  },

  progressLabel: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
    fontFamily: "InterRegular",
  },

  divider: {
    width: 1,
    height: 35,
    backgroundColor: "#E5E5E5",
  },

  mainButton: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  iconText: {
    fontSize: 18,
    fontFamily: "InterBold",
    color: "#0A8A2A",
  },

  mainButtonContent: {
    flex: 1,
    marginLeft: 12,
  },

  mainButtonTitle: {
    fontSize: 16,
    fontFamily: "InterBold",
    color: "#000",
  },

  mainButtonSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
    fontFamily: "InterRegular",
  },

  arrow: {
    fontSize: 24,
    color: "#0A8A2A",
    fontFamily: "InterRegular",
  },

  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  infoTitle: {
    fontSize: 16,
    fontFamily: "InterBold",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  infoLabel: {
    fontSize: 13,
    color: "#666",
    fontFamily: "InterRegular",
  },

  infoValue: {
    fontSize: 14,
    fontFamily: "InterBold",
    color: "#0A8A2A",
  },

  logoutButton: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 40,
  },

  logoutText: {
    color: "#E53935",
    fontSize: 15,
    fontFamily: "InterSemiBold",
  },
});
