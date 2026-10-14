// import React, { useState } from "react";
// import {View,Text,StyleSheet,TouchableOpacity,Image, ScrollView,ActivityIndicator,} from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import {useNavigation,useRoute,useFocusEffect,} from "@react-navigation/native";
// import { API_URL } from "../config/api";

// const TimelineItem = ({ title,active,time,}: {title:string; active:boolean; time?:string;}) => {

// return (
// <View style={styles.timelineItem}>
// <View style={styles.timelineLeft}>

// <View style={active? styles.completedCircle: styles.pendingCircle}>
// {active &&
// <Ionicons name="checkmark" size={14} color="#fff"/>}
// </View>
// <View style={styles.timelineLine}/>
// </View>

// <View style={styles.timelineContent}>
// <Text style={active? styles.completedText: styles.pendingText}>{title}</Text>
// <Text style={styles.timelineTime}>{time || "Pending"}</Text>
// </View>
// </View>
// );
// };

// const TrackOrderScreen =()=>{
// const navigation = useNavigation<any>();
// const route = useRoute<any>();
// const {orderId}=route.params;
// const [order,setOrder]=useState<any>(null);
// const [loading,setLoading]=useState(true);


// useFocusEffect(
// React.useCallback(()=>{
// fetchOrder();
// },[orderId])
// );

// const fetchOrder=async()=>{
// try{
// setLoading(true);
// const token =await AsyncStorage.getItem("token");
// const response =await fetch(`${API_URL}/api/orders/${orderId}`,{
// headers:{
// Authorization:`Bearer ${token}`,
// "Content-Type":"application/json"
// }
// }
// );
// const data =await response.json();
// console.log("ORDER DATA",JSON.stringify(data,null,2));

// if(data.success){
// setOrder(data.order);
// }

// }
// catch(error){
// console.log(error);
// }
// finally{
// setLoading(false);
// }
// };
// if(loading){
// return(

// <SafeAreaView style={styles.container}>
// <ActivityIndicator size="large" color="#0A8A2A"/>
// </SafeAreaView>
// );
// }
// const status =(order?.status || "Pending").toLowerCase().trim();
// return(

// <SafeAreaView style={styles.container}>

// <ScrollView
// showsVerticalScrollIndicator={false}
// contentContainerStyle={{paddingBottom:40}}>

// <View style={styles.header}>
// <TouchableOpacity onPress={()=>navigation.goBack()}>
// <Ionicons name="arrow-back" size={24}/>
// </TouchableOpacity>
// <Text style={styles.headerTitle}>Track Order</Text>
// </View>

// <View style={styles.statusCard}>
// <View style={styles.badge}>
// <Text style={styles.badgeText}>
// {status==="pending"?"Order Confirmed":status.charAt(0).toUpperCase()+status.slice(1)}
// </Text>
// </View>




// <Text style={styles.arrivalText}>
// {status==="delivered"?"Order Delivered":status==="out for delivery"?"Out for Delivery":
// status==="packed"?"Order Packed":"Arriving Soon"}
// </Text>
// </View>





// <View style={styles.infoCard}>


// <Text style={styles.sectionTitle}>
// Order Information
// </Text>



// <View style={styles.row}>
// <Text style={{fontFamily:"Inter-Regular"}}>Order ID</Text>
// <Text style={{fontFamily:"Inter-Regular"}}>
// #{order?.order_id}</Text>
// </View>

// <View style={styles.row}>
// <Text style={{fontFamily:"Inter-Regular"}}>Payment</Text>
// <Text style={{fontFamily:"Inter-Regular"}}>{(order?.payment_method || "COD").toUpperCase()}</Text>
// </View>

// <View style={styles.row}>
// <Text style={{fontFamily:"Inter-Regular"}}>Ordered On</Text>
// <Text style={{fontFamily:"Inter-Regular",fontSize:10}}>{new Date(order?.created_at).toLocaleString()}</Text>
// </View>
// </View>


// <View style={styles.addressCard}>
// <Ionicons
// name="location-outline"
// size={22}
// color="#777"/>
// <View style={{marginLeft:10}}>
// <Text style={{fontFamily:"Inter-Regular"}}>Delivery Address</Text>
// <Text style={{fontFamily:"Inter-Regular",fontSize:10}}>{order?.address ||"Address not available"}</Text>
// </View>
// </View>
// <Text style={styles.sectionTitle}>ORDER STATUS</Text>
// <View style={styles.timelineContainer}>
// <View style={styles.timelineContainer}>
// <TimelineItem
// title="Order Placed"
// active={[
// "pending",
// "accepted",
// "packed",
// "out for delivery",
// "delivered"
// ].includes(status)}
// time={order?.created_at}/>

// <TimelineItem
// title="Accepted"
// active={[
// "accepted",
// "packed",
// "out for delivery",
// "delivered"
// ].includes(status)}
// time={
// [
// "accepted",
// "packed",
// "out for delivery",
// "delivered"
// ].includes(status)
// ?
// "Accepted by store"
// :
// "Pending"
// }

// />




// <TimelineItem

// title="Packed"

// active={[
// "packed",
// "out for delivery",
// "delivered"
// ].includes(status)}

// time={
// [
// "packed",
// "out for delivery",
// "delivered"
// ].includes(status)
// ?
// "Packed"
// :
// "Pending"
// }

// />




// <TimelineItem

// title="Out for Delivery"

// active={[
// "out for delivery",
// "delivered"
// ].includes(status)}

// time={
// [
// "out for delivery",
// "delivered"
// ].includes(status)
// ?
// "Driver is on the way"
// :
// "Pending"
// }

// />




// <TimelineItem

// title="Delivered"

// active={
// status==="delivered"
// }

// time={
// status==="delivered"
// ?
// "Delivered successfully"
// :
// "Pending"
// }/>
// </View>
// </View>


// <Text style={styles.sectionTitle}>Products</Text>
// <View style={styles.productCard}>
// {order?.products?.map(
// (item:any,index:number)=>(
// <View key={index}
// style={styles.productRow}>
// <Image source={{uri: encodeURI(`${API_URL}/uploads/${item.image}`)}}
// style={styles.productImage}/>
// <View style={{flex:1}}>
// <Text style={styles.productName}>{item.product_name}</Text>
// <Text style={styles.productText}>Quantity : {item.quantity}</Text>
// <Text style={styles.priceText}>₹{item.price}</Text>
// </View>
// </View>
// )
// )
// }
// </View>

// {/* ORDER SUMMARY */}
// <Text style={styles.sectionTitle}>Order Summary</Text>
// <View style={styles.summaryCard}>
// <View style={styles.summaryRow}>
// <Text style={{fontFamily:"Inter-Regular"}}>Subtotal</Text>
// <Text style={{fontFamily:"Inter-Regular"}}>₹{order?.total_amount}</Text>
// </View>
// <View style={styles.dashedLine}/>
// <View style={styles.summaryRow}>
// <Text style={{fontFamily:"Inter-Regular"}}>Delivery</Text>
// <Text
//   style={{
//     color:"#0A8A2A",
//     fontFamily:"Inter-Medium",
//   }}
// > Free</Text>
// </View>
// <View style={styles.dashedLine}/>
// <View style={styles.summaryRow}>
// <Text style={{fontFamily:"Inter-Regular"}}>Total Amount</Text>
// <Text style={{fontFamily:"Inter-Bold"}}> ₹{order?.total_amount}</Text>
// </View>
// </View>
// </ScrollView>
// </SafeAreaView>
// );

// };
// export default TrackOrderScreen;
// const styles = StyleSheet.create({

// container:{
// flex:1,
// backgroundColor:"#F8F8F8",
// paddingHorizontal:16,
// },


// header:{
// flexDirection:"row",
// alignItems:"center",
// marginTop:10,
// marginBottom:20,
// },


// headerTitle:{
//   fontSize:18,
//   fontFamily:"Inter-Bold",
//   marginLeft:12,
// },
// statusCard:{
// backgroundColor:"#fff",
// borderRadius:14,
// padding:16,
// marginBottom:15,
// },
// badge:{
// backgroundColor:"#DDF5DD",
// paddingHorizontal:12,
// paddingVertical:6,
// borderRadius:20,
// alignSelf:"flex-start",
// },
// badgeText:{
//   color:"#0A8A2A",
//   fontFamily:"Inter-SemiBold",
//   fontSize:13,
// },
// arrivalText:{
//   fontSize:15,
//   fontFamily:"Inter-Bold",
//   marginTop:10,
// },
// infoCard:{
// backgroundColor:"#fff",
// padding:16,
// borderRadius:14,
// marginBottom:15,
// },
// row:{
// flexDirection:"row",
// justifyContent:"space-between",
// marginBottom:12,
// },
// addressCard:{
// backgroundColor:"#fff",
// padding:16,
// borderRadius:14,
// flexDirection:"row",
// marginBottom:20,
// },
// sectionTitle:{
//   fontSize:15,
//   fontFamily:"Inter-Bold",
//   marginBottom:15,
//   marginTop:10,
// },
// timelineContainer:{
// marginBottom:20,
// },
// timelineItem:{
// flexDirection:"row",
// },
// timelineLeft:{
// width:25,
// alignItems:"center",
// },
// completedCircle:{
// width:22,
// height:22,
// borderRadius:11,
// backgroundColor:"#0A8A2A",
// justifyContent:"center",
// alignItems:"center",
// },
// pendingCircle:{
// width:22,
// height:22,
// borderRadius:11,
// backgroundColor:"#D5D5D5",
// },
// timelineLine:{
// width:2,
// height:45,
// backgroundColor:"#DDD",
// },
// timelineContent:{
// marginLeft:15,
// marginBottom:10,
// },
// completedText:{
//   fontSize:16,
//   fontFamily:"Inter-SemiBold",
// },
// pendingText:{
//   fontSize:14,
//   color:"#999",
//   fontFamily:"Inter-Regular",
// },
// timelineTime:{
//   fontSize:10,
//   color:"#888",
//   marginTop:3,
//   fontFamily:"Inter-Regular",
// },

// productCard:{
// backgroundColor:"#fff",
// padding:15,
// borderRadius:14,
// marginBottom:20,
// },
// productRow:{
// flexDirection:"row",
// alignItems:"center",
// marginBottom:15,
// },
// productImage:{
// width:70,
// height:70,
// borderRadius:10,
// marginRight:12,
// },
// productName:{
//   fontSize:13,
//   fontFamily:"Inter-Bold",
// },
// productText:{
//   color:"#666",
//   marginTop:5,
//   fontFamily:"Inter-Regular",
// },
// priceText:{
//   color:"#0A8A2A",
//   fontFamily:"Inter-Bold",
//   marginTop:5,
// },
// summaryCard:{
// backgroundColor:"#fff",
// padding:16,
// borderRadius:14,
// marginBottom:30,
// },

// summaryRow:{
// flexDirection:"row",
// justifyContent:"space-between",
// alignItems:"center",
// },
// dashedLine:{
// borderWidth:0.5,
// borderStyle:"dashed",
// borderColor:"#ccc",
// marginVertical:12,
// },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

import { API_URL } from "../config/api";


// =====================================================
// TIMELINE ITEM
// =====================================================

const TimelineItem = ({
  title,
  active,
  time,
}: {
  title: string;
  active: boolean;
  time?: string;
}) => {
  return (
    <View style={styles.timelineItem}>

      <View style={styles.timelineLeft}>

        <View
          style={
            active
              ? styles.completedCircle
              : styles.pendingCircle
          }
        >
          {active && (
            <Ionicons
              name="checkmark"
              size={14}
              color="#fff"
            />
          )}
        </View>

        <View style={styles.timelineLine} />

      </View>

      <View style={styles.timelineContent}>

        <Text
          style={
            active
              ? styles.completedText
              : styles.pendingText
          }
        >
          {title}
        </Text>

        <Text style={styles.timelineTime}>
          {time || "Pending"}
        </Text>

      </View>

    </View>
  );
};


// =====================================================
// TRACK ORDER SCREEN
// =====================================================

const TrackOrderScreen = () => {

  const navigation = useNavigation<any>();

  const route = useRoute<any>();

  // IMPORTANT:
  // These values are coming from MyOrdersScreen

  const {
    orderId,
    orderType,
    subscriptionId,
    deliveryId,
  } = route.params || {};


  const [order, setOrder] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH WHEN SCREEN OPENS / FOCUSES
  // =====================================================

  // useFocusEffect(
  //   React.useCallback(() => {

  //     fetchOrder();

  //   }, [
  //     orderId,
  //     orderType,
  //     subscriptionId,
  //     deliveryId,
  //   ])
  // );
useFocusEffect(
  React.useCallback(() => {

    // Fetch immediately
    fetchOrder();

    // Then check the latest status every 5 seconds
    const interval = setInterval(() => {
      fetchOrder();
    }, 5000);

    // Stop checking when leaving the screen
    return () => {
      clearInterval(interval);
    };

  }, [
    orderId,
    orderType,
    subscriptionId,
    deliveryId,
  ])
);

  // =====================================================
  // FETCH ORDER
  // =====================================================

  const fetchOrder = async () => {

    try {

      setLoading(true);

      const token =
        await AsyncStorage.getItem("token");


      if (!token) {

        console.log(
          "TOKEN NOT FOUND"
        );

        return;
      }


      // =================================================
      // INSTANT ORDER
      // =================================================

      if (
        orderType !== "subscription"
      ) {

        console.log(
          "FETCHING INSTANT ORDER:",
          orderId
        );


        const response =
          await fetch(
            `${API_URL}/api/orders/${orderId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );


        const data =
          await response.json();


        console.log(
          "INSTANT ORDER DATA:",
          JSON.stringify(
            data,
            null,
            2
          )
        );


        if (data.success) {

          setOrder(
            data.order
          );

        }

        return;
      }


      // =================================================
      // SUBSCRIPTION
      // =================================================

      console.log(
        "FETCHING SUBSCRIPTION:",
        subscriptionId
      );


      const response =
        await fetch(
          `${API_URL}/api/subscriptions/${subscriptionId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          }
        );


      const data =
        await response.json();


      console.log(
        "SUBSCRIPTION DATA:",
        JSON.stringify(
          data,
          null,
          2
        )
      );


      if (
        data.success &&
        data.subscription
      ) {

        const subscription =
          data.subscription;


        // ---------------------------------------------
        // Find the exact delivery
        // ---------------------------------------------

        const deliveries =
          Array.isArray(
            subscription.deliveries
          )
            ? subscription.deliveries
            : [];


        const selectedDelivery =
          deliveries.find(
            (delivery: any) =>
              Number(delivery.id) ===
              Number(deliveryId)
          );


        console.log(
          "SELECTED SUBSCRIPTION DELIVERY:",
          selectedDelivery
        );


        // ---------------------------------------------
        // Create order-like object
        // ---------------------------------------------

        const subscriptionOrder = {

          id:
            selectedDelivery?.id ||
            deliveryId,

          order_id:
            selectedDelivery?.id ||
            deliveryId,

          orderType:
            "subscription",

          subscription_id:
            subscription.id,

          delivery_id:
            selectedDelivery?.id ||
            deliveryId,


          // IMPORTANT
          // This is the rider-updated status

          status:
            selectedDelivery?.status ||
            "Pending",


          plan:
            subscription.plan,

          frequency:
            subscription.frequency,

          delivery_time:
            subscription.delivery_time,


          payment_method:
            subscription.payment_method,


          created_at:
            selectedDelivery?.delivery_date ||
            subscription.start_date,


          delivery_date:
            selectedDelivery?.delivery_date,


          address:
            subscription.address ||
            "Address not available",


          products:
            Array.isArray(
              subscription.products
            )
              ? subscription.products
              : [],


          total_amount:
            subscription.products?.reduce(
              (
                total: number,
                item: any
              ) =>
                total +
                Number(
                  item.price || 0
                ) *
                Number(
                  item.quantity || 0
                ),
              0
            ) || 0,

        };


        console.log(
          "SUBSCRIPTION TRACK ORDER:",
          subscriptionOrder
        );


        setOrder(
          subscriptionOrder
        );

      }

    } catch (error) {

      console.log(
        "TRACK ORDER ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <SafeAreaView
        style={styles.container}
      >

        <ActivityIndicator
          size="large"
          color="#0A8A2A"
        />

      </SafeAreaView>

    );

  }


  // =====================================================
  // STATUS
  // =====================================================

  const status =
    (
      order?.status ||
      "Pending"
    )
      .toLowerCase()
      .trim();


  // =====================================================
  // SUBSCRIPTION STATUS
  // =====================================================

  const isSubscription =
    orderType === "subscription";


  // =====================================================
  // STATUS LABEL
  // =====================================================

  let statusLabel =
    "Order Confirmed";


  if (
    status === "accepted"
  ) {

    statusLabel =
      "Accepted";

  } else if (
    status === "packed"
  ) {

    statusLabel =
      "Packed";

  } else if (
    status === "picked up"
  ) {

    statusLabel =
      "Picked Up";

  } else if (
    status === "out for delivery"
  ) {

    statusLabel =
      "Out for Delivery";

  } else if (
    status === "delivered"
  ) {

    statusLabel =
      "Delivered";

  }


  // =====================================================
  // ARRIVAL TEXT
  // =====================================================

  let arrivalText =
    "Arriving Soon";


  if (
    status === "accepted"
  ) {

    arrivalText =
      "Order Accepted";

  } else if (
    status === "packed"
  ) {

    arrivalText =
      "Order Packed";

  } else if (
    status === "picked up"
  ) {

    arrivalText =
      "Order Picked Up";

  } else if (
    status === "out for delivery"
  ) {

    arrivalText =
      "Out for Delivery";

  } else if (
    status === "delivered"
  ) {

    arrivalText =
      "Order Delivered";

  }


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >

            <Ionicons
              name="arrow-back"
              size={24}
            />

          </TouchableOpacity>

          <Text
            style={styles.headerTitle}
          >
            Track Order
          </Text>

        </View>


        {/* =================================================
            STATUS CARD
        ================================================= */}

        <View
          style={styles.statusCard}
        >

          <View style={styles.badge}>

            <Text
              style={styles.badgeText}
            >
              {statusLabel}
            </Text>

          </View>


          <Text
            style={styles.arrivalText}
          >
            {arrivalText}
          </Text>

        </View>


        {/* =================================================
            ORDER INFORMATION
        ================================================= */}

        <View
          style={styles.infoCard}
        >

          <Text
            style={styles.sectionTitle}
          >
            Order Information
          </Text>


          <View style={styles.row}>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Order ID
            </Text>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              #{order?.order_id ||
                order?.id}
            </Text>

          </View>


          <View style={styles.row}>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Payment
            </Text>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              {(
                order?.payment_method ||
                "COD"
              ).toUpperCase()}
            </Text>

          </View>


          <View style={styles.row}>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Ordered On
            </Text>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
                fontSize: 10,
              }}
            >
              {order?.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleString()
                : "-"}
            </Text>

          </View>

        </View>


        {/* =================================================
            ADDRESS
        ================================================= */}

        <View
          style={styles.addressCard}
        >

          <Ionicons
            name="location-outline"
            size={22}
            color="#777"
          />

          <View
            style={{
              marginLeft: 10,
              flex: 1,
            }}
          >

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Delivery Address
            </Text>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
                fontSize: 10,
              }}
            >
              {order?.address ||
                "Address not available"}
            </Text>

          </View>

        </View>


        {/* =================================================
            ORDER STATUS
        ================================================= */}

        <Text
          style={styles.sectionTitle}
        >
          ORDER STATUS
        </Text>


        <View
          style={styles.timelineContainer}
        >


          {/* ORDER PLACED */}

          <TimelineItem
            title="Order Placed"

            active={[
              "pending",
              "accepted",
              "packed",
              "picked up",
              "out for delivery",
              "delivered",
            ].includes(status)}

            time={
              order?.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleString()
                : "Pending"
            }
          />


          {/* ACCEPTED */}

          <TimelineItem
            title="Accepted"

            active={[
              "accepted",
              "packed",
              "picked up",
              "out for delivery",
              "delivered",
            ].includes(status)}

            time={
              [
                "accepted",
                "packed",
                "picked up",
                "out for delivery",
                "delivered",
              ].includes(status)
                ? "Accepted by rider"
                : "Pending"
            }
          />


          {/* PACKED / PICKED UP */}

          <TimelineItem
            title={
              isSubscription
                ? "Picked Up"
                : "Packed"
            }

            active={
              isSubscription
                ? [
                    "picked up",
                    "out for delivery",
                    "delivered",
                  ].includes(status)
                : [
                    "packed",
                    "out for delivery",
                    "delivered",
                  ].includes(status)
            }

            time={
              isSubscription
                ? [
                    "picked up",
                    "out for delivery",
                    "delivered",
                  ].includes(status)
                  ? "Order picked up"
                  : "Pending"
                : [
                    "packed",
                    "out for delivery",
                    "delivered",
                  ].includes(status)
                  ? "Packed"
                  : "Pending"
            }
          />


          {/* OUT FOR DELIVERY */}

          <TimelineItem
            title="Out for Delivery"

            active={[
              "out for delivery",
              "delivered",
            ].includes(status)}

            time={
              [
                "out for delivery",
                "delivered",
              ].includes(status)
                ? "Driver is on the way"
                : "Pending"
            }
          />


          {/* DELIVERED */}

          <TimelineItem
            title="Delivered"

            active={
              status ===
              "delivered"
            }

            time={
              status ===
              "delivered"
                ? "Delivered successfully"
                : "Pending"
            }
          />

        </View>


        {/* =================================================
            PRODUCTS
        ================================================= */}

        <Text
          style={styles.sectionTitle}
        >
          Products
        </Text>


        <View
          style={styles.productCard}
        >

          {order?.products?.map(
            (
              item: any,
              index: number
            ) => (

              <View
                key={index}
                style={styles.productRow}
              >

                <Image
                  source={{
                    uri: item.image
                      ? encodeURI(
                          item.image.startsWith(
                            "http"
                          )
                            ? item.image
                            : `${API_URL}/uploads/${item.image}`
                        )
                      : "",
                  }}
                  style={
                    styles.productImage
                  }
                />


                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={
                      styles.productName
                    }
                  >
                    {item.product_name ||
                      item.name}
                  </Text>


                  <Text
                    style={
                      styles.productText
                    }
                  >
                    Quantity :{" "}
                    {item.quantity}
                  </Text>


                  <Text
                    style={
                      styles.priceText
                    }
                  >
                    ₹{item.price}
                  </Text>

                </View>

              </View>

            )
          )}

        </View>


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <Text
          style={styles.sectionTitle}
        >
          Order Summary
        </Text>


        <View
          style={styles.summaryCard}
        >

          <View
            style={styles.summaryRow}
          >

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Subtotal
            </Text>

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              ₹{order?.total_amount || 0}
            </Text>

          </View>


          <View
            style={styles.dashedLine}
          />


          <View
            style={styles.summaryRow}
          >

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Delivery
            </Text>

            <Text
              style={{
                color: "#0A8A2A",
                fontFamily:
                  "Inter-Medium",
              }}
            >
              Free
            </Text>

          </View>


          <View
            style={styles.dashedLine}
          />


          <View
            style={styles.summaryRow}
          >

            <Text
              style={{
                fontFamily:
                  "Inter-Regular",
              }}
            >
              Total Amount
            </Text>

            <Text
              style={{
                fontFamily:
                  "Inter-Bold",
              }}
            >
              ₹{order?.total_amount || 0}
            </Text>

          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};


export default TrackOrderScreen;


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    marginLeft: 12,
  },

  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 15,
  },

  badge: {
    backgroundColor: "#DDF5DD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#0A8A2A",
    fontFamily: "Inter-SemiBold",
    fontSize: 13,
  },

  arrivalText: {
    fontSize: 15,
    fontFamily: "Inter-Bold",
    marginTop: 10,
  },

  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  addressCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 15,
    fontFamily: "Inter-Bold",
    marginBottom: 15,
    marginTop: 10,
  },

  timelineContainer: {
    marginBottom: 20,
  },

  timelineItem: {
    flexDirection: "row",
  },

  timelineLeft: {
    width: 25,
    alignItems: "center",
  },

  completedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0A8A2A",
    justifyContent: "center",
    alignItems: "center",
  },

  pendingCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#D5D5D5",
  },

  timelineLine: {
    width: 2,
    height: 45,
    backgroundColor: "#DDD",
  },

  timelineContent: {
    marginLeft: 15,
    marginBottom: 10,
  },

  completedText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },

  pendingText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Inter-Regular",
  },

  timelineTime: {
    fontSize: 10,
    color: "#888",
    marginTop: 3,
    fontFamily: "Inter-Regular",
  },

  productCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },

  productName: {
    fontSize: 13,
    fontFamily: "Inter-Bold",
  },

  productText: {
    color: "#666",
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },

  priceText: {
    color: "#0A8A2A",
    fontFamily: "Inter-Bold",
    marginTop: 5,
  },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 30,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dashedLine: {
    borderWidth: 0.5,
    borderStyle: "dashed",
    borderColor: "#ccc",
    marginVertical: 12,
  },

});