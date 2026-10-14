import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../config/api";
import { Ionicons } from "@expo/vector-icons";
const RiderSubscriptionDeliveriesScreen = () => {
  const navigation = useNavigation<any>();
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH SUBSCRIPTION DELIVERIES
  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("riderToken");

      if (!token) {
        Alert.alert(
          "Login Required",
          "Rider token not found."
        );
        return;
      }

      const response = await axios.get(
        `${API_URL}/api/riders/subscription-deliveries`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const deliveryList =
          response.data.deliveries || [];

        setDeliveries(deliveryList);
      } else {
        Alert.alert(
          "Error",
          response.data.message ||
            "Unable to load deliveries"
        );
      }
    } catch (error: any) {
      console.log(
        "SUBSCRIPTION DELIVERY ERROR:",
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to load subscription deliveries"
      );
    } finally {
      setLoading(false);
    }
  };

  // LOAD
  useEffect(() => {
    fetchDeliveries();
  }, []);

  // OPEN DETAILS
  const openDeliveryDetails = (
    delivery: any
  ) => {
    if (
      delivery?.delivery_id === undefined ||
      delivery?.delivery_id === null
    ) {
      Alert.alert(
        "Error",
        "Delivery ID is missing"
      );
      return;
    }

    const deliveryId = Number(
      delivery.delivery_id
    );

    if (isNaN(deliveryId)) {
      Alert.alert(
        "Error",
        "Invalid delivery ID"
      );
      return;
    }

    navigation.navigate(
      "RiderSubscriptionDeliveryDetails",
      {
        deliveryId: deliveryId,
      }
    );
  };

  // LOADING
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#0A8A2A"
        />

        <Text style={styles.loadingText}>
          Loading deliveries...
        </Text>
      </View>
    );
  }

  // SCREEN
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
  <View style={styles.header}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons
      name="arrow-back"
      size={24}
      color="#000"
    />
  </TouchableOpacity>

  <Text style={styles.title}>
    Subscription Deliveries
  </Text>
</View>
      

      {deliveries.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            No subscription deliveries
          </Text>
        </View>
      ) : (
        deliveries.map(
          (delivery: any) => (
            <TouchableOpacity
              key={String(
                delivery.delivery_id
              )}
              style={styles.card}
              activeOpacity={0.7}
              onPress={() =>
                openDeliveryDetails(
                  delivery
                )
              }
            >
              {/* PLAN */}

              <View
                style={styles.cardHeader}
              >
                <Text
                  style={styles.plan}
                >
                  {delivery.plan ||
                    "Subscription"}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    delivery.delivery_status ===
                    "Delivered"
                      ? styles.deliveredBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      delivery.delivery_status ===
                      "Delivered"
                        ? styles.deliveredText
                        : styles.pendingText,
                    ]}
                  >
                    {delivery.delivery_status ||
                      "Pending"}
                  </Text>
                </View>
              </View>

              {/* DELIVERY ID */}

              <Text style={styles.deliveryId}>
                Delivery #
                {delivery.delivery_id}
              </Text>

              {/* CUSTOMER */}

              <Text style={styles.info}>
                Customer:{" "}
                <Text
                  style={styles.bold}
                >
                  {delivery.customer_name ||
                    "N/A"}
                </Text>
              </Text>

              {/* PHONE */}

              <Text style={styles.info}>
                Phone:{" "}
                <Text
                  style={styles.bold}
                >
                  {delivery.customer_phone ||
                    "N/A"}
                </Text>
              </Text>

              {/* FREQUENCY */}

              <Text style={styles.info}>
                Frequency:{" "}
                <Text
                  style={styles.bold}
                >
                  {delivery.frequency ||
                    "N/A"}
                </Text>
              </Text>

              {/* DELIVERY TIME */}

              <Text style={styles.info}>
                Delivery Time:{" "}
                <Text
                  style={styles.bold}
                >
                  {delivery.delivery_time ||
                    "N/A"}
                </Text>
              </Text>

              {/* DATE */}

              <Text style={styles.info}>
                Date:{" "}
                <Text
                  style={styles.bold}
                >
                  {delivery.delivery_date
                    ? new Date(
                        delivery.delivery_date
                      ).toLocaleDateString()
                    : "N/A"}
                </Text>
              </Text>

              {/* PRODUCTS */}

              {delivery.products &&
              delivery.products.length >
                0 ? (
                <View
                  style={
                    styles.productsPreview
                  }
                >
                  <Text
                    style={
                      styles.productsTitle
                    }
                  >
                    Products:
                  </Text>

                  {delivery.products.map(
                    (
                      product: any,
                      index: number
                    ) => (
                      <Text
                        key={`${product.product_id}-${index}`}
                        style={
                          styles.productText
                        }
                      >
                        •{" "}
                        {product.product_name ||
                          "Product"}{" "}
                        ×{" "}
                        {product.quantity ||
                          1}
                      </Text>
                    )
                  )}
                </View>
              ) : null}

              {/* VIEW DETAILS */}

              <Text
                style={
                  styles.viewDetails
                }
              >
                View Details →
              </Text>
            </TouchableOpacity>
          )
        )
      )}

      <View
        style={styles.bottomSpace}
      />
    </ScrollView>
  );
};

export default RiderSubscriptionDeliveriesScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
    fontFamily: "InterRegular",
    fontSize: 14,
  },
header: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
  marginTop:15
},

backButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

title: {
  flex: 1,
  fontSize: 15,
  fontFamily: "InterBold",
  color: "#000",
},
  

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  plan: {
    flex: 1,
    fontSize: 17,
    fontFamily: "InterBold",
    color: "#000",
    marginRight: 10,
  },

  deliveryId: {
    fontSize: 13,
    fontFamily: "InterRegular",
    color: "#777",
    marginBottom: 12,
  },

  info: {
    fontSize: 14,
    fontFamily: "InterRegular",
    color: "#555",
    marginBottom: 8,
  },

  bold: {
    color: "#000",
    fontFamily: "InterSemiBold",
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  pendingBadge: {
    backgroundColor: "#FFF3CD",
  },

  deliveredBadge: {
    backgroundColor: "#E8F5E9",
  },

  statusText: {
    fontSize: 11,
    fontFamily: "InterBold",
  },

  pendingText: {
    color: "#856404",
  },

  deliveredText: {
    color: "#0A8A2A",
  },

  productsPreview: {
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  productsTitle: {
    fontSize: 13,
    fontFamily: "InterBold",
    color: "#000",
    marginBottom: 5,
  },

  productText: {
    fontSize: 13,
    fontFamily: "InterRegular",
    color: "#555",
    marginBottom: 3,
  },

  viewDetails: {
    marginTop: 14,
    color: "#0A8A2A",
    fontSize: 14,
    fontFamily: "InterBold",
    textAlign: "right",
  },

  empty: {
    backgroundColor: "#FFF",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
  },

  emptyText: {
    color: "#777",
    fontSize: 15,
    fontFamily: "InterRegular",
  },

  bottomSpace: {
    height: 30,
  },
 
});