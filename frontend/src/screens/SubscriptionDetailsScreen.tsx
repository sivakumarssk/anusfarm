// import React, { useEffect, useState } from "react";
// import {View,Text,StyleSheet,ScrollView,TouchableOpacity,ActivityIndicator,Alert,} from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { API_URL } from "../config/api";
// // const BASE_URL = "http://192.168.0.112:5000/api";

// export default function SubscriptionDetailsScreen() {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();
//   const { subscriptionId } = route.params;
//   const [loading, setLoading] = useState(true);
//   const [subscription, setSubscription] = useState<any>(null);

//   useEffect(() => {
//     getSubscription();
//   }, []);

//   const getSubscription = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       const res = await fetch(
//         `${API_URL}/subscriptions/my`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const json = await res.json();

//       if (json.success) {
//         const item = json.subscriptions.find(
//           (x: any) => x.id == subscriptionId
//         );

//         setSubscription(item);
//       }
//     } catch (e) {
//       console.log(e);
//     }

//     setLoading(false);
//   };

//   const pauseSubscription = async () => {
//     navigation.navigate("PauseSubscription", {
//       id: subscription.id,
//     });
//   };

//   const resumeSubscription = async () => {
//     const token = await AsyncStorage.getItem("token");

//     await fetch(
//       `${API_URL}/subscriptions/${subscription.id}/resume`,
//       {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     Alert.alert("Success", "Subscription resumed");

//     getSubscription();
//   };
//         const cancelSubscription = () => {
//   navigation.navigate("CancelSubscription", {
//     id: subscription.id,
//   });
// };      
//   if (loading) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!subscription) {
//     return (
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text>No Subscription Found</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>

//         <View style={styles.header}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons
//               name="arrow-back"
//               size={24}
//             />
//           </TouchableOpacity>

//           <Text style={styles.title}>
//             Subscription Details
//           </Text>
//         </View>

//         <View style={styles.card}>

//           <Text style={styles.heading}>
//             {subscription.plan}
//           </Text>

//           <View style={styles.row}>
//             <Text style={styles.label}>
//               Frequency
//             </Text>

//             <Text style={styles.value}>
//               {subscription.frequency}
//             </Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>
//               Delivery Time
//             </Text>

//             <Text style={styles.value}>
//               {subscription.delivery_time}
//             </Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>
//               Next Delivery
//             </Text>

//             <Text style={styles.value}>
//               {subscription.next_delivery_date}
//             </Text>
//           </View>

//           <View style={styles.row}>
//             <Text style={styles.label}>
//               Status
//             </Text>

//             <Text
//               style={[
//                 styles.status,
//                 subscription.status === "Active"
//                   ? styles.active
//                   : subscription.status ===
//                     "Paused"
//                   ? styles.paused
//                   : styles.cancelled,
//               ]}
//             >
//               {subscription.status}
//             </Text>
//           </View>

//           <Text style={styles.productHeading}>
//             Products
//           </Text>

//           {subscription.items?.map(
//             (item: any) => (
//               <View
//                 key={item.id}
//                 style={styles.productRow}
//               >
//                 <Text>
//                   {item.product_name}
//                 </Text>

//                 <Text>
//                   Qty {item.quantity}
//                 </Text>
//               </View>
//             )
//           )}
//           {/* <View style={styles.buttonContainer}>
//           {subscription.status === "Active" && (
//             <>
//               <TouchableOpacity
//                 style={styles.pauseButton}
//                 onPress={pauseSubscription}>
//                 <Text style={styles.buttonText}>Pause</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.editButton}
//                 onPress={() =>
//                   navigation.navigate("EditSubscription", {
//                     id: subscription.id,
//                   })
//                 }>
//                 <Text style={styles.buttonText}>Edit</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={cancelSubscription}>
//                 <Text style={styles.buttonText}>Cancel</Text>
//               </TouchableOpacity>
//             </>
//           )}
//           <TouchableOpacity
// style={styles.calendarButton}
// onPress={() =>
// navigation.navigate(
// "DeliveryCalendar",
// {
// id: subscription.id
// }
// )
// }
// >

// <Text style={styles.buttonText}>
// Delivery Calendar
// </Text>

// </TouchableOpacity>

//                     {subscription.status === "Paused" && (
//             <TouchableOpacity
//               style={styles.resumeButton}
//               onPress={resumeSubscription}
//             >
//               <Text style={styles.buttonText}>
//                 Resume
//               </Text>
//             </TouchableOpacity>
//           )}

//         </View> */}
// <View style={styles.buttonContainer}>

//   {subscription.status === "Active" && (
//     <>
//       <TouchableOpacity
//         style={styles.pauseButton}
//         onPress={pauseSubscription}
//       >
//         <Text style={styles.buttonText}>
//           Pause
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.editButton}
//         onPress={() =>
//           navigation.navigate("EditSubscription", {
//             id: subscription.id,
//           })
//         }
//       >
//         <Text style={styles.buttonText}>
//           Edit
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.cancelButton}
//         onPress={cancelSubscription}
//       >
//         <Text style={styles.buttonText}>
//           Cancel
//         </Text>
//       </TouchableOpacity>
      
//     </>
//   )}

//   {/* Delivery Calendar */}
//   <TouchableOpacity
//     style={styles.calendarButton}
//     onPress={() =>
//       navigation.navigate("DeliveryCalendar", {
//         id: subscription.id,
//       })
//     }
//   >
//     <Text style={styles.buttonText}>
//       Delivery Calendar
//     </Text>
//   </TouchableOpacity>

//   {subscription.status === "Paused" && (
//     <TouchableOpacity
//       style={styles.resumeButton}
//       onPress={resumeSubscription}
//     >
//       <Text style={styles.buttonText}>
//         Resume
//       </Text>
//     </TouchableOpacity>
//   )}

// </View>
//       </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }
//   const styles = StyleSheet.create({
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
//     backgroundColor: "#fff",
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//   },

//   heading: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 16,
//   },

//   row: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 8,
//   },

//   label: {
//     fontSize: 15,
//     color: "#555",
//   },

//   value: {
//     fontSize: 15,
//     fontWeight: "600",
//   },

//   status: {
//     fontWeight: "700",
//   },

//   active: {
//     color: "green",
//   },

//   paused: {
//     color: "orange",
//   },

//   cancelled: {
//     color: "red",
//   },

//   productHeading: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginTop: 20,
//     marginBottom: 10,
//   },

//   productRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },

//   buttonContainer: {
//     marginTop: 25,
//   },

//   pauseButton: {
//     backgroundColor: "#ff9800",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   resumeButton: {
//     backgroundColor: "#4caf50",
//     padding: 14,
//     borderRadius: 10,
//   },

//   editButton: {
//     backgroundColor: "#2196f3",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   cancelButton: {
//     backgroundColor: "#f44336",
//     padding: 14,
//     borderRadius: 10,
//   },
//   calendarButton: {
//   backgroundColor: "#673AB7",
//   padding: 14,
//   borderRadius: 10,
//   marginBottom: 10,
// },

//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "700",
//   },
// });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";

// import { API_URL } from "../config/api";

// export default function SubscriptionDetailsScreen() {
//   const navigation = useNavigation<any>();
//   const route = useRoute<any>();

//   const { subscriptionId } = route.params;

//   const [loading, setLoading] = useState(true);
//   const [subscription, setSubscription] =
//     useState<any>(null);

//   useEffect(() => {
//     console.log(
//       "OPEN SUBSCRIPTION DETAILS:",
//       subscriptionId
//     );

//     getSubscription();
//   }, []);

//   // =====================================================
//   // GET SUBSCRIPTION
//   // =====================================================

//   const getSubscription = async () => {
//     try {
//       const token =
//         await AsyncStorage.getItem("token");

//       const url =
//         `${API_URL}/api/subscriptions/my`;

//       console.log(
//         "SUBSCRIPTION DETAILS URL:",
//         url
//       );

//       const response = await fetch(url, {
//         method: "GET",

//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       console.log(
//         "SUBSCRIPTION RESPONSE STATUS:",
//         response.status
//       );

//       const text = await response.text();

//       console.log(
//         "SUBSCRIPTION RESPONSE:",
//         text
//       );

//       let json;

//       try {
//         json = JSON.parse(text);
//       } catch (error) {
//         console.log(
//           "SUBSCRIPTION JSON ERROR:",
//           error
//         );

//         Alert.alert(
//           "Error",
//           "Server returned an invalid response."
//         );

//         return;
//       }

//       if (!json.success) {
//         Alert.alert(
//           "Error",
//           json.message ||
//             "Unable to load subscription"
//         );

//         return;
//       }

//       // Find selected subscription
//       const selected =
//         json.subscriptions.find(
//           (item: any) =>
//             String(item.id) ===
//             String(subscriptionId)
//         );

//       console.log(
//         "SELECTED SUBSCRIPTION:",
//         selected
//       );

//       if (!selected) {
//         Alert.alert(
//           "Error",
//           "Subscription not found"
//         );

//         return;
//       }

//       setSubscription(selected);
//     } catch (error) {
//       console.log(
//         "SUBSCRIPTION ERROR:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         "Unable to load subscription"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // PAUSE
//   // =====================================================

//   const pauseSubscription = () => {
//     navigation.navigate(
//       "PauseSubscription",
//       {
//         id: subscription.id,
//       }
//     );
//   };

//   // =====================================================
//   // RESUME
//   // =====================================================

//   const resumeSubscription = async () => {
//     try {
//       const token =
//         await AsyncStorage.getItem("token");

//       const response = await fetch(
//         `${API_URL}/api/subscriptions/${subscription.id}/resume`,
//         {
//           method: "PUT",

//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const json =
//         await response.json();

//       console.log(
//         "RESUME RESPONSE:",
//         json
//       );

//       if (json.success) {
//         Alert.alert(
//           "Success",
//           "Subscription resumed"
//         );

//         getSubscription();
//       } else {
//         Alert.alert(
//           "Error",
//           json.message ||
//             "Unable to resume subscription"
//         );
//       }
//     } catch (error) {
//       console.log(
//         "RESUME ERROR:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         "Something went wrong"
//       );
//     }
//   };

//   // =====================================================
//   // CANCEL
//   // =====================================================

//   const cancelSubscription = () => {
//     navigation.navigate(
//       "CancelSubscription",
//       {
//         id: subscription.id,
//       }
//     );
//   };

//   // =====================================================
//   // EDIT
//   // =====================================================

//   const editSubscription = () => {
//     navigation.navigate(
//       "EditSubscription",
//       {
//         id: subscription.id,
//       }
//     );
//   };

//   // =====================================================
//   // DELIVERY CALENDAR
//   // =====================================================

//   const openCalendar = () => {
//     navigation.navigate(
//       "DeliveryCalendar",
//       {
//         id: subscription.id,
//       }
//     );
//   };

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (loading) {
//     return (
//       <View style={styles.loader}>
//         <ActivityIndicator
//           size="large"
//           color="#4CAF50"
//         />

//         <Text style={styles.loadingText}>
//           Loading subscription...
//         </Text>
//       </View>
//     );
//   }

//   // =====================================================
//   // NO SUBSCRIPTION
//   // =====================================================

//   if (!subscription) {
//     return (
//       <View style={styles.loader}>
//         <Text style={styles.noSubscription}>
//           No Subscription Found
//         </Text>

//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() =>
//             navigation.goBack()
//           }
//         >
//           <Text style={styles.buttonText}>
//             Go Back
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // =====================================================
//   // SCREEN
//   // =====================================================

//   return (
//     <SafeAreaView
//       style={styles.container}
//     >
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//       >

//         {/* HEADER */}

//         <View style={styles.header}>

//           <TouchableOpacity
//             onPress={() =>
//               navigation.goBack()
//             }
//             style={styles.backIcon}
//           >
//             <Ionicons
//               name="arrow-back"
//               size={24}
//               color="#000"
//             />
//           </TouchableOpacity>

//           <Text style={styles.title}>
//             Subscription Details
//           </Text>

//         </View>

//         {/* CARD */}

//         <View style={styles.card}>

//           {/* PLAN */}

//           <Text style={styles.heading}>
//             {subscription.plan}
//           </Text>

//           {/* FREQUENCY */}

//           <View style={styles.row}>

//             <Text style={styles.label}>
//               Frequency
//             </Text>

//             <Text style={styles.value}>
//               {subscription.frequency}
//             </Text>

//           </View>

//           {/* DELIVERY TIME */}

//           <View style={styles.row}>

//             <Text style={styles.label}>
//               Delivery Time
//             </Text>

//             <Text style={styles.value}>
//               {subscription.delivery_time}
//             </Text>

//           </View>

//           {/* NEXT DELIVERY */}

//           <View style={styles.row}>

//             <Text style={styles.label}>
//               Next Delivery
//             </Text>

//             <Text style={styles.value}>
//               {subscription.next_delivery_date
//                 ? new Date(
//                     subscription.next_delivery_date
//                   ).toLocaleDateString()
//                 : "Not Available"}
//             </Text>

//           </View>

//           {/* STATUS */}

//           <View style={styles.row}>

//             <Text style={styles.label}>
//               Status
//             </Text>

//             <Text
//               style={[
//                 styles.status,

//                 subscription.status ===
//                 "Active"
//                   ? styles.active
//                   : subscription.status ===
//                     "Paused"
//                   ? styles.paused
//                   : styles.cancelled,
//               ]}
//             >
//               {subscription.status}
//             </Text>

//           </View>

//           {/* PAUSE INFORMATION */}

//           {subscription.status ===
//             "Paused" && (
//             <>

//               {subscription.pause_from && (
//                 <View
//                   style={styles.row}
//                 >
//                   <Text
//                     style={styles.label}
//                   >
//                     Pause From
//                   </Text>

//                   <Text
//                     style={styles.value}
//                   >
//                     {new Date(
//                       subscription.pause_from
//                     ).toLocaleDateString()}
//                   </Text>
//                 </View>
//               )}

//               {subscription.pause_to && (
//                 <View
//                   style={styles.row}
//                 >
//                   <Text
//                     style={styles.label}
//                   >
//                     Pause To
//                   </Text>

//                   <Text
//                     style={styles.value}
//                   >
//                     {new Date(
//                       subscription.pause_to
//                     ).toLocaleDateString()}
//                   </Text>
//                 </View>
//               )}

//             </>
//           )}

//           {/* PRODUCTS */}

//           <Text
//             style={styles.productHeading}
//           >
//             Products
//           </Text>

//           {subscription.items &&
//           subscription.items.length > 0 ? (

//             subscription.items.map(
//               (item: any) => (

//                 <View
//                   key={item.id}
//                   style={
//                     styles.productRow
//                   }
//                 >

//                   <Text
//                     style={
//                       styles.productName
//                     }
//                   >
//                     {item.product_name}
//                   </Text>

//                   <Text
//                     style={
//                       styles.quantity
//                     }
//                   >
//                     Qty {item.quantity}
//                   </Text>

//                 </View>

//               )
//             )

//           ) : (

//             <Text
//               style={styles.noProducts}
//             >
//               No products
//             </Text>

//           )}

//           {/* BUTTONS */}

//           <View
//             style={styles.buttonContainer}
//           >

//             {/* ACTIVE SUBSCRIPTION */}

//             {subscription.status ===
//               "Active" && (
//               <>

//                 {/* PAUSE */}

//                 <TouchableOpacity
//                   style={
//                     styles.pauseButton
//                   }
//                   onPress={
//                     pauseSubscription
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.buttonText
//                     }
//                   >
//                     Pause
//                   </Text>
//                 </TouchableOpacity>

//                 {/* EDIT */}

//                 <TouchableOpacity
//                   style={
//                     styles.editButton
//                   }
//                   onPress={
//                     editSubscription
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.buttonText
//                     }
//                   >
//                     Edit
//                   </Text>
//                 </TouchableOpacity>

//                 {/* CANCEL */}

//                 <TouchableOpacity
//                   style={
//                     styles.cancelButton
//                   }
//                   onPress={
//                     cancelSubscription
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.buttonText
//                     }
//                   >
//                     Cancel
//                   </Text>
//                 </TouchableOpacity>

//                 {/* DELIVERY CALENDAR */}

//                 <TouchableOpacity
//                   style={
//                     styles.calendarButton
//                   }
//                   onPress={
//                     openCalendar
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.buttonText
//                     }
//                   >
//                     Delivery Calendar
//                   </Text>
//                 </TouchableOpacity>

//               </>
//             )}

//             {/* PAUSED SUBSCRIPTION */}

//             {subscription.status ===
//               "Paused" && (
//               <>

//                 {/* RESUME */}

//                 <TouchableOpacity
//                   style={
//                     styles.resumeButton
//                   }
//                   onPress={
//                     resumeSubscription
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.buttonText
//                     }
//                   >
//                     Resume
//                   </Text>
//                 </TouchableOpacity>

//                 {/* DELIVERY CALENDAR */}

//                 <TouchableOpacity
//                   style={
//                     styles.calendarButton
//                   }
//                   onPress={
//                     openCalendar
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.buttonText
//                     }
//                   >
//                     Delivery Calendar
//                   </Text>
//                 </TouchableOpacity>

//               </>
//             )}

//             {/* CANCELLED */}

//             {subscription.status ===
//               "Cancelled" && (

//               <Text
//                 style={
//                   styles.cancelledText
//                 }
//               >
//                 Subscription Cancelled
//               </Text>

//             )}

//           </View>

//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // =====================================================
// // STYLES
// // =====================================================

// const styles =
//   StyleSheet.create({

//     container: {
//       flex: 1,
//       backgroundColor: "#F7F7F7",
//     },

//     loader: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//       backgroundColor: "#F7F7F7",
//     },

//     loadingText: {
//       marginTop: 10,
//       fontSize: 15,
//       color: "#555",
//     },

//     noSubscription: {
//       fontSize: 17,
//       marginBottom: 20,
//     },

//     header: {
//       flexDirection: "row",
//       alignItems: "center",
//       padding: 16,
//     },

//     backIcon: {
//       padding: 4,
//     },

//     title: {
//       fontSize: 22,
//       fontWeight: "700",
//       marginLeft: 12,
//     },

//     card: {
//       backgroundColor: "#fff",
//       marginHorizontal: 16,
//       marginBottom: 20,
//       padding: 16,
//       borderRadius: 12,

//       elevation: 3,

//       shadowColor: "#000",
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//     },

//     heading: {
//       fontSize: 20,
//       fontWeight: "700",
//       marginBottom: 16,
//     },

//     row: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//       marginVertical: 8,
//     },

//     label: {
//       fontSize: 15,
//       color: "#555",
//     },

//     value: {
//       fontSize: 15,
//       fontWeight: "600",
//       maxWidth: "60%",
//       textAlign: "right",
//     },

//     status: {
//       fontWeight: "700",
//     },

//     active: {
//       color: "#4CAF50",
//     },

//     paused: {
//       color: "#FF9800",
//     },

//     cancelled: {
//       color: "#F44336",
//     },

//     productHeading: {
//       fontSize: 18,
//       fontWeight: "700",
//       marginTop: 20,
//       marginBottom: 10,
//     },

//     productRow: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",

//       paddingVertical: 10,

//       borderBottomWidth: 1,
//       borderBottomColor: "#EEEEEE",
//     },

//     productName: {
//       fontSize: 15,
//       fontWeight: "600",
//     },

//     quantity: {
//       fontSize: 14,
//       color: "#555",
//     },

//     noProducts: {
//       color: "#777",
//       marginBottom: 10,
//     },

//     buttonContainer: {
//       marginTop: 25,
//     },

//     pauseButton: {
//       backgroundColor: "#FF9800",
//       padding: 14,
//       borderRadius: 10,
//       marginBottom: 10,
//     },

//     resumeButton: {
//       backgroundColor: "#4CAF50",
//       padding: 14,
//       borderRadius: 10,
//       marginBottom: 10,
//     },

//     editButton: {
//       backgroundColor: "#2196F3",
//       padding: 14,
//       borderRadius: 10,
//       marginBottom: 10,
//     },

//     cancelButton: {
//       backgroundColor: "#F44336",
//       padding: 14,
//       borderRadius: 10,
//       marginBottom: 10,
//     },

//     calendarButton: {
//       backgroundColor: "#673AB7",
//       padding: 14,
//       borderRadius: 10,
//       marginBottom: 10,
//     },

//     backButton: {
//       backgroundColor: "#2196F3",
//       paddingHorizontal: 25,
//       paddingVertical: 12,
//       borderRadius: 8,
//     },

//     buttonText: {
//       color: "#fff",
//       textAlign: "center",
//       fontWeight: "700",
//       fontSize: 15,
//     },

//     cancelledText: {
//       color: "#F44336",
//       fontWeight: "700",
//       textAlign: "center",
//       paddingVertical: 10,
//     },

//   });




import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { API_URL } from "../config/api";

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

  /* =======================================================
     LOAD SUBSCRIPTION
  ======================================================= */

  useEffect(() => {
    if (!subscriptionId) {
      console.log(
        "ERROR: subscriptionId is missing"
      );

      Alert.alert(
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

          Alert.alert(
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
          Alert.alert(
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

        Alert.alert(
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
        Alert.alert(
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
    },

    errorText: {
      fontSize: 16,
      color: "#777",
      marginBottom: 20,
    },

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      paddingHorizontal: 16,
      paddingVertical: 15,
      backgroundColor:
        "#fff",
      elevation: 3,
    },

    headerTitle: {
      fontSize: 21,
      fontWeight: "700",
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
      fontSize: 18,
      fontWeight: "700",
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
      fontWeight: "700",
      fontSize: 14,
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
      fontSize: 15,
      flex: 1,
    },

    value: {
      color: "#222",
      fontSize: 15,
      fontWeight: "600",
      textAlign:
        "right",
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
      fontWeight: "600",
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
      fontSize: 16,
      fontWeight: "600",
      color: "#222",
    },

    productQuantity: {
      marginTop: 5,
      color: "#777",
      fontSize: 14,
    },

    productPrice: {
      fontSize: 15,
      fontWeight: "700",
      color: "#222",
      marginLeft: 10,
    },

    noProducts: {
      color: "#777",
      fontSize: 14,
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
      fontSize: 16,
      fontWeight: "700",
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
      fontSize: 15,
      fontWeight: "700",
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
      fontWeight: "700",
    },
  });

