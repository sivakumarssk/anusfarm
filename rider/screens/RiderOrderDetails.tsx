import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from "@react-navigation/native";
import { API_URL } from "../config/api";

type Product = {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number | string;
  image?: string | null;
};

type Order = {
  id: number;
  user_id: number;
  total_amount: string | number;
  status: string;
  payment_method: string;
  created_at: string;
  address_id?: number | null;
  rider_id?: number | null;
  rider_assigned_at?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  address?: string | null;
  products?: Product[];
};

const RiderOrderDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const { orderId } = route.params || {};

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ==========================================
  // PRODUCT IMAGE
  // ==========================================

  const getProductImage = (
    image?: string | null
  ) => {
    if (!image) {
      return null;
    }

    if (image.startsWith("http")) {
      return image;
    }

    return `${API_URL}/uploads/${image}`;
  };

  // ==========================================
  // FETCH ORDER DETAILS
  // ==========================================

  const fetchOrderDetails = useCallback(
    async () => {
      try {
        setLoading(true);

        const token =
          await AsyncStorage.getItem(
            "riderToken"
          );

        if (!token) {
          Alert.alert(
            "Login Required",
            "Rider token not found."
          );
          return;
        }

        if (!orderId) {
          Alert.alert(
            "Error",
            "Order ID is missing."
          );
          return;
        }

        /*
         * IMPORTANT:
         * We use the existing /orders API and
         * find the requested order.
         *
         * This avoids needing a new backend
         * GET endpoint.
         */

        const response = await fetch(
          `${API_URL}/api/riders/orders`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        const data = await response.json();

        console.log(
          "ORDER DETAILS RESPONSE:",
          JSON.stringify(data, null, 2)
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch order"
          );
        }

        if (data.success) {
          const foundOrder =
            (data.orders || []).find(
              (item: Order) =>
                Number(item.id) ===
                Number(orderId)
            );

          if (!foundOrder) {
            Alert.alert(
              "Order Not Found",
              "This order is no longer available."
            );
            return;
          }

          setOrder(foundOrder);
        } else {
          Alert.alert(
            "Error",
            data.message ||
              "Unable to load order."
          );
        }
      } catch (error) {
        console.error(
          "FETCH ORDER DETAILS ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "Unable to load order details."
        );
      } finally {
        setLoading(false);
      }
    },
    [orderId]
  );

  // ==========================================
  // LOAD
  // ==========================================

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const updateOrderStatus = async (
    status: string
  ) => {
    try {
      setUpdating(true);

      const token =
        await AsyncStorage.getItem(
          "riderToken"
        );

      if (!token) {
        Alert.alert(
          "Login Required",
          "Rider token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/riders/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "UPDATE ORDER RESPONSE:",
        data
      );

      if (!response.ok) {
        Alert.alert(
          "Update Failed",
          data.message ||
            "Unable to update order."
        );
        return;
      }

      if (data.success) {
        Alert.alert(
          "Success",
          `Order status updated to ${status}`
        );

        await fetchOrderDetails();
      } else {
        Alert.alert(
          "Error",
          data.message ||
            "Unable to update order."
        );
      }
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  // ==========================================
  // NEXT STATUS
  // ==========================================

  const getNextStatus = () => {
    if (!order) {
      return null;
    }

    switch (order.status) {
      case "Pending":
      case "Assigned":
        return {
          status: "Accepted",
          label: "Accept Order",
        };

      case "Accepted":
        return {
          status: "Picked Up",
          label: "Mark as Picked Up",
        };

      case "Picked Up":
        return {
          status: "Out for Delivery",
          label: "Start Delivery",
        };

      case "Out for Delivery":
        return {
          status: "Delivered",
          label: "Mark as Delivered",
        };

      default:
        return null;
    }
  };

  // ==========================================
  // CALL CUSTOMER
  // ==========================================

  const callCustomer = () => {
    if (!order?.customer_phone) {
      Alert.alert(
        "Phone Unavailable",
        "Customer phone number is not available."
      );
      return;
    }

    Linking.openURL(
      `tel:${order.customer_phone}`
    );
  };

  // ==========================================
  // OPEN MAP
  // ==========================================

  const openMap = async () => {
    if (!order?.address) {
      Alert.alert(
        "Address Unavailable",
        "Customer address is not available."
      );
      return;
    }

    try {
      const encodedAddress =
        encodeURIComponent(
          order.address
        );

      const googleMapsUrl =
        `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

      const supported =
        await Linking.canOpenURL(
          googleMapsUrl
        );

      if (supported) {
        await Linking.openURL(
          googleMapsUrl
        );
      } else {
        Alert.alert(
          "Maps Unavailable",
          "Unable to open Google Maps."
        );
      }
    } catch (error) {
      console.error(
        "OPEN MAP ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to open maps."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#0A8A2A"
        />

        <Text style={styles.loadingText}>
          Loading order...
        </Text>
      </View>
    );
  }

  // ==========================================
  // ORDER NOT FOUND
  // ==========================================

  if (!order) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>
          Order not found
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={styles.backButtonText}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const nextStatus = getNextStatus();

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
    >
      {/* ======================================
          HEADER
      ====================================== */}

      <TouchableOpacity
        style={styles.backRow}
        onPress={() =>
          navigation.goBack()
        }
      >
        <Text style={styles.backArrow}>
          ←
        </Text>

        <Text style={styles.backText}>
          Orders
        </Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            Order #{order.id}
          </Text>

          <Text style={styles.createdAt}>
            {new Date(
              order.created_at
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            order.status === "Delivered"
              ? styles.deliveredBadge
              : order.status ===
                "Out for Delivery"
              ? styles.deliveryBadge
              : order.status ===
                "Accepted"
              ? styles.acceptedBadge
              : styles.pendingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              order.status === "Delivered"
                ? styles.deliveredText
                : order.status ===
                  "Out for Delivery"
                ? styles.deliveryText
                : order.status ===
                  "Accepted"
                ? styles.acceptedText
                : styles.pendingText,
            ]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      {/* ======================================
          CUSTOMER
      ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Customer Details
        </Text>

        <Text style={styles.label}>
          Name
        </Text>

        <Text style={styles.value}>
          {order.customer_name || "N/A"}
        </Text>

        <Text
          style={[
            styles.label,
            { marginTop: 12 },
          ]}
        >
          Phone
        </Text>

        <Text style={styles.value}>
          {order.customer_phone || "N/A"}
        </Text>

        {order.customer_phone && (
          <TouchableOpacity
            style={styles.callButton}
            onPress={callCustomer}
          >
            <Text
              style={styles.callButtonText}
            >
              📞 Call Customer
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ======================================
          ADDRESS
      ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Delivery Address
        </Text>

        <Text style={styles.address}>
          {order.address ||
            "Address not available"}
        </Text>

        {order.address && (
          <TouchableOpacity
            style={styles.mapButton}
            onPress={openMap}
          >
            <Text
              style={styles.mapButtonText}
            >
              📍 Open in Google Maps
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ======================================
          PRODUCTS
      ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Products
        </Text>

        {order.products &&
        order.products.length > 0 ? (
          order.products.map(
            (product, index) => {
              const imageUrl =
                getProductImage(
                  product.image
                );

              return (
                <View
                  key={`${product.product_id}-${index}`}
                  style={styles.productRow}
                >
                  {imageUrl ? (
                    <Image
                      source={{
                        uri: imageUrl,
                      }}
                      style={
                        styles.productImage
                      }
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={
                        styles.noImage
                      }
                    >
                      <Text
                        style={
                          styles.noImageText
                        }
                      >
                        No Image
                      </Text>
                    </View>
                  )}

                  <View
                    style={styles.productInfo}
                  >
                    <Text
                      style={
                        styles.productName
                      }
                    >
                      {product.product_name}
                    </Text>

                    <Text
                      style={
                        styles.productQuantity
                      }
                    >
                      Quantity:{" "}
                      {product.quantity}
                    </Text>
                  </View>

                  <Text
                    style={
                      styles.productPrice
                    }
                  >
                    ₹
                    {Number(
                      product.price
                    ).toFixed(2)}
                  </Text>
                </View>
              );
            }
          )
        ) : (
          <Text style={styles.noProducts}>
            No products
          </Text>
        )}
      </View>

      {/* ======================================
          PAYMENT
      ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Payment Method
          </Text>

          <Text style={styles.summaryValue}>
            {order.payment_method || "N/A"}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>
            Total Amount
          </Text>

          <Text style={styles.totalAmount}>
            ₹
            {Number(
              order.total_amount
            ).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ======================================
          STATUS ACTION
      ====================================== */}

      {order.status === "Delivered" ? (
        <View
          style={styles.completedBox}
        >
          <Text
            style={styles.completedTitle}
          >
            ✓ Order Delivered
          </Text>

          <Text
            style={styles.completedText}
          >
            This order has been successfully
            delivered.
          </Text>
        </View>
      ) : nextStatus ? (
        <TouchableOpacity
          style={[
            styles.statusButton,
            nextStatus.status ===
              "Delivered" &&
              styles.deliveredButton,
          ]}
          disabled={updating}
          onPress={() =>
            updateOrderStatus(
              nextStatus.status
            )
          }
        >
          <Text
            style={
              styles.statusButtonText
            }
          >
            {updating
              ? "Updating..."
              : nextStatus.label}
          </Text>
        </TouchableOpacity>
      ) : null}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

export default RiderOrderDetailsScreen;

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
    fontFamily: "InterRegular",
  },

  notFound: {
    fontSize: 16,
    color: "#555",
    fontFamily: "InterSemiBold",
  },

  backButton: {
    backgroundColor: "#0A8A2A",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
  },

  backButtonText: {
    color: "#FFF",
    fontFamily: "InterBold",
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  backArrow: {
    fontSize: 25,
    color: "#111",
    fontFamily: "InterMedium",
  },

  backText: {
    fontSize: 15,
    color: "#333",
    fontFamily: "InterSemiBold",
    marginLeft: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    color: "#111",
    fontFamily: "InterBold",
  },

  createdAt: {
    fontSize: 12,
    color: "#888",
    fontFamily: "InterRegular",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 15,
  },

  statusText: {
    fontSize: 11,
    fontFamily: "InterBold",
  },

  pendingBadge: {
    backgroundColor: "#FFF3CD",
  },

  pendingText: {
    color: "#856404",
  },

  acceptedBadge: {
    backgroundColor: "#E8F5E9",
  },

  acceptedText: {
    color: "#2E7D32",
  },

  deliveryBadge: {
    backgroundColor: "#E3F2FD",
  },

  deliveryText: {
    color: "#1565C0",
  },

  deliveredBadge: {
    backgroundColor: "#E8F5E9",
  },

  deliveredText: {
    color: "#0A8A2A",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  sectionTitle: {
    fontSize: 15,
    color: "#222",
    fontFamily: "InterBold",
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    color: "#888",
    fontFamily: "InterRegular",
  },

  value: {
    fontSize: 14,
    color: "#222",
    fontFamily: "InterSemiBold",
    marginTop: 4,
  },

  address: {
    fontSize: 14,
    color: "#555",
    lineHeight: 21,
    fontFamily: "InterRegular",
  },

  callButton: {
    height: 44,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },

  callButtonText: {
    color: "#0A8A2A",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  mapButton: {
    height: 44,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },

  mapButtonText: {
    color: "#1565C0",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  productImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: "#F2F2F2",
    marginRight: 12,
  },

  noImage: {
    width: 65,
    height: 65,
    borderRadius: 10,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  noImageText: {
    color: "#888",
    fontSize: 10,
    fontFamily: "InterRegular",
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 14,
    color: "#222",
    fontFamily: "InterSemiBold",
  },

  productQuantity: {
    fontSize: 12,
    color: "#777",
    fontFamily: "InterRegular",
    marginTop: 4,
  },

  productPrice: {
    fontSize: 14,
    color: "#111",
    fontFamily: "InterBold",
    marginLeft: 8,
  },

  noProducts: {
    fontSize: 13,
    color: "#888",
    fontFamily: "InterRegular",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#777",
    fontFamily: "InterRegular",
  },

  summaryValue: {
    fontSize: 13,
    color: "#333",
    fontFamily: "InterSemiBold",
  },

  totalLabel: {
    fontSize: 15,
    color: "#222",
    fontFamily: "InterBold",
  },

  totalAmount: {
    fontSize: 18,
    color: "#0A8A2A",
    fontFamily: "InterBold",
  },

  statusButton: {
    height: 50,
    backgroundColor: "#0A8A2A",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },

  deliveredButton: {
    backgroundColor: "#008015",
  },

  statusButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "InterBold",
  },

  completedBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
  },

  completedTitle: {
    color: "#0A8A2A",
    fontSize: 16,
    fontFamily: "InterBold",
  },

  completedText: {
    color: "#555",
    fontSize: 13,
    fontFamily: "InterRegular",
    textAlign: "center",
    marginTop: 5,
  },
});