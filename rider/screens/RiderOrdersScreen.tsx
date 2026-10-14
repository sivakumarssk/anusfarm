import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { API_URL } from "../config/api";
import { Ionicons } from "@expo/vector-icons";
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

const RiderOrdersScreen = () => {
  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH ORDERS
  // ==========================================

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("riderToken");

      if (!token) {
        Alert.alert(
          "Login Required",
          "Rider login token not found."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/api/riders/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      console.log(
        "RIDER ORDERS RESPONSE:",
        JSON.stringify(data, null, 2)
      );

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch orders"
        );
      }

      if (data.success) {
        const orderList: Order[] = data.orders || [];

        // Show only active orders
        const activeOrders = orderList.filter(
          (order) =>
            !["Delivered", "Cancelled"].includes(
              order.status
            )
        );

        setOrders(activeOrders);
      } else {
        Alert.alert(
          "Error",
          data.message || "Unable to fetch orders"
        );
      }
    } catch (error) {
      console.error(
        "FETCH RIDER ORDERS ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load rider orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOAD WHEN SCREEN OPENS
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  // ==========================================
  // OPEN ORDER DETAILS
  // ==========================================

  const openOrderDetails = (order: Order) => {
    if (
      order?.id === undefined ||
      order?.id === null
    ) {
      Alert.alert(
        "Error",
        "Order ID is missing."
      );
      return;
    }

    navigation.navigate(
      "RiderOrderDetails",
      {
        orderId: Number(order.id),
      }
    );
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Accepted":
        return {
          badge: styles.acceptedBadge,
          text: styles.acceptedText,
        };

      case "Picked Up":
        return {
          badge: styles.pickedUpBadge,
          text: styles.pickedUpText,
        };

      case "Out for Delivery":
        return {
          badge: styles.deliveryBadge,
          text: styles.deliveryText,
        };

      case "Delivered":
        return {
          badge: styles.deliveredBadge,
          text: styles.deliveredText,
        };

      default:
        return {
          badge: styles.pendingBadge,
          text: styles.pendingText,
        };
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "N/A";
    }

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
          Loading orders...
        </Text>
      </View>
    );
  }

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
    <View style={styles.header}>
  <TouchableOpacity
    style={styles.backIconButton}
    onPress={() => navigation.goBack()}
  >
    <Ionicons
      name="arrow-back"
      size={24}
      color="#000"
    />
  </TouchableOpacity>

  <View style={styles.headerText}>
    <Text style={styles.title}>
      Orders
    </Text>

    <Text style={styles.subtitle}>
      Active customer orders
    </Text>
  </View>
</View>

      {/* ======================================
          EMPTY
      ====================================== */}

      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>
            📦
          </Text>

          <Text style={styles.emptyTitle}>
            No Active Orders
          </Text>

          <Text style={styles.emptyText}>
            You don't have any pending orders right now.
          </Text>
        </View>
      ) : (
        orders.map((order) => {
          const statusStyle =
            getStatusStyle(order.status);

          return (
            <TouchableOpacity
              key={order.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                openOrderDetails(order)
              }
            >
              {/* =================================
                  HEADER
              ================================= */}

              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.orderId}>
                    Order #{order.id}
                  </Text>

                  <Text style={styles.date}>
                    {formatDate(order.created_at)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    statusStyle.badge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      statusStyle.text,
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* =================================
                  CUSTOMER
              ================================= */}

              <Text style={styles.sectionTitle}>
                Customer
              </Text>

              <Text style={styles.info}>
                Name:{" "}
                <Text style={styles.bold}>
                  {order.customer_name || "N/A"}
                </Text>
              </Text>

              <Text style={styles.info}>
                Phone:{" "}
                <Text style={styles.bold}>
                  {order.customer_phone || "N/A"}
                </Text>
              </Text>

              {/* =================================
                  ADDRESS
              ================================= */}

              <Text style={styles.sectionTitle}>
                Delivery Address
              </Text>

              <Text
                style={styles.address}
                numberOfLines={2}
              >
                {order.address ||
                  "Address not available"}
              </Text>

              {/* =================================
                  PRODUCTS
              ================================= */}

              <Text style={styles.sectionTitle}>
                Products
              </Text>

              {order.products &&
              order.products.length > 0 ? (
                <View>
                  {order.products
                    .slice(0, 2)
                    .map((product, index) => (
                      <View
                        key={`${order.id}-${product.product_id}-${index}`}
                        style={styles.productRow}
                      >
                        <View
                          style={styles.productImageBox}
                        >
                          <Text
                            style={styles.productImageIcon}
                          >
                            📦
                          </Text>
                        </View>

                        <View
                          style={styles.productInfo}
                        >
                          <Text
                            style={styles.productName}
                            numberOfLines={1}
                          >
                            {product.product_name}
                          </Text>

                          <Text
                            style={styles.productQuantity}
                          >
                            Qty: {product.quantity}
                          </Text>
                        </View>

                        <Text
                          style={styles.productPrice}
                        >
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </Text>
                      </View>
                    ))}

                  {order.products.length > 2 && (
                    <Text style={styles.moreProducts}>
                      +{" "}
                      {order.products.length - 2}{" "}
                      more products
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.noProducts}>
                  No products
                </Text>
              )}

              <View style={styles.divider} />

              {/* =================================
                  ORDER TOTAL
              ================================= */}

              <View style={styles.totalRow}>
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

              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>
                  Payment
                </Text>

                <Text style={styles.paymentValue}>
                  {order.payment_method ||
                    "N/A"}
                </Text>
              </View>

              {/* =================================
                  VIEW DETAILS
              ================================= */}

              <View
                style={styles.detailsButton}
              >
                <Text
                  style={styles.detailsButtonText}
                >
                  View Details →
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </ScrollView>
  );
};

export default RiderOrdersScreen;

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
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
    fontFamily: "InterRegular",
  },
header: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 18,
},

backIconButton: {
  width: 40,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

headerText: {
  flex: 1,
},

title: {
  fontSize: 20,
  fontFamily: "InterBold",
  color: "#000",
  marginTop:18,
},

subtitle: {
  fontSize: 13,
  color: "#777",
  fontFamily: "InterRegular",
  marginTop: 3,
},
 


  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  orderId: {
    fontSize: 17,
    fontFamily: "InterBold",
    color: "#111",
  },

  date: {
    fontSize: 12,
    color: "#888",
    fontFamily: "InterRegular",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  statusBadgeText: {
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

  pickedUpBadge: {
    backgroundColor: "#FFF3E0",
  },

  pickedUpText: {
    color: "#E65100",
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

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 14,
  },

  sectionTitle: {
    fontSize: 14,
    fontFamily: "InterBold",
    color: "#222",
    marginBottom: 7,
    marginTop: 4,
  },

  info: {
    fontSize: 13,
    color: "#555",
    fontFamily: "InterRegular",
    marginBottom: 6,
  },

  bold: {
    fontFamily: "InterSemiBold",
    color: "#111",
  },

  address: {
    fontSize: 13,
    color: "#555",
    fontFamily: "InterRegular",
    lineHeight: 20,
    marginBottom: 5,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },

  productImageBox: {
    width: 48,
    height: 48,
    borderRadius: 9,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  productImageIcon: {
    fontSize: 20,
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 13,
    color: "#222",
    fontFamily: "InterSemiBold",
  },

  productQuantity: {
    fontSize: 12,
    color: "#777",
    fontFamily: "InterRegular",
    marginTop: 3,
  },

  productPrice: {
    fontSize: 13,
    color: "#111",
    fontFamily: "InterBold",
    marginLeft: 8,
  },

  moreProducts: {
    fontSize: 12,
    color: "#0A8A2A",
    fontFamily: "InterSemiBold",
    marginTop: 4,
  },

  noProducts: {
    fontSize: 13,
    color: "#888",
    fontFamily: "InterRegular",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 14,
    color: "#555",
    fontFamily: "InterMedium",
  },

  totalAmount: {
    fontSize: 17,
    color: "#0A8A2A",
    fontFamily: "InterBold",
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 7,
  },

  paymentLabel: {
    fontSize: 12,
    color: "#777",
    fontFamily: "InterRegular",
  },

  paymentValue: {
    fontSize: 12,
    color: "#333",
    fontFamily: "InterSemiBold",
  },

  detailsButton: {
    height: 44,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  detailsButtonText: {
    color: "#0A8A2A",
    fontSize: 14,
    fontFamily: "InterBold",
  },

  empty: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 17,
    color: "#222",
    fontFamily: "InterBold",
  },

  emptyText: {
    fontSize: 13,
    color: "#777",
    fontFamily: "InterRegular",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },
});