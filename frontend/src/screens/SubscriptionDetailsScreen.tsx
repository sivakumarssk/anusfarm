import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet, TouchableOpacity,ScrollView,ActivityIndicator,Alert,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useNavigation,useRoute,RouteProp,} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";
/* =========================================================
   NAVIGATION TYPES
========================================================= */

type RootStackParamList = {
  MySubscriptions: undefined;

  SubscriptionDetails: {
    subscriptionId: number;
  };

  DeliveryCalendar: {
    subscriptionId: number;
  };
};

type SubscriptionDetailsRouteProp = RouteProp<
  RootStackParamList,
  "SubscriptionDetails"
>;

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "SubscriptionDetails"
>;

/* =========================================================
   PRODUCT TYPE
========================================================= */

type Product = {
  id?: number;
  product_id?: number;
  product_name?: string;
  name?: string;
  quantity?: number;
  price?: number | string;
  image?: string;
};

/* =========================================================
   SUBSCRIPTION TYPE
========================================================= */

type Subscription = {
  id: number;
  user_id?: number;

  plan?: string;
  frequency?: string;
  delivery_time?: string;

  start_date?: string;
  next_delivery_date?: string;

  wallet_amount?: number | string;
  payment_method?: string;

  status?: string;

  selected_days?: string[];

  products?: Product[];
};

/* =========================================================
   SCREEN
========================================================= */

export default function SubscriptionDetailsScreen() {
  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigation =
    useNavigation<NavigationProp>();

  const route =
    useRoute<SubscriptionDetailsRouteProp>();

  /* =======================================================
     GET SUBSCRIPTION ID
  ======================================================= */

  const subscriptionId =
    route.params?.subscriptionId;

  console.log(
    "SUBSCRIPTION DETAILS ID:",
    subscriptionId
  );

  /* =======================================================
     STATES
  ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [subscription, setSubscription] =
    useState<Subscription | null>(null);
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");

const showCustomAlert = (title: string, message: string) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);
};
  /* =======================================================
     LOAD SUBSCRIPTION
  ======================================================= */

  useEffect(() => {
    if (!subscriptionId) {
      console.log(
        "ERROR: subscriptionId is missing"
      );

      showCustomAlert(
  "Error",
  "Subscription ID is missing"
);

      setLoading(false);

      return;
    }

    getSubscriptionDetails();
  }, [subscriptionId]);

  /* =======================================================
     GET SUBSCRIPTION DETAILS API
  ======================================================= */

  const getSubscriptionDetails =
    async () => {
      try {
        const token =
          await AsyncStorage.getItem(
            "token"
          );

        const url =
          `${API_URL}/api/subscriptions/${subscriptionId}`;

        console.log(
          "SUBSCRIPTION DETAILS URL:",
          url
        );

        const res =
          await fetch(url, {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          });

        const text =
          await res.text();

        console.log(
          "SUBSCRIPTION DETAILS RAW RESPONSE:",
          text
        );

        let json: any;

        try {
          json = JSON.parse(text);
        } catch (error) {
          console.log(
            "DETAILS JSON ERROR:",
            error
          );

          showCustomAlert(
  "Error",
  "Invalid response from server"
);

          return;
        }

        console.log(
          "SUBSCRIPTION DETAILS API:",
          JSON.stringify(
            json,
            null,
            2
          )
        );

        if (json.success) {
          setSubscription(
            json.subscription
          );
        } else {
          showCustomAlert(
  "Error",
  json.message ||
    "Unable to load subscription details"
);
        }
      } catch (error) {
        console.log(
          "SUBSCRIPTION DETAILS ERROR:",
          error
        );

       showCustomAlert(
  "Error",
  "Unable to load subscription details"
);
      } finally {
        setLoading(false);
      }
    };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "Not available";
    }

    const d =
      new Date(date);

    if (
      isNaN(
        d.getTime()
      )
    ) {
      return date;
    }

    return d.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     OPEN DELIVERY CALENDAR
  ======================================================= */

  const openDeliveryCalendar =
    () => {
      if (!subscriptionId) {
       showCustomAlert(
  "Error",
  "Subscription ID is missing"
);

        return;
      }

      console.log(
        "OPEN DELIVERY CALENDAR:",
        subscriptionId
      );

      navigation.navigate(
        "DeliveryCalendar",
        {
          subscriptionId:
            subscriptionId,
        }
      );
    };

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <ActivityIndicator
          size="large"
          color="#4CAF50"
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading subscription details...
        </Text>
      </View>
    );
  }

  /* =======================================================
     NO SUBSCRIPTION DATA
  ======================================================= */

  if (!subscription) {
    return (
      <View
        style={
          styles.loadingContainer
        }
      >
        <Text
          style={
            styles.errorText
          }
        >
          Subscription details not found.
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
        <CustomAlert
  visible={alertVisible}
  title={alertTitle}
  message={alertMessage}
  buttonText="OK"
  onClose={closeCustomAlert}
/>
      </View>
    );
  }

  /* =======================================================
     STATUS
  ======================================================= */

  const status =
    subscription.status?.toLowerCase();

  let statusColor =
    "#777";

  if (status === "active") {
    statusColor =
      "#4CAF50";
  } else if (
    status === "paused"
  ) {
    statusColor =
      "#FF9800";
  } else if (
    status === "cancelled"
  ) {
    statusColor =
      "#F44336";
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <View
      style={
        styles.container
      }
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <View
        style={
          styles.header
        }
      >
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#222"
          />
        </TouchableOpacity>

        <Text
          style={
            styles.headerTitle
          }
        >
          Subscription Details
        </Text>
      </View>

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* =================================================
            PLAN CARD
        ================================================= */}

        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            {subscription.plan ||
              "Subscription"}
          </Text>

          <View
            style={
              styles.statusBadge
            }
          >
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    statusColor,
                },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    statusColor,
                },
              ]}
            >
              {subscription.status ||
                "Unknown"}
            </Text>
          </View>
        </View>

        {/* =================================================
            SUBSCRIPTION INFORMATION
        ================================================= */}

        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Subscription Information
          </Text>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Plan
            </Text>

            <Text
              style={styles.value}
            >
              {subscription.plan ||
                "N/A"}
            </Text>
          </View>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Frequency
            </Text>

            <Text
              style={styles.value}
            >
              {subscription.frequency ||
                "N/A"}
            </Text>
          </View>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Delivery Time
            </Text>

            <Text
              style={styles.value}
            >
              {subscription.delivery_time ||
                "N/A"}
            </Text>
          </View>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Start Date
            </Text>

            <Text
              style={styles.value}
            >
              {formatDate(
                subscription.start_date
              )}
            </Text>
          </View>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Next Delivery
            </Text>

            <Text
              style={styles.value}
            >
              {formatDate(
                subscription.next_delivery_date
              )}
            </Text>
          </View>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Payment Method
            </Text>

            <Text
              style={styles.value}
            >
              {subscription.payment_method ||
                "N/A"}
            </Text>
          </View>

          <View
            style={styles.row}
          >
            <Text
              style={styles.label}
            >
              Wallet Amount
            </Text>

            <Text
              style={styles.value}
            >
              ₹
              {Number(
                subscription.wallet_amount ||
                  0
              ).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* =================================================
            SELECTED DAYS
        ================================================= */}

        {subscription.selected_days &&
          subscription.selected_days.length >
            0 && (
            <View
              style={
                styles.card
              }
            >
              <Text
                style={
                  styles.cardTitle
                }
              >
                Selected Delivery Days
              </Text>

              <View
                style={
                  styles.daysContainer
                }
              >
                {subscription.selected_days.map(
                  (
                    day,
                    index
                  ) => (
                    <View
                      key={index}
                      style={
                        styles.dayBadge
                      }
                    >
                      <Text
                        style={
                          styles.dayText
                        }
                      >
                        {day}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Subscription Products
          </Text>

          {subscription.products &&
          subscription.products.length >
            0 ? (
            subscription.products.map(
              (
                product,
                index
              ) => (
                <View
                  key={
                    product.id ||
                    product.product_id ||
                    index
                  }
                  style={
                    styles.productRow
                  }
                >
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
                        product.name ||
                        "Product"}
                    </Text>

                    <Text
                      style={
                        styles.productQuantity
                      }
                    >
                      Quantity:{" "}
                      {product.quantity ||
                        1}
                    </Text>
                  </View>

                  {product.price !==
                    undefined && (
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
                  )}
                </View>
              )
            )
          ) : (
            <Text
              style={
                styles.noProducts
              }
            >
              No products found.
            </Text>
          )}
        </View>

        {/* =================================================
            DELIVERY CALENDAR
        ================================================= */}

        <TouchableOpacity
          style={
            styles.calendarButton
          }
          onPress={
            openDeliveryCalendar
          }
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color="#fff"
          />

          <Text
            style={
              styles.calendarButtonText
            }
          >
            View Delivery Calendar
          </Text>
        </TouchableOpacity>

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <TouchableOpacity
          style={
            styles.secondaryButton
          }
          onPress={() =>
            navigation.goBack()
          }
        >
          <Text
            style={
              styles.secondaryButtonText
            }
          >
            Back to My Subscriptions
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#F7F7F7",
    },

    loadingContainer: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      backgroundColor:
        "#F7F7F7",
    },

    loadingText: {
  marginTop: 12,
  color: "#666",
  fontSize: 15,
  fontFamily: "Inter-Regular",
},
errorText: {
  fontSize: 16,
  color: "#777",
  marginBottom: 20,
  fontFamily: "Inter-Regular",
},

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 16,
      paddingVertical: 15,
      marginTop:40
    },

 headerTitle: {
  fontSize: 16,
  fontFamily: "Inter-Bold",
  marginLeft: 12,
  color: "#222",
},

    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },

    card: {
      backgroundColor:
        "#fff",
      borderRadius: 15,
      padding: 18,
      marginBottom: 16,
      elevation: 3,
    },

  cardTitle: {
  fontSize: 15,
  fontFamily: "Inter-Bold",
  color: "#222",
  marginBottom: 16,
},

    statusBadge: {
      flexDirection:
        "row",
      alignItems:
        "center",
      alignSelf:
        "flex-start",
      backgroundColor:
        "#F5F5F5",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 20,
    },

    statusDot: {
      width: 9,
      height: 9,
      borderRadius: 5,
      marginRight: 7,
    },

    statusText: {
  fontFamily: "Inter-Bold",
  fontSize: 12,
},

    row: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom: 13,
    },

   label: {
  color: "#777",
  fontSize: 13,
  fontFamily: "Inter-Regular",
  flex: 1,
},

  value: {
  color: "#222",
  fontSize: 12,
  fontFamily: "Inter-SemiBold",
  textAlign: "right",
  flex: 1,
},

    daysContainer: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      gap: 8,
    },

    dayBadge: {
      backgroundColor:
        "#E8F5E9",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
    },

   dayText: {
  color: "#388E3C",
  fontFamily: "Inter-SemiBold",
  fontSize:12
},

    productRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        "#eee",
    },

    productInfo: {
      flex: 1,
    },

  productName: {
  fontSize: 13,
  fontFamily: "Inter-SemiBold",
  color: "#222",
},

  productQuantity: {
  marginTop: 5,
  color: "#777",
  fontSize: 13,
  fontFamily: "Inter-Regular",
},

    productPrice: {
  fontSize: 13,
  fontFamily: "Inter-Bold",
  color: "#222",
  marginLeft: 10,
},

  noProducts: {
  color: "#777",
  fontSize: 14,
  fontFamily: "Inter-Regular",
},

    calendarButton: {
      backgroundColor:
        "#4CAF50",
      flexDirection:
        "row",
      justifyContent:
        "center",
      alignItems:
        "center",
      padding: 15,
      borderRadius: 10,
      marginBottom: 12,
    },

  calendarButtonText: {
  color: "#fff",
  fontSize: 13,
  fontFamily: "Inter-Bold",
  marginLeft: 8,
},

    secondaryButton: {
      borderWidth: 1,
      borderColor:
        "#4CAF50",
      padding: 15,
      borderRadius: 10,
      alignItems:
        "center",
    },

   secondaryButtonText: {
  color: "#4CAF50",
  fontSize: 13,
  fontFamily: "Inter-Bold",
},

    backButton: {
      backgroundColor:
        "#4CAF50",
      paddingHorizontal: 25,
      paddingVertical: 12,
      borderRadius: 8,
    },

   backButtonText: {
  color: "#fff",
  fontFamily: "Inter-Bold",
},
  });

