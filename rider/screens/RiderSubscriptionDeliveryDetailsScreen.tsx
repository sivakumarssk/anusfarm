import React, { useEffect, useState } from "react";
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

import axios from "axios";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { API_URL } from "../config/api";

// ==========================================
// TYPES
// ==========================================

type Product = {
  product_id: number | null;
  product_name: string | null;
  quantity: number;
  price: number | string | null;
  image?: string | null;
};

type Delivery = {
    delivery_id: number;
    subscription_id: number;
    delivery_date: string;
    delivery_status: string;
    rider_id: number;

    plan: string;
    frequency: string;
    delivery_time: string;

    user_id: number;
    customer_name: string;
    customer_phone: string;

    customer_address?: string;
    customer_latitude?: number;
    customer_longitude?: number;
    address_phone?: string;

    products: Product[];
};

const RiderSubscriptionDeliveryDetailsScreen =() => {
    const route = useRoute<any>();

    const navigation =
      useNavigation<any>();

    // ======================================
    // GET PARAMS
    // ======================================

    const params = route.params;

    console.log(
      "DETAIL SCREEN PARAMS:",
      params
    );

    const deliveryId =
      params?.deliveryId;

    console.log(
      "DETAIL SCREEN DELIVERY ID:",
      deliveryId
    );

    // ======================================
    // STATE
    // ======================================

    const [delivery, setDelivery] =
      useState<Delivery | null>(null);

    const [loading, setLoading] =
      useState(true);

    const [updating, setUpdating] =
      useState(false);

    // ======================================
    // GET DELIVERY
    // ======================================

    const fetchDelivery =
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

          if (
            deliveryId === undefined ||
            deliveryId === null
          ) {
            Alert.alert(
              "Error",
              "Delivery ID is missing."
            );

            return;
          }

          console.log(
            "GET SUBSCRIPTION DELIVERY:",
            deliveryId
          );

          const response =
            await axios.get(
              `${API_URL}/api/riders/subscription-deliveries/${deliveryId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          console.log(
            "SUBSCRIPTION DELIVERY DETAILS:",
            response.data
          );

          if (
            response.data.success &&
            response.data.delivery
          ) {
            setDelivery(
              response.data.delivery
            );
          } else {
            Alert.alert(
              "Error",
              response.data.message ||
                "Delivery not found"
            );
          }
        } catch (error: any) {
          console.log(
            "GET SUBSCRIPTION DELIVERY ERROR:",
            error.response?.data ||
              error.message
          );

          Alert.alert(
            "Error",
            error.response?.data
              ?.message ||
              "Unable to load delivery details"
          );
        } finally {
          setLoading(false);
        }
      };

    // ======================================
    // LOAD
    // ======================================

    useEffect(() => {
      console.log(
        "DETAIL SCREEN DELIVERY ID:",
        deliveryId
      );

      if (
        deliveryId !== undefined &&
        deliveryId !== null
      ) {
        fetchDelivery();
      } else {
        setLoading(false);
      }
    }, [deliveryId]);


       // ======================================
// NAVIGATE TO CUSTOMER
// ======================================

const openCustomerLocation = async () => {
  if (
    delivery?.customer_latitude == null ||
    delivery?.customer_longitude == null
  ) {
    Alert.alert(
      "Location Unavailable",
      "Customer location is not available."
    );
    return;
  }

  const latitude = delivery.customer_latitude;
  const longitude = delivery.customer_longitude;

  const googleMapsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${latitude},${longitude}`;

  try {
    const supported = await Linking.canOpenURL(
      googleMapsUrl
    );

    if (supported) {
      await Linking.openURL(googleMapsUrl);
    } else {
      Alert.alert(
        "Error",
        "Unable to open Google Maps."
      );
    }
  } catch (error) {
    console.log(
      "OPEN MAP ERROR:",
      error
    );

    Alert.alert(
      "Error",
      "Unable to open maps."
    );
  }
};

// ======================================
// CALL CUSTOMER
// ======================================

// const callCustomer = async () => {
//   const phone =
//     delivery?.address_phone ||
//     delivery?.customer_phone;

//   if (!phone) {
//     Alert.alert(
//       "Phone Number Unavailable",
//       "Customer phone number is not available."
//     );
//     return;
//   }

//   try {
//     const phoneUrl = `tel:${phone}`;

//     const supported =
//       await Linking.canOpenURL(phoneUrl);

//     if (supported) {
//       await Linking.openURL(phoneUrl);
//     } else {
//       Alert.alert(
//         "Error",
//         "Unable to open phone dialer."
//       );
//     }
//   } catch (error) {
//     console.log(
//       "CALL CUSTOMER ERROR:",
//       error
//     );

//     Alert.alert(
//       "Error",
//       "Unable to call customer."
//     );
//   }
// };
  const callCustomer = async () => {
  const phone = delivery?.address_phone;

  if (!phone) {
    Alert.alert(
      "Phone Number Unavailable",
      "Address phone number is not available."
    );
    return;
  }

  try {
    const cleanPhone = String(phone).replace(/\D/g, "");

    console.log("CALLING ADDRESS PHONE:", cleanPhone);

    await Linking.openURL(`tel:${cleanPhone}`);

  } catch (error) {
    console.log("CALL CUSTOMER ERROR:", error);

    Alert.alert(
      "Unable to Call",
      "Unable to open the phone dialer."
    );
  }
};

    // ======================================
    // UPDATE STATUS
    // ======================================

    const updateDeliveryStatus = async (status: string) => {
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

          console.log(
            "UPDATING DELIVERY:",
            deliveryId,
            status
          );

          const response =
            await axios.put(
              `${API_URL}/api/riders/subscription-deliveries/${deliveryId}/status`,
              {
                status,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type":
                    "application/json",
                },
              }
            );

          console.log(
            "UPDATE RESPONSE:",
            response.data
          );

          if (
            response.data.success
          ) {
            Alert.alert(
              "Success",
              `Delivery status updated to ${status}`
            );

            await fetchDelivery();
          } else {
            Alert.alert(
              "Update Failed",
              response.data.message ||
                "Unable to update delivery"
            );
          }
        } catch (error: any) {
          console.log(
            "UPDATE DELIVERY ERROR:",
            error.response?.data ||
              error.message
          );

          Alert.alert(
            "Update Failed",
            error.response?.data
              ?.message ||
              "Unable to update delivery status"
          );
        } finally {
          setUpdating(false);
        }
      };

    // ======================================
    // STATUS BUTTON
    // ======================================

    const renderStatusButton =
      () => {
        if (!delivery) {
          return null;
        }

        // Pending → Accepted

        if (
          delivery.delivery_status ===
          "Pending"
        ) {
          return (
            <TouchableOpacity
              style={
                styles.statusButton
              }
              disabled={updating}
              onPress={() =>
                updateDeliveryStatus(
                  "Accepted"
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
                  : "Accept Delivery"}
              </Text>
            </TouchableOpacity>
          );
        }

        // Accepted → Picked Up

        if (
          delivery.delivery_status ===
          "Accepted"
        ) {
          return (
            <TouchableOpacity
              style={
                styles.statusButton
              }
              disabled={updating}
              onPress={() =>
                updateDeliveryStatus(
                  "Picked Up"
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
                  : "Mark as Picked Up"}
              </Text>
            </TouchableOpacity>
          );
        }

        // Picked Up → Out for Delivery

        if (
          delivery.delivery_status ===
          "Picked Up"
        ) {
          return (
            <TouchableOpacity
              style={
                styles.statusButton
              }
              disabled={updating}
              onPress={() =>
                updateDeliveryStatus(
                  "Out for Delivery"
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
                  : "Start Delivery"}
              </Text>
            </TouchableOpacity>
          );
        }

        // Out for Delivery → Delivered

        if (
          delivery.delivery_status ===
          "Out for Delivery"
        ) {
          return (
            <TouchableOpacity
              style={
                styles.deliveredButton
              }
              disabled={updating}
              onPress={() =>
                updateDeliveryStatus(
                  "Delivered"
                )
              }
            >
              <Text
                style={
                  styles.deliveredButtonText
                }
              >
                {updating
                  ? "Updating..."
                  : "Mark as Delivered"}
              </Text>
            </TouchableOpacity>
          );
        }

        return null;
      };

    // ======================================
    // IMAGE URL
    // ======================================

    const getProductImage =
      (
        image?: string | null
      ) => {
        if (!image) {
          return null;
        }

        if (
          image.startsWith(
            "http://"
          ) ||
          image.startsWith(
            "https://"
          )
        ) {
          return image;
        }

        return `${API_URL}/uploads/${image}`;
      };

    // ======================================
    // LOADING
    // ======================================

    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator
            size="large"
          />

          <Text
            style={
              styles.loadingText
            }
          >
            Loading delivery...
          </Text>
        </View>
      );
    }

    // ======================================
    // ID MISSING
    // ======================================

    if (
      deliveryId === undefined ||
      deliveryId === null
    ) {
      return (
        <View style={styles.center}>
          <Text
            style={
              styles.emptyText
            }
          >
            Delivery ID is missing
          </Text>

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // ======================================
    // DELIVERY NOT FOUND
    // ======================================

    if (!delivery) {
      return (
        <View style={styles.center}>
          <Text
            style={
              styles.emptyText
            }
          >
            Delivery not found
          </Text>

          <TouchableOpacity
            style={
              styles.backButton
            }
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={
                styles.backButtonText
              }
            >
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    // ======================================
    // SCREEN
    // ======================================

    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* HEADER */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Text
              style={styles.backText}
            >
              ← Back
            </Text>
          </TouchableOpacity>

          <Text
            style={styles.title}
          >
            Delivery Details
          </Text>
        </View>

        {/* DELIVERY */}

        <View
          style={styles.card}
        >
          <View
            style={
              styles.cardHeader
            }
          >
            <Text
              style={
                styles.deliveryId
              }
            >
              Delivery #
              {
                delivery.delivery_id
              }
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
                {
                  delivery.delivery_status
                }
              </Text>
            </View>
          </View>

          <View
            style={styles.divider}
          />

          <Text style={styles.info}>
            Subscription ID:{" "}
            <Text
              style={styles.bold}
            >
              {
                delivery.subscription_id
              }
            </Text>
          </Text>

          <Text style={styles.info}>
            Plan:{" "}
            <Text
              style={styles.bold}
            >
              {delivery.plan}
            </Text>
          </Text>

          <Text style={styles.info}>
            Frequency:{" "}
            <Text
              style={styles.bold}
            >
              {delivery.frequency}
            </Text>
          </Text>

          <Text style={styles.info}>
            Delivery Time:{" "}
            <Text
              style={styles.bold}
            >
              {delivery.delivery_time}
            </Text>
          </Text>

          <Text style={styles.info}>
            Delivery Date:{" "}
            <Text
              style={styles.bold}
            >
              {new Date(
                delivery.delivery_date
              ).toLocaleDateString()}
            </Text>
          </Text>
        </View>

        {/* CUSTOMER */}

        <View  style={styles.card}>
          <Text  style={    styles.sectionTitle }>Customer Details</Text>

          <Text style={styles.info}> Name:{" "}  
             <Text style={styles.bold}>{  delivery.customer_name  } </Text>
          </Text>

          <Text style={styles.info}> Phone:{" "}
            <Text style={styles.bold} > {  delivery.customer_phone } </Text>
          </Text>

          <Text style={styles.info}>  User ID:{" "}
            <Text style={styles.bold} > {delivery.user_id}</Text>
          </Text>

           <TouchableOpacity
    style={styles.callButton}
    onPress={callCustomer}
  >
    <Text style={styles.callButtonText}>
      📞 Call Customer
    </Text>
  </TouchableOpacity>
        </View>

           {/* ================================== */}
{/* DELIVERY ADDRESS */}
{/* ================================== */}

<View style={styles.card}>
  <Text style={styles.sectionTitle}>
    Delivery Address
  </Text>

  <Text style={styles.info}>
    Address:{" "}
    <Text style={styles.bold}>
      {delivery.customer_address || "Address not available"}
    </Text>
  </Text>

  {delivery.customer_latitude != null &&
    delivery.customer_longitude != null && (
      <>
        <Text style={styles.info}>
          Latitude:{" "}
          <Text style={styles.bold}>
            {delivery.customer_latitude}
          </Text>
        </Text>

        <Text style={styles.info}>
          Longitude:{" "}
          <Text style={styles.bold}>
            {delivery.customer_longitude}
          </Text>
        </Text>
      </>
    )}
</View>       

{delivery.customer_latitude != null &&
  delivery.customer_longitude != null && (
    <TouchableOpacity
      style={styles.navigateButton}
      onPress={openCustomerLocation}
    >
      <Text style={styles.navigateButtonText}>
        📍 Navigate to Customer
      </Text>
    </TouchableOpacity>
  )}

        {/* PRODUCTS */}

        <View
          style={styles.card}
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Subscription Products
          </Text>

          {delivery.products &&
          delivery.products.length >
            0 ? (
            delivery.products.map(
              (
                product,
                index
              ) => {
                const imageUrl =
                  getProductImage(
                    product.image
                  );

                return (
                  <View
                    key={`${product.product_id}-${index}`}
                    style={
                      styles.productRow
                    }
                  >
                    {/* IMAGE */}

                    <View
                      style={
                        styles.imageContainer
                      }
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
                          onError={(
                            error
                          ) => {
                            console.log(
                              "PRODUCT IMAGE ERROR:",
                              error
                                .nativeEvent
                            );
                          }}
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
                    </View>

                    {/* PRODUCT INFO */}

                    <View
                      style={
                        styles.productInfo
                      }
                    >
                      <Text
                        style={
                          styles.productName
                        }
                      >
                        {product.product_name ||
                          "Product"}
                      </Text>

                      <Text
                        style={
                          styles.productQuantity
                        }
                      >
                        Quantity:{" "}
                        {
                          product.quantity
                        }
                      </Text>

                      <Text
                        style={
                          styles.productPrice
                        }
                      >
                        ₹
                        {product.price !==
                        null
                          ? Number(
                              product.price
                            ).toFixed(
                              2
                            )
                          : "0.00"}
                      </Text>
                    </View>
                  </View>
                );
              }
            )
          ) : (
            <Text
              style={
                styles.emptyText
              }
            >
              No products found
            </Text>
          )}
        </View>

        {/* ACTION */}

        <View
          style={
            styles.actionCard
          }
        >
          <Text
            style={
              styles.sectionTitle
            }
          >
            Delivery Action
          </Text>

          {delivery.delivery_status ===
          "Delivered" ? (
            <View
              style={
                styles.completedBox
              }
            >
              <Text
                style={
                  styles.completedText
                }
              >
                ✓ Delivery Completed
              </Text>
            </View>
          ) : (
            renderStatusButton()
          )}
        </View>

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
    );
  };

export default RiderSubscriptionDeliveryDetailsScreen;

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
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
  },

  header: {
    marginTop: 30,
    marginBottom: 20,
  },

  backText: {
    fontSize: 15,
    color: "#0A8A2A",
    fontWeight: "600",
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
  },

  card: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
  },

  deliveryId: {
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
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
    fontWeight: "700",
  },

  pendingText: {
    color: "#856404",
  },

  deliveredText: {
    color: "#0A8A2A",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 14,
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },

  bold: {
    fontWeight: "600",
    color: "#000",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 14,
  },

  // ========================================
  // PRODUCT
  // ========================================

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  imageContainer: {
    width: 85,
    height: 85,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F2F2F2",
    marginRight: 14,
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
  },

  noImageText: {
    fontSize: 11,
    color: "#888",
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },

  productQuantity: {
    fontSize: 13,
    color: "#777",
    marginBottom: 5,
  },

  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0A8A2A",
  },

  // ========================================
  // ACTION
  // ========================================

  actionCard: {
    backgroundColor: "#FFF",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
  },

  statusButton: {
    height: 50,
    backgroundColor: "#0A8A2A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  statusButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },

  deliveredButton: {
    height: 50,
    backgroundColor: "#008015",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  deliveredButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },

  completedBox: {
    backgroundColor: "#E8F5E9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  completedText: {
    color: "#0A8A2A",
    fontWeight: "700",
    fontSize: 15,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#0A8A2A",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  bottomSpace: {
    height: 30,
  },
  navigateButton: {
  backgroundColor: "#0A8A2A",
  marginBottom: 14,
  height: 52,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
},

navigateButtonText: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "700",
},
callButton: {
  backgroundColor: "#0A8A2A",
  height: 52,
  borderRadius: 12,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 8,
},

callButtonText: {
  color: "#FFF",
  fontSize: 16,
  fontWeight: "700",
},
});