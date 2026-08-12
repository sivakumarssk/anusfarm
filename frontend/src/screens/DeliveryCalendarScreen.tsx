// import React, {useEffect, useState} from "react";
// import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,} from "react-native";
// import {Calendar,} from "react-native-calendars";
// import AsyncStorage from"@react-native-async-storage/async-storage";
// import { SafeAreaView,} from "react-native-safe-area-context";
// import {useNavigation,useRoute,} from "@react-navigation/native";
// import {Ionicons,} from "@expo/vector-icons";
// import {API_URL} from "../config/api";


// export default function DeliveryCalendarScreen(){

// const navigation =useNavigation<any>();

// const route =useRoute<any>();
// const {id} = route.params;
// const [loading,setLoading] =useState(true);
// const [calendarData,setCalendarData] =useState<any>(null);



// useEffect(()=>{
// getCalendar();
// },[]);



// const getCalendar = async()=>{

// try{
// const token =await AsyncStorage.getItem("token");
// const res =await fetch(`${API_URL}/api/subscriptions/${id}/calendar`,{
// headers:{
// Authorization:
// `Bearer ${token}`
// }
// });
// const json =await res.json();


// if(json.success){
// setCalendarData(
// json.calendar
// );

// }


// }
// catch(error){
// console.log(error);
// }
// setLoading(false);
// };




// if(loading){

// return(

// <View style={styles.loader}>

// <ActivityIndicator
// size="large"
// />

// </View>

// );

// }



// const markedDates:any = {};



// // Next delivery blue

// if(calendarData?.next_delivery_date){

// markedDates[
// calendarData.next_delivery_date
// ]=
// {

// selected:true,

// selectedColor:"#2196F3",

// marked:true,

// dotColor:"#2196F3"

// };

// }



// // Pause dates orange

// if(
// calendarData?.pause_from &&
// calendarData?.pause_to
// ){

// const start =
// new Date(
// calendarData.pause_from
// );

// const end =
// new Date(
// calendarData.pause_to
// );


// while(start <= end){

// const date =
// start
// .toISOString()
// .split("T")[0];


// markedDates[date]=
// {

// selected:true,

// selectedColor:"#FF9800"

// };


// start.setDate(
// start.getDate()+1
// );

// }

// }
// if(calendarData?.deliveries){

// calendarData.deliveries.forEach(
// (item:any)=>{


// let color="#4CAF50";


// if(item.status==="Delivered"){
// color="#4CAF50";
// }


// if(item.status==="Paused"){
// color="#FF9800";
// }


// if(item.status==="Cancelled"){
// color="#F44336";
// }



// markedDates[item.delivery_date]={

// marked:true,

// dotColor:color

// };


// });


// }


// return(

// <SafeAreaView
// style={styles.container}
// >


// <View style={styles.header}>


// <TouchableOpacity
// onPress={()=>navigation.goBack()}
// >

// <Ionicons
// name="arrow-back"
// size={24}
// />

// </TouchableOpacity>


// <Text style={styles.title}>

// Delivery Calendar

// </Text>


// </View>




// <Calendar

// markedDates={
// markedDates
// }

// theme={{

// todayTextColor:"#4CAF50",

// arrowColor:"#4CAF50",

// }}

// />





// <View style={styles.card}>


// <Text style={styles.heading}>

// Subscription Details

// </Text>



// <View style={styles.row}>

// <Text>
// Frequency
// </Text>

// <Text style={styles.bold}>
// {calendarData?.frequency}
// </Text>

// </View>



// <View style={styles.row}>

// <Text>
// Next Delivery
// </Text>

// <Text style={styles.bold}>
// {calendarData?.next_delivery_date}
// </Text>

// </View>



// <View style={styles.row}>

// <Text>
// Status
// </Text>


// <Text
// style={{
// fontWeight:"700",
// color:
// calendarData?.status==="Active"
// ?
// "green"
// :
// "orange"
// }}
// >

// {calendarData?.status}

// </Text>


// </View>


// </View>





// <View style={styles.legend}>


// <View style={styles.legendItem}>

// <View
// style={[
// styles.dot,
// {
// backgroundColor:"#4CAF50"
// }
// ]}
// />

// <Text>
// Delivery
// </Text>


// </View>



// <View style={styles.legendItem}>

// <View
// style={[
// styles.dot,
// {
// backgroundColor:"#FF9800"
// }
// ]}
// />

// <Text>
// Paused
// </Text>


// </View>




// <View style={styles.legendItem}>

// <View
// style={[
// styles.dot,
// {
// backgroundColor:"#2196F3"
// }
// ]}
// />

// <Text>
// Next Delivery
// </Text>


// </View>



// </View>



// </SafeAreaView>

// );


// }



// const styles =
// StyleSheet.create({

// container:{
// flex:1,
// backgroundColor:"#F7F7F7"
// },


// loader:{
// flex:1,
// justifyContent:"center",
// alignItems:"center"
// },


// header:{
// flexDirection:"row",
// alignItems:"center",
// padding:16
// },


// title:{
// fontSize:22,
// fontWeight:"700",
// marginLeft:12
// },


// card:{
// backgroundColor:"#fff",
// margin:16,
// padding:16,
// borderRadius:15
// },


// heading:{
// fontSize:18,
// fontWeight:"700",
// marginBottom:15
// },


// row:{
// flexDirection:"row",
// justifyContent:"space-between",
// marginVertical:8
// },


// bold:{
// fontWeight:"700"
// },


// legend:{
// flexDirection:"row",
// justifyContent:"space-around",
// marginTop:20
// },


// legendItem:{
// flexDirection:"row",
// alignItems:"center"
// },


// dot:{
// width:12,
// height:12,
// borderRadius:6,
// marginRight:6
// }


// });



// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";

// import { Calendar } from "react-native-calendars";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import {
//   useNavigation,
//   useRoute,
//   RouteProp,
// } from "@react-navigation/native";
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

// type CalendarData = {
//   deliveries: Delivery[];
// };

// /* =========================================================
//    SCREEN
// ========================================================= */

// export default function DeliveryCalendarScreen() {
//   const navigation = useNavigation();

//   const route =
//     useRoute<
//       RouteProp<RootStackParamList, "DeliveryCalendar">
//     >();

//   /*
//    * IMPORTANT:
//    * MySubscriptionsScreen sends:
//    *
//    * {
//    *   subscriptionId: item.id
//    * }
//    *
//    * Therefore we MUST read subscriptionId here.
//    */

//   const subscriptionId = route.params?.subscriptionId;

//   console.log(
//     "DELIVERY CALENDAR SUBSCRIPTION ID:",
//     subscriptionId
//   );

//   const [loading, setLoading] = useState(true);

//   const [calendarData, setCalendarData] =
//     useState<CalendarData | null>(null);

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
//      FORMAT DATE
//   ========================================================= */

//   const formatDate = (
//     date: string | null | undefined
//   ): string | null => {
//     if (!date) {
//       return null;
//     }

//     /*
//      * Already YYYY-MM-DD
//      */
//     if (
//       typeof date === "string" &&
//       /^\d{4}-\d{2}-\d{2}$/.test(date)
//     ) {
//       return date;
//     }

//     const d = new Date(date);

//     if (isNaN(d.getTime())) {
//       return null;
//     }

//     const year = d.getFullYear();

//     const month = String(
//       d.getMonth() + 1
//     ).padStart(2, "0");

//     const day = String(
//       d.getDate()
//     ).padStart(2, "0");

//     return `${year}-${month}-${day}`;
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

//       const token =
//         await AsyncStorage.getItem("token");

//       /*
//        * THIS IS THE IMPORTANT URL
//        *
//        * Example:
//        * /api/subscriptions/81/calendar
//        *
//        * NOT:
//        * /api/subscriptions/undefined/calendar
//        */

//       const url =
//         `${API_URL}/api/subscriptions/${subscriptionId}/calendar`;

//       console.log(
//         "CALENDAR URL:",
//         url
//       );

//       const res = await fetch(url, {
//         method: "GET",

//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
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
//         /*
//          * Save calendar data
//          */
//        setCalendarData({
//   deliveries: json.calendar || [],
// });

//         console.log(
//           "CALENDAR DATA:",
//           JSON.stringify(
//             json.calendar,
//             null,
//             2
//           )
//         );

//         console.log(
//           "ALL DELIVERIES:",
//           JSON.stringify(
//             json.calendar?.deliveries,
//             null,
//             2
//           )
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
//      SELECT DATE
//   ========================================================= */

//   const handleDateSelect = (
//     dateString: string
//   ) => {
//     console.log(
//       "SELECTED DATE:",
//       dateString
//     );

//     setSelectedDate(
//       dateString
//     );

//     const deliveries =
//       calendarData?.deliveries || [];

//     console.log(
//       "ALL DELIVERIES:",
//       JSON.stringify(
//         deliveries,
//         null,
//         2
//       )
//     );

//     const delivery =
//       deliveries.find(
//         (item: Delivery) => {
//           const deliveryDate =
//             formatDate(
//               item.delivery_date
//             );

//           console.log(
//             "COMPARING:",
//             deliveryDate,
//             "WITH:",
//             dateString
//           );

//           return (
//             deliveryDate ===
//             dateString
//           );
//         }
//       );

//     console.log(
//       "SELECTED DELIVERY:",
//       JSON.stringify(
//         delivery,
//         null,
//         2
//       )
//     );

//     setSelectedDelivery(
//       delivery || null
//     );
//   };

//   /* =========================================================
//      MARKED DATES
//   ========================================================= */

//   const markedDates: any = {};

//   /*
//    * Delivery dates
//    */

//   if (calendarData?.deliveries) {
//     calendarData.deliveries.forEach(
//       (item: Delivery) => {
//         const date =
//           formatDate(
//             item.delivery_date
//           );

//         if (!date) {
//           return;
//         }

//         let color =
//           "#2196F3";

//         switch (
//           item.status
//         ) {
//           case "Delivered":
//             color = "#4CAF50";
//             break;

//           case "Skipped":
//             color = "#9E9E9E";
//             break;

//           case "Paused":
//             color = "#FF9800";
//             break;

//           case "Cancelled":
//             color = "#F44336";
//             break;

//           case "Pending":
//           case "Scheduled":
//           case "Active":
//             color = "#2196F3";
//             break;

//           default:
//             color = "#2196F3";
//         }

//         markedDates[date] = {
//           marked: true,
//           dotColor: color,
//         };
//       }
//     );
//   }

//   /*
//    * Selected date
//    */

//   if (selectedDate) {
//     markedDates[
//       selectedDate
//     ] = {
//       ...(markedDates[
//         selectedDate
//       ] || {}),

//       selected: true,

//       selectedColor:
//         "#673AB7",
//     };
//   }

//   /*
//    * Next delivery
//    */

 

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
//             ) =>
//               handleDateSelect(
//                 day.dateString
//               )
//             }
//             theme={{
//               todayTextColor:
//                 "#4CAF50",

//               arrowColor:
//                 "#4CAF50",

//               selectedDayTextColor:
//                 "#fff",
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

//             <View
//               style={styles.row}
//             >
//               <Text
//                 style={styles.label}
//               >
//                 Date
//               </Text>

//               <Text
//                 style={styles.value}
//               >
//                 {selectedDate}
//               </Text>
//             </View>

//             {selectedDelivery ? (
//               <>
//                 {/* STATUS */}

//                 <View
//                   style={styles.row}
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
//                           selectedDelivery.status ===
//                           "Delivered"
//                             ? "#4CAF50"
//                             : selectedDelivery.status ===
//                               "Skipped"
//                             ? "#9E9E9E"
//                             : selectedDelivery.status ===
//                               "Cancelled"
//                             ? "#F44336"
//                             : "#2196F3",
//                       },
//                     ]}
//                   >
//                     {
//                       selectedDelivery.status
//                     }
//                   </Text>
//                 </View>

//                 {/* DELIVERY ID */}

//                 {selectedDelivery.id && (
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

//         {/* ================= SUBSCRIPTION DETAILS ================= */}

//         {calendarData && (
//           <View
//             style={
//               styles.detailsCard
//             }
//           >
//             <Text
//               style={
//                 styles.cardTitle
//               }
//             >
//               Subscription Details
//             </Text>

//             {/* PLAN */}

//             <View
//               style={styles.row}
//             >
//               <Text
//                 style={styles.label}
//               >
//                 Plan
//               </Text>

//               {/* <Text
//                 style={styles.value}
//               >
//                 {calendarData.plan ||
//                   "Subscription"}
//               </Text> */}
//             </View>

//             {/* FREQUENCY */}

//             <View
//               style={styles.row}
//             >
//               <Text
//                 style={styles.label}
//               >
//                 Frequency
//               </Text>

//               {/* <Text
//                 style={styles.value}
//               >
//                 {
//                   calendarData.frequency ||
//                   "-"
//                 }
//               </Text> */}
//             </View>

//             {/* DELIVERY TIME */}

//             <View
//               style={styles.row}
//             >
//               <Text
//                 style={styles.label}
//               >
//                 Delivery Time
//               </Text>

//               {/* <Text
//                 style={styles.value}
//               >
//                 {
//                   calendarData.delivery_time ||
//                   "-"
//                 }
//               </Text> */}
//             </View>

//             {/* STATUS */}

//             <View
//               style={styles.row}
//             >
//               <Text
//                 style={styles.label}
//               >
//                 Status
//               </Text>

//               {/* <Text
//                 style={[
//                   styles.value,
//                   {
//                     color:
//                       calendarData.status ===
//                       "Active"
//                         ? "#4CAF50"
//                         : calendarData.status ===
//                           "Paused"
//                         ? "#FF9800"
//                         : "#F44336",
//                   },
//                 ]}
//               >
//                 {
//                   calendarData.status ||
//                   "-"
//                 }
//               </Text> */}
//             </View>

//             {/* NEXT DELIVERY */}

//             {/* {calendarData.next_delivery_date && (
//               <View
//                 style={
//                   styles.row
//                 }
//               >
//                 <Text
//                   style={
//                     styles.label
//                   }
//                 >
//                   Next Delivery
//                 </Text>

//                 <Text
//                   style={
//                     styles.value
//                   }
//                 >
//                   {formatDate(
//                     calendarData.next_delivery_date
//                   )}
//                 </Text>
//               </View>
//             )} */}
//           </View>
//         )}

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
//     },

//     title: {
//       fontSize: 22,
//       fontWeight:
//         "700",
//       marginLeft: 12,
//     },

//     calendarCard: {
//       backgroundColor:
//         "#fff",
//       marginHorizontal: 16,
//       borderRadius: 15,
//       padding: 8,
//       elevation: 3,
//     },

//     deliveryCard: {
//       backgroundColor:
//         "#fff",
//       margin: 16,
//       padding: 16,
//       borderRadius: 15,
//       elevation: 3,
//     },

//     detailsCard: {
//       backgroundColor:
//         "#fff",
//       marginHorizontal: 16,
//       marginBottom: 16,
//       padding: 16,
//       borderRadius: 15,
//       elevation: 3,
//     },

//     legendCard: {
//       backgroundColor:
//         "#fff",
//       marginHorizontal: 16,
//       marginBottom: 30,
//       padding: 16,
//       borderRadius: 15,
//       elevation: 3,
//     },

//     cardTitle: {
//       fontSize: 18,
//       fontWeight:
//         "700",
//       marginBottom: 15,
//     },

//     row: {
//       flexDirection:
//         "row",
//       justifyContent:
//         "space-between",
//       marginVertical: 8,
//     },

//     label: {
//       color: "#666",
//       fontSize: 15,
//     },

//     value: {
//       fontSize: 15,
//       fontWeight:
//         "700",
//     },

//     noDelivery: {
//       color: "#777",
//       marginTop: 10,
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




import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
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
  const navigation = useNavigation();

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

  /* =========================================================
     LOAD CALENDAR
  ========================================================= */

  useEffect(() => {
    if (!subscriptionId) {
      console.log(
        "ERROR: subscriptionId is undefined"
      );

      Alert.alert(
        "Error",
        "Subscription ID is missing"
      );

      setLoading(false);

      return;
    }

    getCalendar();
  }, [subscriptionId]);

  /* =========================================================
     FORMAT API DATE TO INDIA DATE
     
     API example:
     2026-08-18T18:30:00.000Z

     India:
     2026-08-19

     IMPORTANT:
     We MUST convert UTC -> Asia/Kolkata.
  ========================================================= */

  const formatDate = (
    date: string | null | undefined
  ): string | null => {
    if (!date) {
      return null;
    }

    /* Already YYYY-MM-DD */
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return date;
    }

    try {
      const parsedDate = new Date(date);

      if (isNaN(parsedDate.getTime())) {
        console.log(
          "INVALID DATE:",
          date
        );

        return null;
      }

      /*
       * Convert UTC date to India date.
       *
       * en-CA gives:
       * YYYY-MM-DD
       *
       * Asia/Kolkata gives IST.
       */

      const indiaDate =
        new Intl.DateTimeFormat(
          "en-CA",
          {
            timeZone: "Asia/Kolkata",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        ).format(parsedDate);

      console.log(
        "DATE CONVERSION:",
        date,
        "=>",
        indiaDate
      );

      return indiaDate;
    } catch (error) {
      console.log(
        "DATE FORMAT ERROR:",
        error
      );

      return null;
    }
  };

  /* =========================================================
     GET CALENDAR API
  ========================================================= */

  const getCalendar = async () => {
    try {
      if (!subscriptionId) {
        console.log(
          "GET CALENDAR: subscriptionId missing"
        );

        return;
      }

      setLoading(true);

      const token =
        await AsyncStorage.getItem("token");

      const url =
        `${API_URL}/api/subscriptions/${subscriptionId}/calendar`;

      console.log(
        "CALENDAR URL:",
        url
      );

      const res = await fetch(url, {
        method: "GET",

        headers: {
          Authorization:
            `Bearer ${token}`,
          "Content-Type":
            "application/json",
        },
      });

      const text = await res.text();

      console.log(
        "CALENDAR RAW RESPONSE:",
        text
      );

      let json: any;

      try {
        json = JSON.parse(text);
      } catch (error) {
        console.log(
          "CALENDAR JSON ERROR:",
          error
        );

        Alert.alert(
          "Error",
          "Invalid response from server"
        );

        return;
      }

      console.log(
        "CALENDAR API:",
        JSON.stringify(
          json,
          null,
          2
        )
      );

      if (json.success) {
        const deliveries: Delivery[] =
          Array.isArray(
            json.calendar
          )
            ? json.calendar
            : [];

        setCalendarData(
          deliveries
        );

        console.log(
          "CALENDAR DATA:",
          JSON.stringify(
            deliveries,
            null,
            2
          )
        );

        console.log(
          "TOTAL DELIVERIES:",
          deliveries.length
        );
      } else {
        Alert.alert(
          "Error",
          json.message ||
            "Unable to load delivery calendar"
        );
      }
    } catch (error) {
      console.log(
        "CALENDAR ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load delivery calendar"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     GET STATUS COLOR
  ========================================================= */

  const getStatusColor = (
    status?: string
  ) => {
    switch (status) {
      case "Delivered":
        return "#4CAF50";

      case "Skipped":
        return "#9E9E9E";

      case "Paused":
        return "#FF9800";

      case "Cancelled":
        return "#F44336";

      case "Pending":
      case "Scheduled":
      case "Active":
      default:
        return "#2196F3";
    }
  };

  /* =========================================================
     SELECT DATE
  ========================================================= */

  // const handleDateSelect = (
  //   dateString: string
  // ) => {
  //   console.log(
  //     "SELECTED DATE:",
  //     dateString
  //   );

  //   setSelectedDate(
  //     dateString
  //   );

  //   /*
  //    * calendarData is the delivery array.
  //    */

  //   console.log(
  //     "SEARCHING DELIVERY FOR:",
  //     dateString
  //   );

  //   const delivery =
  //     calendarData.find(
  //       (item: Delivery) => {
  //         const deliveryDate =
  //           formatDate(
  //             item.delivery_date
  //           );

  //         console.log(
  //           "COMPARING:",
  //           deliveryDate,
  //           "WITH:",
  //           dateString,
  //           "DELIVERY ID:",
  //           item.id
  //         );

  //         return (
  //           deliveryDate ===
  //           dateString
  //         );
  //       }
  //     );

  //   console.log(
  //     "SELECTED DELIVERY:",
  //     JSON.stringify(
  //       delivery,
  //       null,
  //       2
  //     )
  //   );

  //   setSelectedDelivery(
  //     delivery || null
  //   );
  // };
const handleDateSelect = (dateString: string) => {
  console.log("================================");
  console.log("SELECTED DATE:", dateString);

  setSelectedDate(dateString);

  const delivery = calendarData.find(
    (item: Delivery) => {
      const deliveryDate = formatDate(
        item.delivery_date
      );

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
    }
  );

  console.log(
    "FINAL SELECTED DELIVERY:",
    JSON.stringify(
      delivery,
      null,
      2
    )
  );

  setSelectedDelivery(
    delivery || null
  );

  console.log("================================");
};
  /* =========================================================
     MARKED DATES
  ========================================================= */

  const markedDates = useMemo(() => {
    const marks: any = {};

    calendarData.forEach(
      (item: Delivery) => {
        const date =
          formatDate(
            item.delivery_date
          );

        if (!date) {
          return;
        }

        const color =
          getStatusColor(
            item.status
          );

        marks[date] = {
          marked: true,
          dotColor: color,
        };
      }
    );

    /*
     * Selected date should override
     * only the selected appearance,
     * while preserving the delivery dot.
     */

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),

        selected: true,

        selectedColor:
          "#673AB7",

        selectedTextColor:
          "#FFFFFF",
      };
    }

    return marks;
  }, [
    calendarData,
    selectedDate,
  ]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <SafeAreaView
        style={styles.loader}
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
          Loading calendar...
        </Text>
      </SafeAreaView>
    );
  }
  const handleSkipDelivery = async () => {
  if (!selectedDelivery?.id || !subscriptionId) {
    Alert.alert("Error", "Delivery information is missing");
    return;
  }

  Alert.alert(
    "Skip Delivery",
    `Are you sure you want to skip delivery for ${selectedDate}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Skip",
        onPress: async () => {
          try {
            const token =
              await AsyncStorage.getItem("token");

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
                subscriptionId: subscriptionId,
              }),
            });

            const text = await response.text();

            console.log(
              "SKIP RAW RESPONSE:",
              text
            );

            const json = JSON.parse(text);

            console.log(
              "SKIP RESPONSE:",
              json
            );

            if (json.success) {
              Alert.alert(
                "Success",
                "Delivery skipped successfully"
              );

              // Reload calendar from database
              await getCalendar();

              // Update selected delivery immediately
              setSelectedDelivery({
                ...selectedDelivery,
                status: "Skipped",
              });
            } else {
              Alert.alert(
                "Error",
                json.message ||
                  "Unable to skip delivery"
              );
            }
          } catch (error) {
            console.log(
              "SKIP DELIVERY ERROR:",
              error
            );

            Alert.alert(
              "Error",
              "Unable to skip delivery"
            );
          }
        },
      },
    ]
  );
};

  /* =========================================================
     UI
  ========================================================= */

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        {/* ================= HEADER ================= */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={
              styles.backButton
            }
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color="#222"
            />
          </TouchableOpacity>

          <Text
            style={styles.title}
          >
            Delivery Calendar
          </Text>
        </View>

        {/* ================= CALENDAR ================= */}

        <View
          style={
            styles.calendarCard
          }
        >
          <Calendar
            markedDates={
              markedDates
            }

            onDayPress={(
              day
            ) => {
              handleDateSelect(
                day.dateString
              );
            }}

            theme={{
              todayTextColor:
                "#4CAF50",

              arrowColor:
                "#4CAF50",

              selectedDayTextColor:
                "#FFFFFF",

              textDayFontSize:
                15,

              textMonthFontSize:
                18,

              textMonthFontWeight:
                "700",

              textDayHeaderFontSize:
                13,
            }}
          />
        </View>

        {/* ================= SELECTED DELIVERY ================= */}

        {selectedDate && (
          <View
            style={
              styles.deliveryCard
            }
          >
            <Text
              style={
                styles.cardTitle
              }
            >
              Delivery Details
            </Text>

            {/* DATE */}

            <View
              style={styles.row}
            >
              <Text
                style={
                  styles.label
                }
              >
                Date
              </Text>

              <Text
                style={
                  styles.value
                }
              >
                {selectedDate}
              </Text>
            </View>

            {/* DELIVERY */}

            {selectedDelivery ? (
              <>
                {/* STATUS */}

                <View
                  style={
                    styles.row
                  }
                >
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Status
                  </Text>

                  <Text
                    style={[
                      styles.value,
                      {
                        color:
                          getStatusColor(
                            selectedDelivery.status
                          ),
                      },
                    ]}
                  >
                    {
                      selectedDelivery.status ||
                      "Pending"
                    }
                  </Text>
                </View>

                {/* DELIVERY ID */}

                {selectedDelivery.id !==
                  undefined && (
                  <View
                    style={
                      styles.row
                    }
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Delivery ID
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {
                        selectedDelivery.id
                      }
                    </Text>
                  </View>
                )}

                {/* DELIVERY TIME */}

                {selectedDelivery.delivery_time && (
                  <View
                    style={
                      styles.row
                    }
                  >
                    <Text
                      style={
                        styles.label
                      }
                    >
                      Delivery Time
                    </Text>

                    <Text
                      style={
                        styles.value
                      }
                    >
                      {
                        selectedDelivery.delivery_time
                      }
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text
                style={
                  styles.noDelivery
                }
              >
                No delivery scheduled
                for this date.
              </Text>
            )}
          </View>
        )}
      {selectedDelivery?.status === "Pending" && (
  <TouchableOpacity
    style={styles.skipButton}
    onPress={handleSkipDelivery}
  >
    <Text style={styles.skipButtonText}>
      Skip This Delivery
    </Text>
  </TouchableOpacity>
)}

        {/* ================= DELIVERY LIST ================= */}

        <View
          style={
            styles.detailsCard
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Delivery Schedule
          </Text>

          {calendarData.length ===
          0 ? (
            <Text
              style={
                styles.noDelivery
              }
            >
              No deliveries found.
            </Text>
          ) : (
            calendarData.map(
              (
                delivery,
                index
              ) => {
                const date =
                  formatDate(
                    delivery.delivery_date
                  );

                return (
                  <TouchableOpacity
                    key={
                      delivery.id ||
                      index
                    }
                    style={[
                      styles.scheduleRow,

                      selectedDate ===
                        date &&
                        styles.selectedScheduleRow,
                    ]}
                    onPress={() => {
                      if (date) {
                        handleDateSelect(
                          date
                        );
                      }
                    }}
                  >
                    <View>
                      <Text
                        style={
                          styles.scheduleDate
                        }
                      >
                        {date ||
                          "-"}
                      </Text>

                      {delivery.delivery_time && (
                        <Text
                          style={
                            styles.scheduleTime
                          }
                        >
                          {
                            delivery.delivery_time
                          }
                        </Text>
                      )}
                    </View>

                    <Text
                      style={[
                        styles.scheduleStatus,
                        {
                          color:
                            getStatusColor(
                              delivery.status
                            ),
                        },
                      ]}
                    >
                      {
                        delivery.status ||
                        "Pending"
                      }
                    </Text>
                  </TouchableOpacity>
                );
              }
            )
          )}
        </View>

        {/* ================= LEGEND ================= */}

        <View
          style={
            styles.legendCard
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Calendar Legend
          </Text>

          <View
            style={styles.legend}
          >
            {/* SCHEDULED */}

            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      "#2196F3",
                  },
                ]}
              />

              <Text>
                Scheduled
              </Text>
            </View>

            {/* DELIVERED */}

            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      "#4CAF50",
                  },
                ]}
              />

              <Text>
                Delivered
              </Text>
            </View>

            {/* SKIPPED */}

            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      "#9E9E9E",
                  },
                ]}
              />

              <Text>
                Skipped
              </Text>
            </View>

            {/* PAUSED */}

            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      "#FF9800",
                  },
                ]}
              />

              <Text>
                Paused
              </Text>
            </View>

            {/* CANCELLED */}

            <View
              style={
                styles.legendItem
              }
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      "#F44336",
                  },
                ]}
              />

              <Text>
                Cancelled
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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

    loader: {
      flex: 1,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "#F7F7F7",
    },

    loadingText: {
      marginTop: 10,
      color: "#666",
    },

    header: {
      flexDirection:
        "row",
      alignItems:
        "center",
      padding: 16,
      backgroundColor:
        "#F7F7F7",
    },

    backButton: {
      padding: 4,
    },

    title: {
      fontSize: 22,
      fontWeight:
        "700",
      marginLeft: 12,
      color: "#222",
    },

    calendarCard: {
      backgroundColor:
        "#FFFFFF",
      marginHorizontal: 16,
      borderRadius: 15,
      padding: 8,
      elevation: 3,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    deliveryCard: {
      backgroundColor:
        "#FFFFFF",
      margin: 16,
      padding: 16,
      borderRadius: 15,
      elevation: 3,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    detailsCard: {
      backgroundColor:
        "#FFFFFF",
      marginHorizontal: 16,
      marginBottom: 16,
      padding: 16,
      borderRadius: 15,
      elevation: 3,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    legendCard: {
      backgroundColor:
        "#FFFFFF",
      marginHorizontal: 16,
      marginBottom: 30,
      padding: 16,
      borderRadius: 15,
      elevation: 3,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    cardTitle: {
      fontSize: 18,
      fontWeight:
        "700",
      marginBottom: 15,
      color: "#222",
    },

    row: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginVertical: 8,
    },

    label: {
      color: "#666",
      fontSize: 15,
    },
    skipButton: {
  backgroundColor: "#9E9E9E",
  paddingVertical: 13,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 15,
},

skipButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "700",
},

    value: {
      fontSize: 15,
      fontWeight:
        "700",
      color: "#222",
    },

    noDelivery: {
      color: "#777",
      marginTop: 10,
      fontSize: 14,
    },

    scheduleRow: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      paddingVertical: 13,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor:
        "#EEEEEE",
      borderRadius: 8,
    },

    selectedScheduleRow: {
      backgroundColor:
        "#F0E8FF",
    },

    scheduleDate: {
      fontSize: 15,
      fontWeight:
        "600",
      color: "#222",
    },

    scheduleTime: {
      fontSize: 13,
      color: "#777",
      marginTop: 3,
    },

    scheduleStatus: {
      fontSize: 14,
      fontWeight:
        "700",
    },

    legend: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
    },

    legendItem: {
      flexDirection:
        "row",
      alignItems:
        "center",
      marginBottom: 12,
      width: "48%",
    },

    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      marginRight: 7,
    },
  });