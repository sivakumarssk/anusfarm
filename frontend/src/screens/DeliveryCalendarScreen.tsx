
// import React, { useEffect, useMemo, useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator,} from "react-native";
// import { Calendar } from "react-native-calendars";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {useNavigation, useRoute,RouteProp,} from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { API_URL } from "../config/api";

// /* =========================================================
//    TYPES
// ========================================================= */

// type RootStackParamList = {
//   DeliveryCalendar: {
//     subscriptionId: number;
//   };
// };

// type Delivery = {
//   id?: number;
//   delivery_date?: string;
//   delivery_time?: string;
//   status?: string;
// };

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function DeliveryCalendarScreen() {
//   const navigation = useNavigation();

//   const route =
//     useRoute<RouteProp<RootStackParamList, "DeliveryCalendar">>();

//   const subscriptionId = route.params?.subscriptionId;

//   console.log(
//     "DELIVERY CALENDAR SUBSCRIPTION ID:",
//     subscriptionId
//   );

//   /* =========================================================
//      STATE
//   ========================================================= */

//   const [loading, setLoading] = useState(true);

//   const [calendarData, setCalendarData] =
//     useState<Delivery[]>([]);

//   const [selectedDate, setSelectedDate] =
//     useState<string | null>(null);

//   const [selectedDelivery, setSelectedDelivery] =
//     useState<Delivery | null>(null);

//   /* =========================================================
//      LOAD CALENDAR
//   ========================================================= */

//   useEffect(() => {
//     if (!subscriptionId) {
//       console.log(
//         "ERROR: subscriptionId is undefined"
//       );

//       Alert.alert(
//         "Error",
//         "Subscription ID is missing"
//       );

//       setLoading(false);

//       return;
//     }

//     getCalendar();
//   }, [subscriptionId]);

//   /* =========================================================
//      FORMAT API DATE TO INDIA DATE
     
//      API example:
//      2026-08-18T18:30:00.000Z

//      India:
//      2026-08-19

//      IMPORTANT:
//      We MUST convert UTC -> Asia/Kolkata.
//   ========================================================= */

//   const formatDate = (
//     date: string | null | undefined
//   ): string | null => {
//     if (!date) {
//       return null;
//     }

//     /* Already YYYY-MM-DD */
//     if (
//       /^\d{4}-\d{2}-\d{2}$/.test(date)
//     ) {
//       return date;
//     }

//     try {
//       const parsedDate = new Date(date);

//       if (isNaN(parsedDate.getTime())) {
//         console.log(
//           "INVALID DATE:",
//           date
//         );

//         return null;
//       }

//       /*
//        * Convert UTC date to India date.
//        *
//        * en-CA gives:
//        * YYYY-MM-DD
//        *
//        * Asia/Kolkata gives IST.
//        */

//       const indiaDate =
//         new Intl.DateTimeFormat(
//           "en-CA",
//           {
//             timeZone: "Asia/Kolkata",
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//           }
//         ).format(parsedDate);

//       console.log(
//         "DATE CONVERSION:",
//         date,
//         "=>",
//         indiaDate
//       );

//       return indiaDate;
//     } catch (error) {
//       console.log(
//         "DATE FORMAT ERROR:",
//         error
//       );

//       return null;
//     }
//   };

//   /* =========================================================
//      GET CALENDAR API
//   ========================================================= */

//   const getCalendar = async () => {
//     try {
//       if (!subscriptionId) {
//         console.log(
//           "GET CALENDAR: subscriptionId missing"
//         );

//         return;
//       }

//       setLoading(true);

//       const token =
//         await AsyncStorage.getItem("token");

//       const url =
//         `${API_URL}/api/subscriptions/${subscriptionId}/calendar`;

//       console.log(
//         "CALENDAR URL:",
//         url
//       );

//       const res = await fetch(url, {
//         method: "GET",

//         headers: {
//           Authorization:
//             `Bearer ${token}`,
//           "Content-Type":
//             "application/json",
//         },
//       });

//       const text = await res.text();

//       console.log(
//         "CALENDAR RAW RESPONSE:",
//         text
//       );

//       let json: any;

//       try {
//         json = JSON.parse(text);
//       } catch (error) {
//         console.log(
//           "CALENDAR JSON ERROR:",
//           error
//         );

//         Alert.alert(
//           "Error",
//           "Invalid response from server"
//         );

//         return;
//       }

//       console.log(
//         "CALENDAR API:",
//         JSON.stringify(
//           json,
//           null,
//           2
//         )
//       );

//       if (json.success) {
//         const deliveries: Delivery[] =
//           Array.isArray(
//             json.calendar
//           )
//             ? json.calendar
//             : [];

//         setCalendarData(
//           deliveries
//         );

//         console.log(
//           "CALENDAR DATA:",
//           JSON.stringify(
//             deliveries,
//             null,
//             2
//           )
//         );

//         console.log(
//           "TOTAL DELIVERIES:",
//           deliveries.length
//         );
//       } else {
//         Alert.alert(
//           "Error",
//           json.message ||
//             "Unable to load delivery calendar"
//         );
//       }
//     } catch (error) {
//       console.log(
//         "CALENDAR ERROR:",
//         error
//       );

//       Alert.alert(
//         "Error",
//         "Unable to load delivery calendar"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================================
//      GET STATUS COLOR
//   ========================================================= */

//   const getStatusColor = (
//     status?: string
//   ) => {
//     switch (status) {
//       case "Delivered":
//         return "#4CAF50";

//       case "Skipped":
//         return "#9E9E9E";

//       case "Paused":
//         return "#FF9800";

//       case "Cancelled":
//         return "#F44336";

//       case "Pending":
//       case "Scheduled":
//       case "Active":
//       default:
//         return "#2196F3";
//     }
//   };

//   /* =========================================================
//      SELECT DATE
//   ========================================================= */

//   // const handleDateSelect = (
//   //   dateString: string
//   // ) => {
//   //   console.log(
//   //     "SELECTED DATE:",
//   //     dateString
//   //   );

//   //   setSelectedDate(
//   //     dateString
//   //   );

//   //   /*
//   //    * calendarData is the delivery array.
//   //    */

//   //   console.log(
//   //     "SEARCHING DELIVERY FOR:",
//   //     dateString
//   //   );

//   //   const delivery =
//   //     calendarData.find(
//   //       (item: Delivery) => {
//   //         const deliveryDate =
//   //           formatDate(
//   //             item.delivery_date
//   //           );

//   //         console.log(
//   //           "COMPARING:",
//   //           deliveryDate,
//   //           "WITH:",
//   //           dateString,
//   //           "DELIVERY ID:",
//   //           item.id
//   //         );

//   //         return (
//   //           deliveryDate ===
//   //           dateString
//   //         );
//   //       }
//   //     );

//   //   console.log(
//   //     "SELECTED DELIVERY:",
//   //     JSON.stringify(
//   //       delivery,
//   //       null,
//   //       2
//   //     )
//   //   );

//   //   setSelectedDelivery(
//   //     delivery || null
//   //   );
//   // };
// const handleDateSelect = (dateString: string) => {
//   console.log("================================");
//   console.log("SELECTED DATE:", dateString);

//   setSelectedDate(dateString);

//   const delivery = calendarData.find(
//     (item: Delivery) => {
//       const deliveryDate = formatDate(
//         item.delivery_date
//       );

//       console.log(
//         "CHECK:",
//         "ID =",
//         item.id,
//         "API DATE =",
//         item.delivery_date,
//         "INDIA DATE =",
//         deliveryDate,
//         "STATUS =",
//         item.status
//       );

//       return deliveryDate === dateString;
//     }
//   );

//   console.log(
//     "FINAL SELECTED DELIVERY:",
//     JSON.stringify(
//       delivery,
//       null,
//       2
//     )
//   );

//   setSelectedDelivery(
//     delivery || null
//   );

//   console.log("================================");
// };
//   /* =========================================================
//      MARKED DATES
//   ========================================================= */

//   const markedDates = useMemo(() => {
//     const marks: any = {};

//     calendarData.forEach(
//       (item: Delivery) => {
//         const date =
//           formatDate(
//             item.delivery_date
//           );

//         if (!date) {
//           return;
//         }

//         const color =
//           getStatusColor(
//             item.status
//           );

//         marks[date] = {
//           marked: true,
//           dotColor: color,
//         };
//       }
//     );

//     /*
//      * Selected date should override
//      * only the selected appearance,
//      * while preserving the delivery dot.
//      */

//     if (selectedDate) {
//       marks[selectedDate] = {
//         ...(marks[selectedDate] || {}),

//         selected: true,

//         selectedColor:
//           "#673AB7",

//         selectedTextColor:
//           "#FFFFFF",
//       };
//     }

//     return marks;
//   }, [
//     calendarData,
//     selectedDate,
//   ]);

//   /* =========================================================
//      LOADING
//   ========================================================= */

//   if (loading) {
//     return (
//       <SafeAreaView
//         style={styles.loader}
//       >
//         <ActivityIndicator
//           size="large"
//           color="#4CAF50"
//         />

//         <Text
//           style={
//             styles.loadingText
//           }
//         >
//           Loading calendar...
//         </Text>
//       </SafeAreaView>
//     );
//   }
//   const handleSkipDelivery = async () => {
//   if (!selectedDelivery?.id || !subscriptionId) {
//     Alert.alert("Error", "Delivery information is missing");
//     return;
//   }

//   Alert.alert(
//     "Skip Delivery",
//     `Are you sure you want to skip delivery for ${selectedDate}?`,
//     [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Skip",
//         onPress: async () => {
//           try {
//             const token =
//               await AsyncStorage.getItem("token");

//             const url =
//               `${API_URL}/api/subscriptions/delivery/${selectedDelivery.id}/skip`;

//             console.log("SKIP URL:", url);

//             const response = await fetch(url, {
//               method: "PUT",
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify({
//                 subscriptionId: subscriptionId,
//               }),
//             });

//             const text = await response.text();

//             console.log(
//               "SKIP RAW RESPONSE:",
//               text
//             );

//             const json = JSON.parse(text);

//             console.log(
//               "SKIP RESPONSE:",
//               json
//             );

//             if (json.success) {
//               Alert.alert(
//                 "Success",
//                 "Delivery skipped successfully"
//               );

//               // Reload calendar from database
//               await getCalendar();

//               // Update selected delivery immediately
//               setSelectedDelivery({
//                 ...selectedDelivery,
//                 status: "Skipped",
//               });
//             } else {
//               Alert.alert(
//                 "Error",
//                 json.message ||
//                   "Unable to skip delivery"
//               );
//             }
//           } catch (error) {
//             console.log(
//               "SKIP DELIVERY ERROR:",
//               error
//             );

//             Alert.alert(
//               "Error",
//               "Unable to skip delivery"
//             );
//           }
//         },
//       },
//     ]
//   );
// };

//   /* =========================================================
//      UI
//   ========================================================= */

//   return (
//     <SafeAreaView
//       style={styles.container}
//     >
//       <ScrollView
//         showsVerticalScrollIndicator={
//           false
//         }
//       >
//         {/* ================= HEADER ================= */}

//         <View
//           style={styles.header}
//         >
//           <TouchableOpacity
//             onPress={() =>
//               navigation.goBack()
//             }
//             style={
//               styles.backButton
//             }
//           >
//             <Ionicons
//               name="arrow-back"
//               size={26}
//               color="#222"
//             />
//           </TouchableOpacity>

//           <Text
//             style={styles.title}
//           >
//             Delivery Calendar
//           </Text>
//         </View>

//         {/* ================= CALENDAR ================= */}

//         <View
//           style={
//             styles.calendarCard
//           }
//         >
//           <Calendar
//             markedDates={
//               markedDates
//             }

//             onDayPress={(
//               day
//             ) => {
//               handleDateSelect(
//                 day.dateString
//               );
//             }}

//             theme={{
//               todayTextColor:
//                 "#4CAF50",

//               arrowColor:
//                 "#4CAF50",

//               selectedDayTextColor:
//                 "#FFFFFF",

//               textDayFontSize:
//                 15,

//               textMonthFontSize:
//                 18,

//               textMonthFontWeight:
//                 "700",

//               textDayHeaderFontSize:
//                 13,
//             }}
//           />
//         </View>

//         {/* ================= SELECTED DELIVERY ================= */}

//         {selectedDate && (
//           <View
//             style={
//               styles.deliveryCard
//             }
//           >
//             <Text
//               style={
//                 styles.cardTitle
//               }
//             >
//               Delivery Details
//             </Text>

//             {/* DATE */}

//             <View
//               style={styles.row}
//             >
//               <Text
//                 style={
//                   styles.label
//                 }
//               >
//                 Date
//               </Text>

//               <Text
//                 style={
//                   styles.value
//                 }
//               >
//                 {selectedDate}
//               </Text>
//             </View>

//             {/* DELIVERY */}

//             {selectedDelivery ? (
//               <>
//                 {/* STATUS */}

//                 <View
//                   style={
//                     styles.row
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.label
//                     }
//                   >
//                     Status
//                   </Text>

//                   <Text
//                     style={[
//                       styles.value,
//                       {
//                         color:
//                           getStatusColor(
//                             selectedDelivery.status
//                           ),
//                       },
//                     ]}
//                   >
//                     {
//                       selectedDelivery.status ||
//                       "Pending"
//                     }
//                   </Text>
//                 </View>

//                 {/* DELIVERY ID */}

//                 {selectedDelivery.id !==
//                   undefined && (
//                   <View
//                     style={
//                       styles.row
//                     }
//                   >
//                     <Text
//                       style={
//                         styles.label
//                       }
//                     >
//                       Delivery ID
//                     </Text>

//                     <Text
//                       style={
//                         styles.value
//                       }
//                     >
//                       {
//                         selectedDelivery.id
//                       }
//                     </Text>
//                   </View>
//                 )}

//                 {/* DELIVERY TIME */}

//                 {selectedDelivery.delivery_time && (
//                   <View
//                     style={
//                       styles.row
//                     }
//                   >
//                     <Text
//                       style={
//                         styles.label
//                       }
//                     >
//                       Delivery Time
//                     </Text>

//                     <Text
//                       style={
//                         styles.value
//                       }
//                     >
//                       {
//                         selectedDelivery.delivery_time
//                       }
//                     </Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <Text
//                 style={
//                   styles.noDelivery
//                 }
//               >
//                 No delivery scheduled
//                 for this date.
//               </Text>
//             )}
//           </View>
//         )}
//       {selectedDelivery?.status === "Pending" && (
//   <TouchableOpacity
//     style={styles.skipButton}
//     onPress={handleSkipDelivery}
//   >
//     <Text style={styles.skipButtonText}>
//       Skip This Delivery
//     </Text>
//   </TouchableOpacity>
// )}

//         {/* ================= DELIVERY LIST ================= */}

//         <View
//           style={
//             styles.detailsCard
//           }
//         >
//           <Text
//             style={
//               styles.cardTitle
//             }
//           >
//             Delivery Schedule
//           </Text>

//           {calendarData.length ===
//           0 ? (
//             <Text
//               style={
//                 styles.noDelivery
//               }
//             >
//               No deliveries found.
//             </Text>
//           ) : (
//             calendarData.map(
//               (
//                 delivery,
//                 index
//               ) => {
//                 const date =
//                   formatDate(
//                     delivery.delivery_date
//                   );

//                 return (
//                   <TouchableOpacity
//                     key={
//                       delivery.id ||
//                       index
//                     }
//                     style={[
//                       styles.scheduleRow,

//                       selectedDate ===
//                         date &&
//                         styles.selectedScheduleRow,
//                     ]}
//                     onPress={() => {
//                       if (date) {
//                         handleDateSelect(
//                           date
//                         );
//                       }
//                     }}
//                   >
//                     <View>
//                       <Text
//                         style={
//                           styles.scheduleDate
//                         }
//                       >
//                         {date ||
//                           "-"}
//                       </Text>

//                       {delivery.delivery_time && (
//                         <Text
//                           style={
//                             styles.scheduleTime
//                           }
//                         >
//                           {
//                             delivery.delivery_time
//                           }
//                         </Text>
//                       )}
//                     </View>

//                     <Text
//                       style={[
//                         styles.scheduleStatus,
//                         {
//                           color:
//                             getStatusColor(
//                               delivery.status
//                             ),
//                         },
//                       ]}
//                     >
//                       {
//                         delivery.status ||
//                         "Pending"
//                       }
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               }
//             )
//           )}
//         </View>

//         {/* ================= LEGEND ================= */}

//         <View
//           style={
//             styles.legendCard
//           }
//         >
//           <Text
//             style={
//               styles.cardTitle
//             }
//           >
//             Calendar Legend
//           </Text>

//           <View
//             style={styles.legend}
//           >
//             {/* SCHEDULED */}

//             <View
//               style={
//                 styles.legendItem
//               }
//             >
//               <View
//                 style={[
//                   styles.dot,
//                   {
//                     backgroundColor:
//                       "#2196F3",
//                   },
//                 ]}
//               />

//               <Text>
//                 Scheduled
//               </Text>
//             </View>

//             {/* DELIVERED */}

//             <View
//               style={
//                 styles.legendItem
//               }
//             >
//               <View
//                 style={[
//                   styles.dot,
//                   {
//                     backgroundColor:
//                       "#4CAF50",
//                   },
//                 ]}
//               />

//               <Text>
//                 Delivered
//               </Text>
//             </View>

//             {/* SKIPPED */}

//             <View
//               style={
//                 styles.legendItem
//               }
//             >
//               <View
//                 style={[
//                   styles.dot,
//                   {
//                     backgroundColor:
//                       "#9E9E9E",
//                   },
//                 ]}
//               />

//               <Text>
//                 Skipped
//               </Text>
//             </View>

//             {/* PAUSED */}

//             <View
//               style={
//                 styles.legendItem
//               }
//             >
//               <View
//                 style={[
//                   styles.dot,
//                   {
//                     backgroundColor:
//                       "#FF9800",
//                   },
//                 ]}
//               />

//               <Text>
//                 Paused
//               </Text>
//             </View>

//             {/* CANCELLED */}

//             <View
//               style={
//                 styles.legendItem
//               }
//             >
//               <View
//                 style={[
//                   styles.dot,
//                   {
//                     backgroundColor:
//                       "#F44336",
//                   },
//                 ]}
//               />

//               <Text>
//                 Cancelled
//               </Text>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* =========================================================
//    STYLES
// ========================================================= */

// const styles =
//   StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor:
//         "#F7F7F7",
//     },

//     loader: {
//       flex: 1,
//       justifyContent:
//         "center",
//       alignItems:
//         "center",
//       backgroundColor:
//         "#F7F7F7",
//     },

//     loadingText: {
//       marginTop: 10,
//       color: "#666",
//     },

//     header: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       padding: 16,
//       backgroundColor:
//         "#F7F7F7",
//     },

//     backButton: {
//       padding: 4,
//     },

//     title: {
//       fontSize: 22,
//       fontWeight:
//         "700",
//       marginLeft: 12,
//       color: "#222",
//     },

//     calendarCard: {
//       backgroundColor:
//         "#FFFFFF",
//       marginHorizontal: 16,
//       borderRadius: 15,
//       padding: 8,
//       elevation: 3,
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//     },

//     deliveryCard: {
//       backgroundColor:
//         "#FFFFFF",
//       margin: 16,
//       padding: 16,
//       borderRadius: 15,
//       elevation: 3,
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//     },

//     detailsCard: {
//       backgroundColor:
//         "#FFFFFF",
//       marginHorizontal: 16,
//       marginBottom: 16,
//       padding: 16,
//       borderRadius: 15,
//       elevation: 3,
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//     },

//     legendCard: {
//       backgroundColor:
//         "#FFFFFF",
//       marginHorizontal: 16,
//       marginBottom: 30,
//       padding: 16,
//       borderRadius: 15,
//       elevation: 3,
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       shadowOffset: {
//         width: 0,
//         height: 2,
//       },
//     },

//     cardTitle: {
//       fontSize: 18,
//       fontWeight:
//         "700",
//       marginBottom: 15,
//       color: "#222",
//     },

//     row: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       alignItems:
//         "center",
//       marginVertical: 8,
//     },

//     label: {
//       color: "#666",
//       fontSize: 15,
//     },
//     skipButton: {
//   backgroundColor: "#9E9E9E",
//   paddingVertical: 13,
//   borderRadius: 10,
//   alignItems: "center",
//   marginTop: 15,
// },

// skipButtonText: {
//   color: "#FFFFFF",
//   fontSize: 15,
//   fontWeight: "700",
// },

//     value: {
//       fontSize: 15,
//       fontWeight:
//         "700",
//       color: "#222",
//     },

//     noDelivery: {
//       color: "#777",
//       marginTop: 10,
//       fontSize: 14,
//     },

//     scheduleRow: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       alignItems:
//         "center",
//       paddingVertical: 13,
//       paddingHorizontal: 10,
//       borderBottomWidth: 1,
//       borderBottomColor:
//         "#EEEEEE",
//       borderRadius: 8,
//     },

//     selectedScheduleRow: {
//       backgroundColor:
//         "#F0E8FF",
//     },

//     scheduleDate: {
//       fontSize: 15,
//       fontWeight:
//         "600",
//       color: "#222",
//     },

//     scheduleTime: {
//       fontSize: 13,
//       color: "#777",
//       marginTop: 3,
//     },

//     scheduleStatus: {
//       fontSize: 14,
//       fontWeight:
//         "700",
//     },

//     legend: {
//       flexDirection:
//         "row",
//       flexWrap:
//         "wrap",
//       justifyContent:
//         "space-between",
//     },

//     legendItem: {
//       flexDirection:
//         "row",
//       alignItems:
//         "center",
//       marginBottom: 12,
//       width: "48%",
//     },

//     dot: {
//       width: 12,
//       height: 12,
//       borderRadius: 6,
//       marginRight: 7,
//     },
//   });

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";

/* =========================================================
   TYPES
========================================================= */

type RootStackParamList = {
  DeliveryCalendar: {
    subscriptionId: number;
  };
};

type Delivery = {
  id?: number;
  delivery_date?: string;
  delivery_time?: string;
  status?: string;
};

/* =========================================================
   SCREEN
========================================================= */

export default function DeliveryCalendarScreen() {
  const navigation = useNavigation<any>();

  const route =
    useRoute<RouteProp<RootStackParamList, "DeliveryCalendar">>();

  const subscriptionId = route.params?.subscriptionId;

  console.log(
    "DELIVERY CALENDAR SUBSCRIPTION ID:",
    subscriptionId
  );

  /* =========================================================
     STATE
  ========================================================= */

  const [loading, setLoading] = useState(true);

  const [calendarData, setCalendarData] =
    useState<Delivery[]>([]);

  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);

  const [selectedDelivery, setSelectedDelivery] =
    useState<Delivery | null>(null);

  const [skipping, setSkipping] = useState(false);

  // CUSTOM ALERT STATE
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtonText, setAlertButtonText] = useState("OK");
  const [alertCancelText, setAlertCancelText] =
    useState<string | undefined>(undefined);
  const [alertConfirmAction, setAlertConfirmAction] =
    useState<(() => void) | undefined>(undefined);

  const showCustomAlert = (
    title: string,
    message = "",
    options?: {
      buttonText?: string;
      cancelText?: string;
      onConfirm?: () => void;
    }
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtonText(options?.buttonText || "OK");
    setAlertCancelText(options?.cancelText);
    setAlertConfirmAction(() => options?.onConfirm);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
    setAlertConfirmAction(undefined);
    setAlertCancelText(undefined);
  };

  const confirmCustomAlert = () => {
    const action = alertConfirmAction;

    setAlertVisible(false);
    setAlertConfirmAction(undefined);
    setAlertCancelText(undefined);

    action?.();
  };

  /* =========================================================
     FORMAT API DATE TO INDIA DATE
  ========================================================= */

  const formatDate = (
    date: string | null | undefined
  ): string | null => {
    if (!date) {
      return null;
    }

    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    try {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        console.log("INVALID DATE:", date);
        return null;
      }

      const indiaDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(parsedDate);

      console.log("DATE CONVERSION:", date, "=>", indiaDate);

      return indiaDate;
    } catch (error) {
      console.log("DATE FORMAT ERROR:", error);
      return null;
    }
  };

  /* =========================================================
     GET CALENDAR API
  ========================================================= */

  const getCalendar = async () => {
    if (!subscriptionId) {
      setCalendarData([]);
      setLoading(false);

      showCustomAlert(
        "Error",
        "Subscription ID is missing"
      );

      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        showCustomAlert(
          "Login Required",
          "Please login again to view your delivery calendar."
        );
        return;
      }

      const url =
        `${API_URL}/api/subscriptions/${subscriptionId}/calendar`;

      console.log("CALENDAR URL:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();

      console.log("CALENDAR RAW RESPONSE:", text);

      let json: any;

      try {
        json = JSON.parse(text);
      } catch {
        showCustomAlert(
          "Error",
          "Invalid response from server"
        );
        return;
      }

      console.log(
        "CALENDAR API:",
        JSON.stringify(json, null, 2)
      );

      if (res.ok && json.success) {
        const deliveries: Delivery[] =
          Array.isArray(json.calendar) ? json.calendar : [];

        setCalendarData(deliveries);

        console.log(
          "CALENDAR DATA:",
          JSON.stringify(deliveries, null, 2)
        );

        console.log("TOTAL DELIVERIES:", deliveries.length);
      } else {
        showCustomAlert(
          "Error",
          json.message || "Unable to load delivery calendar"
        );
      }
    } catch (error) {
      console.log("CALENDAR ERROR:", error);

      showCustomAlert(
        "Error",
        "Unable to load delivery calendar"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!subscriptionId) {
      setCalendarData([]);
      setLoading(false);

      showCustomAlert(
        "Error",
        "Subscription ID is missing"
      );

      return;
    }

    getCalendar();
  }, [subscriptionId]);

  /* =========================================================
     GET STATUS COLOR
  ========================================================= */

  const getStatusColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "#4CAF50";

      case "skipped":
        return "#9E9E9E";

      case "paused":
        return "#FF9800";

      case "cancelled":
        return "#F44336";

      case "pending":
      case "scheduled":
      case "active":
      default:
        return "#2196F3";
    }
  };

  /* =========================================================
     SELECT DATE
  ========================================================= */

  const handleDateSelect = (dateString: string) => {
    console.log("================================");
    console.log("SELECTED DATE:", dateString);

    setSelectedDate(dateString);

    const delivery = calendarData.find((item) => {
      const deliveryDate = formatDate(item.delivery_date);

      console.log(
        "CHECK:",
        "ID =",
        item.id,
        "API DATE =",
        item.delivery_date,
        "INDIA DATE =",
        deliveryDate,
        "STATUS =",
        item.status
      );

      return deliveryDate === dateString;
    });

    console.log(
      "FINAL SELECTED DELIVERY:",
      JSON.stringify(delivery, null, 2)
    );

    setSelectedDelivery(delivery || null);

    console.log("================================");
  };

  /* =========================================================
     MARKED DATES
  ========================================================= */

  const markedDates = useMemo(() => {
    const marks: any = {};

    calendarData.forEach((item) => {
      const date = formatDate(item.delivery_date);

      if (!date) {
        return;
      }

      marks[date] = {
        marked: true,
        dotColor: getStatusColor(item.status),
      };
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: "#673AB7",
        selectedTextColor: "#FFFFFF",
      };
    }

    return marks;
  }, [calendarData, selectedDate]);

  /* =========================================================
     SKIP DELIVERY
  ========================================================= */

  const performSkipDelivery = async () => {
    if (!selectedDelivery?.id || !subscriptionId) {
      showCustomAlert(
        "Error",
        "Delivery information is missing"
      );
      return;
    }

    try {
      setSkipping(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        showCustomAlert(
          "Login Required",
          "Please login again."
        );
        return;
      }

      const url =
        `${API_URL}/api/subscriptions/delivery/${selectedDelivery.id}/skip`;

      console.log("SKIP URL:", url);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      const text = await response.text();

      console.log("SKIP RAW RESPONSE:", text);

      let json: any;

      try {
        json = JSON.parse(text);
      } catch {
        showCustomAlert(
          "Error",
          "Invalid response from server"
        );
        return;
      }

      console.log("SKIP RESPONSE:", json);

      if (response.ok && json.success) {
        // Update the selected delivery immediately.
        setSelectedDelivery((previous) =>
          previous ? { ...previous, status: "Skipped" } : null
        );

        // Refresh schedule data from the server.
        await getCalendar();

        showCustomAlert(
          "Success",
          "Delivery skipped successfully"
        );
      } else {
        showCustomAlert(
          "Error",
          json.message || "Unable to skip delivery"
        );
      }
    } catch (error) {
      console.log("SKIP DELIVERY ERROR:", error);

      showCustomAlert(
        "Error",
        "Unable to skip delivery"
      );
    } finally {
      setSkipping(false);
    }
  };

  const handleSkipDelivery = () => {
    if (!selectedDelivery?.id || !subscriptionId) {
      showCustomAlert(
        "Error",
        "Delivery information is missing"
      );
      return;
    }

    showCustomAlert(
      "Skip Delivery",
      `Are you sure you want to skip delivery for ${selectedDate}?`,
      {
        buttonText: "Skip",
        cancelText: "Cancel",
        onConfirm: performSkipDelivery,
      }
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#4CAF50" />

        <Text style={styles.loadingText}>
          Loading calendar...
        </Text>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          buttonText={alertButtonText}
          cancelText={alertCancelText}
          onClose={closeCustomAlert}
          onConfirm={confirmCustomAlert}
        />
      </SafeAreaView>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color="#222"
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            Delivery Calendar
          </Text>
        </View>

        {/* CALENDAR */}
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) =>
              handleDateSelect(day.dateString)
            }
            theme={{
              todayTextColor: "#4CAF50",
              arrowColor: "#4CAF50",
              selectedDayTextColor: "#FFFFFF",
              textDayFontSize: 15,
              textMonthFontSize: 18,
              textMonthFontWeight: "700",
              textDayHeaderFontSize: 13,
            }}
          />
        </View>

        {/* SELECTED DELIVERY */}
        {selectedDate && (
          <View style={styles.deliveryCard}>
            <Text style={styles.cardTitle}>
              Delivery Details
            </Text>

            <View style={styles.row}>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>
                {selectedDate}
              </Text>
            </View>

            {selectedDelivery ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.label}>Status</Text>
                  <Text
                    style={[
                      styles.value,
                      {
                        color: getStatusColor(
                          selectedDelivery.status
                        ),
                      },
                    ]}
                  >
                    {selectedDelivery.status || "Pending"}
                  </Text>
                </View>

                {selectedDelivery.id !== undefined && (
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Delivery ID
                    </Text>
                    <Text style={styles.value}>
                      {selectedDelivery.id}
                    </Text>
                  </View>
                )}

                {!!selectedDelivery.delivery_time && (
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Delivery Time
                    </Text>
                    <Text style={styles.value}>
                      {selectedDelivery.delivery_time}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={styles.noDelivery}>
                No delivery scheduled for this date.
              </Text>
            )}
          </View>
        )}

        {/* SKIP BUTTON */}
        {(selectedDelivery?.status || "").toLowerCase() ===
          "pending" && (
          <TouchableOpacity
            style={[
              styles.skipButton,
              skipping && styles.disabledButton,
            ]}
            onPress={handleSkipDelivery}
            disabled={skipping}
          >
            <Text style={styles.skipButtonText}>
              {skipping ? "Skipping..." : "Skip This Delivery"}
            </Text>
          </TouchableOpacity>
        )}

        {/* DELIVERY SCHEDULE */}
        <View style={styles.detailsCard}>
          <Text style={styles.cardTitle}>
            Delivery Schedule
          </Text>

          {calendarData.length === 0 ? (
            <Text style={styles.noDelivery}>
              No deliveries found.
            </Text>
          ) : (
            calendarData.map((delivery, index) => {
              const date = formatDate(delivery.delivery_date);

              return (
                <TouchableOpacity
                  key={delivery.id ?? index}
                  style={[
                    styles.scheduleRow,
                    selectedDate === date &&
                      styles.selectedScheduleRow,
                  ]}
                  onPress={() => {
                    if (date) {
                      handleDateSelect(date);
                    }
                  }}
                >
                  <View>
                    <Text style={styles.scheduleDate}>
                      {date || "-"}
                    </Text>

                    {!!delivery.delivery_time && (
                      <Text style={styles.scheduleTime}>
                        {delivery.delivery_time}
                      </Text>
                    )}
                  </View>

                  <Text
                    style={[
                      styles.scheduleStatus,
                      {
                        color: getStatusColor(delivery.status),
                      },
                    ]}
                  >
                    {delivery.status || "Pending"}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* CALENDAR LEGEND */}
        <View style={styles.legendCard}>
          <Text style={styles.cardTitle}>
            Calendar Legend
          </Text>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: "#2196F3" },
                ]}
              />
              <Text style={styles.legendText}>Scheduled</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: "#4CAF50" },
                ]}
              />
              <Text style={styles.legendText}>Delivered</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: "#9E9E9E" },
                ]}
              />
              <Text style={styles.legendText}>Skipped</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: "#FF9800" },
                ]}
              />
              <Text style={styles.legendText}>Paused</Text>
            </View>

            <View style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: "#F44336" },
                ]}
              />
              <Text style={styles.legendText}>Cancelled</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CUSTOM ALERT */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttonText={alertButtonText}
        cancelText={alertCancelText}
        onClose={closeCustomAlert}
        onConfirm={confirmCustomAlert}
      />
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
    fontFamily: "Inter-Regular",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F7F7F7",
  },

  backButton: {
    padding: 4,
  },

  title: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    marginLeft: 12,
    color: "#222",
  },

  calendarCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 15,
    padding: 8,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  deliveryCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 15,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  detailsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 15,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  legendCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 15,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  cardTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    marginBottom: 15,
    color: "#222",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },

  label: {
    color: "#666",
    fontSize: 15,
    fontFamily: "Inter-Regular",
  },

  value: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#222",
  },

  noDelivery: {
    color: "#777",
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },

  skipButton: {
    backgroundColor: "#9E9E9E",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  skipButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "Inter-Bold",
  },

  scheduleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    borderRadius: 8,
  },

  selectedScheduleRow: {
    backgroundColor: "#F0E8FF",
  },

  scheduleDate: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#222",
  },

  scheduleTime: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
    fontFamily: "Inter-Regular",
  },

  scheduleStatus: {
    fontSize: 14,
    fontFamily: "Inter-Bold",
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "48%",
  },

  legendText: {
    fontFamily: "Inter-Regular",
    color: "#333",
    fontSize: 13,
  },

  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 7,
  },
});