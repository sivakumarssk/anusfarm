import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation }from '@react-navigation/native';
import OrderCard from '../components/OrderCard';
import {View,Text,StyleSheet,TouchableOpacity,Image,ScrollView,} from 'react-native';
import DateSelector from '../components/DateSelector';
import { Ionicons }from '@expo/vector-icons';
import {  SafeAreaView,} from 'react-native-safe-area-context';
import OrdersHeader from '../components/OrderHeader';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { API_URL } from "../config/api";
const MyOrdersScreen = () => {
  const [selectedDate, setSelectedDate] =useState(new Date());
  const navigation =useNavigation<any>();
   const [orders, setOrders] = useState<any[]>([]);

  const [selectedTab,setSelectedTab,] = useState<'instant' | 'subscription'>('instant');
    
  // const BASE_URL = "http://192.168.0.112:5000/api";
 
   useFocusEffect(
  useCallback(() => {
    loadOrders();
  }, [])
);


// const loadOrders = async () => {
//   try {
//     const token = await AsyncStorage.getItem("token");

//     if (!token) {
//       console.log("TOKEN NOT FOUND");
//       return;
//     }

//     // =========================
//     // INSTANT ORDERS
//     // =========================

//     const ordersResponse = await fetch(
//       `${API_URL}/api/orders/my`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const ordersJson = await ordersResponse.json();

//     console.log("MY INSTANT ORDERS:", ordersJson);

//     let instantOrders: any[] = [];

//     if (ordersJson.success) {
//       instantOrders = ordersJson.orders.map(
//         (order: any) => ({
//           id: order.id,
//           orderId: order.id.toString(),
//           orderType: "instant",
//           deliveryDate: order.created_at,
//           created_at: order.created_at,
//           status: order.status.toLowerCase(),

//           products: order.products.map(
//             (item: any) => ({
//               ...item,
//               image: encodeURI(
//                 `${API_URL.replace(
//                   "/api",
//                   ""
//                 )}/uploads/${item.image}`
//               ),
//             })
//           ),

//           total: order.total_amount,
//         })
//       );
//     }

//     // =========================
//     // SUBSCRIPTIONS
//     // =========================

//     const subscriptionResponse =
//       await fetch(
//         `${API_URL}/api/subscriptions/my`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//     const subscriptionJson =
//       await subscriptionResponse.json();

//     console.log(
//       "MY SUBSCRIPTIONS:",
//       subscriptionJson
//     );

// console.log(
//   "SUBSCRIPTION PRODUCT IMAGES:",
//   JSON.stringify(
//     subscriptionJson.subscriptions?.map((subscription: any) => ({
//       subscriptionId: subscription.id,
//       products: subscription.products,
//     })),
//     null,
//     2
//   )
// );
//     let subscriptionOrders: any[] = [];

//     if (
//       subscriptionJson.success &&
//       Array.isArray(subscriptionJson.subscriptions)
//     ) {
//       subscriptionJson.subscriptions.forEach(
//         (subscription: any) => {

//           const deliveries =
//             Array.isArray(subscription.deliveries)
//               ? subscription.deliveries
//               : [];

//           const products =
//             Array.isArray(subscription.products)
//               ? subscription.products
//               : [];

//           deliveries.forEach(
//             (delivery: any) => {

//               subscriptionOrders.push({
//                 id: delivery.id,

//                 orderId:
//                   `SUB-${subscription.id}-${delivery.id}`,

//                 orderType: "subscription",

//                 subscriptionId:
//                   subscription.id,

//                 deliveryId:
//                   delivery.id,

//                 deliveryStatus:
//                   delivery.status,

//                 status: "scheduled",

//                 deliveryDate:
//                   delivery.delivery_date,

//                 created_at:
//                   delivery.delivery_date,

//                 products: products.map(
//                   (item: any) => ({
//                     ...item,

//                     // image: item.image
//                     //   ? encodeURI(
//                     //       `${API_URL.replace(
//                     //         "/api",
//                     //         ""
//                     //       )}/uploads/${item.image}`
//                     //     )
//                     //   : null,
                    
// image: item.image
//   ? item.image.startsWith("http")
//     ? encodeURI(item.image)
//     : encodeURI(
//         `${API_URL.replace(/\/api\/?$/, "")}/uploads/${item.image.replace(/^\/?uploads\//, "")}`
//       )
//   : null,
//                   })
//                 ),

//                 total: products.reduce(
//                   (
//                     total: number,
//                     item: any
//                   ) =>
//                     total +
//                     Number(item.price || 0) *
//                     Number(item.quantity || 0),
//                   0
//                 ),

//                 plan:
//                   subscription.plan,

//                 frequency:
//                   subscription.frequency,

//                 delivery_time:
//                   subscription.delivery_time,
//               });
//             }
//           );
//         }
//       );
//     }

//     // =========================
//     // COMBINE ORDERS
//     // =========================

//     const allOrders = [
//       ...instantOrders,
//       ...subscriptionOrders,
//     ];

//     console.log(
//       "ALL ORDERS:",
//       allOrders
//     );

//     setOrders(allOrders);

//   } catch (error) {

//     console.log(
//       "LOAD ORDERS ERROR:",
//       error
//     );

//   }
// };
const loadOrders = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      console.log("TOKEN NOT FOUND");
      return;
    }

    // ==========================================
    // LOAD INSTANT + SUBSCRIPTION AT SAME TIME
    // ==========================================

    const [ordersResponse, subscriptionResponse] =
      await Promise.all([
        fetch(`${API_URL}/api/orders/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_URL}/api/subscriptions/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

    // Convert both responses at same time
    const [ordersJson, subscriptionJson] =
      await Promise.all([
        ordersResponse.json(),
        subscriptionResponse.json(),
      ]);

    // console.log("MY INSTANT ORDERS:", ordersJson);
    // console.log("MY SUBSCRIPTIONS:", subscriptionJson);

    // ==========================================
    // INSTANT ORDERS
    // ==========================================

    let instantOrders: any[] = [];

    if (
      ordersJson.success &&
      Array.isArray(ordersJson.orders)
    ) {
      instantOrders = ordersJson.orders.map(
        (order: any) => ({
          id: order.id,

          orderId: order.id.toString(),

          orderType: "instant",

          deliveryDate: order.created_at,

          created_at: order.created_at,

          status: order.status
            ? order.status.toLowerCase()
            : "pending",

          products: Array.isArray(order.products)
            ? order.products.map((item: any) => ({
                ...item,

                image: item.image
                  ? item.image.startsWith("http")
                    ? encodeURI(item.image)
                    : encodeURI(
                        `${API_URL.replace(
                          /\/api\/?$/,
                          ""
                        )}/uploads/${item.image.replace(
                          /^\/?uploads\//,
                          ""
                        )}`
                      )
                  : null,
              }))
            : [],

          total: order.total_amount,
        })
      );
    }

    // ==========================================
    // SUBSCRIPTION ORDERS
    // ==========================================

    let subscriptionOrders: any[] = [];

    if (
      subscriptionJson.success &&
      Array.isArray(subscriptionJson.subscriptions)
    ) {
      subscriptionJson.subscriptions.forEach(
        (subscription: any) => {
          const deliveries =
            Array.isArray(subscription.deliveries)
              ? subscription.deliveries
              : [];

          const products =
            Array.isArray(subscription.products)
              ? subscription.products
              : [];

          deliveries.forEach((delivery: any) => {
            subscriptionOrders.push({
              id: delivery.id,

              orderId: `SUB-${subscription.id}-${delivery.id}`,

              orderType: "subscription",

              subscriptionId: subscription.id,

              deliveryId: delivery.id,

              deliveryStatus: delivery.status,

              status: "scheduled",

              deliveryDate: delivery.delivery_date,

              created_at: delivery.delivery_date,

              products: products.map((item: any) => ({
                ...item,

                image: item.image
                  ? item.image.startsWith("http")
                    ? encodeURI(item.image)
                    : encodeURI(
                        `${API_URL.replace(
                          /\/api\/?$/,
                          ""
                        )}/uploads/${item.image.replace(
                          /^\/?uploads\//,
                          ""
                        )}`
                      )
                  : null,
              })),

              total: products.reduce(
                (total: number, item: any) =>
                  total +
                  Number(item.price || 0) *
                    Number(item.quantity || 0),
                0
              ),

              plan: subscription.plan,

              frequency: subscription.frequency,

              delivery_time:
                subscription.delivery_time,
            });
          });
        }
      );
    }

    // ==========================================
    // COMBINE
    // ==========================================

    const allOrders = [
      ...instantOrders,
      ...subscriptionOrders,
    ];

    console.log(
      "INSTANT ORDERS COUNT:",
      instantOrders.length
    );

    console.log(
      "SUBSCRIPTION ORDERS COUNT:",
      subscriptionOrders.length
    );

    setOrders(allOrders);

  } catch (error) {
    console.log(
      "LOAD ORDERS ERROR:",
      error
    );
  }
};

const filteredOrders = selectedTab === 'instant' ? orders.filter(
   order => order.orderType ==='instant'  ): orders.filter(
        order =>order.orderType ==='subscription');

  


 const todayOrders =
  filteredOrders.filter(order => {

    const orderDate =
      new Date(
        order.deliveryDate
      );

   return (
  orderDate.toDateString() ===
  selectedDate.toDateString()
);

  });

 const filteredScheduledOrders =
  filteredOrders.filter(
    order => {

      const orderDate =
        new Date(
          order.deliveryDate
        );

      return (
        order.status ===
          'scheduled' &&
        orderDate.toDateString() !==
selectedDate.toDateString()
      );

    }
  );
  const pendingOrders = filteredOrders.filter(
  order => order.status === "pending"
);



 const filteredDeliveredOrders =
 filteredOrders
 .filter(order => order.status === "delivered")
 .sort(
   (a,b)=>Number(b.orderId)-Number(a.orderId)
 );




  return (

    <SafeAreaView style={styles.container}>

       <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 120,
    }}
  >
<View style={styles.contentContainer}>


      <OrdersHeader />
</View>


      <View
        style={styles.reminderContainer}
      >

        <Text
          style={styles.reminderText}
        >
          Place order for tomorrow
        </Text>

      </View>

 <View>
  <DateSelector
    selectedDate={selectedDate}
    onSelectDate={setSelectedDate}
  />
</View>

<View style={styles.contentContainer}>



  {
  todayOrders.length > 0 ? (

    <>
      <Text
        style={{
          fontSize: 14,
         fontFamily:"Inter-SemiBold",
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        Today's Delivery
      </Text>

      {
        todayOrders.map(order => (

         <OrderCard
  key={order.orderId}
  order={order}
  showActionButton={
    selectedTab === 'subscription' &&
    order.status === 'scheduled'
  }
  onPressAction={() =>
    navigation.navigate(
      'EditSchedule',
      {
        order,
      })
  }

//   onPress={() =>
//  navigation.navigate("OrderDetails", {
//    orderId: order.id
//  })
//   }

onPress={() =>
 navigation.navigate("OrderDetails", {
   order: order
 })
}
/>

        ))
      }
    </>

  ) : (

    <View
      style={styles.emptyStateContainer}
    >

      <Image
        source={require('../../assets/icons/orders-basket.png')}
        style={styles.basketImage}
        resizeMode="contain"
      />

      <Text
        style={styles.emptyTitle}
      >
        No Scheduled Deliveries Today
      </Text>

    </View>

  )
}

      <View style={styles.tabContainer}>

  <TouchableOpacity
    style={[
      styles.tabButton,

      selectedTab ===
        'instant' &&
      styles.activeTab,
    ]}
    onPress={() =>
      setSelectedTab(
        'instant'
      )
    }
  >

    <Text
      style={
        selectedTab ===
        'instant'
          ? styles.activeTabText
          : styles.tabText
      }
    >
      Instant
    </Text>

  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.tabButton,

      selectedTab ===
        'subscription' &&
      styles.activeTab,
    ]}
    onPress={() =>
      setSelectedTab(
        'subscription'
      )
    }
  >

    <Text
      style={
        selectedTab ===
        'subscription'
          ? styles.activeTabText
          : styles.tabText
      }
    >
      Subscription
    </Text>

  </TouchableOpacity>

</View>

    

     {
  filteredOrders.length === 0 ? (

    <View
      style={styles.emptyStateContainer}
    >

      <Image
        source={require('../../assets/icons/orders-basket.png')}
        style={styles.basketImage}
        resizeMode="contain"
      />

      <Text
        style={styles.emptyTitle}
      >
        No Scheduled Deliveries
      </Text>

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={() =>
          navigation.navigate(
            'Products'
          )
        }
      >

        <Text
          style={
            styles.scheduleButtonText
          }
        >
          Schedule Now
        </Text>

      </TouchableOpacity>

    </View>

  ) : (
<View>

  {/* Scheduled Orders */}

{
  selectedTab === 'subscription' && (
    <>
      <Text
        style={{
          fontSize: 16,
          fontFamily:"Inter-SemiBold",
          marginBottom: 12,
          marginTop: 8,
        }}
      >
        Scheduled Orders
      </Text>

      {
        filteredScheduledOrders.length === 0 ? (

          <View style={styles.emptyStateContainer}>

            <Image
              source={require('../../assets/icons/orders-basket.png')}
              style={styles.basketImage}
              resizeMode="contain"
            />

            <Text style={styles.emptyTitle}>
              No Scheduled Orders
            </Text>

            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={() =>
                navigation.navigate('Products')
              }
            >
              <Text style={styles.scheduleButtonText}>
                Schedule Now
              </Text>
            </TouchableOpacity>

          </View>

        ) : (

          filteredScheduledOrders.map(order => (

            <OrderCard
  key={order.orderId}
  order={order}
  showActionButton={true}
  onPressAction={() =>
    navigation.navigate('EditSchedule', { order })
  }
  onPress={() =>
 navigation.navigate("TrackOrder", {
 orderId: order.id
 })
}
/>
          ))

        )
      }
    </>
  )
}
{/* Pending Orders */}

<Text
  style={{
  fontFamily: "Inter-SemiBold",
  fontSize: 16,
  fontWeight: "600",
  marginTop: 12,
  marginBottom: 12,
}}
>
  Pending Orders
</Text>


{
  pendingOrders.length === 0 ? (

    <Text
      style={{
        color:"#777",
        marginBottom:10,
        fontFamily:"Inter-Medium"
      }}
    >
      No Pending Orders
    </Text>

  ) : (

    pendingOrders.map(order => (
<OrderCard
  key={order.orderId}
  order={order}
  showActionButton={false}
  onPress={() => {
    console.log("Navigate to:", order.orderId);
    navigation.navigate("TrackOrder", {
     orderId: order.id,
    });
  }}
/>

    ))

  )
}

  {/* Delivered Orders */}

 <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  }}
>

  <Text
    style={{
      fontSize: 16,
      fontFamily:"Inter-SemiBold"
    }}
  >
    Delivered Orders
  </Text>

<TouchableOpacity
onPress={()=>{
  navigation.navigate("OrderHistory")
}}
>
  <Ionicons
    name="arrow-forward"
    size={20}
    color="#000"
  />
</TouchableOpacity>

</View>

 {
  filteredDeliveredOrders.map(
    order => (

    <OrderCard
  key={order.orderId}
  order={order}
  showActionButton={false}
  onPress={() =>
    navigation.navigate("TrackOrder", {
      orderId: order.id
    })
  }
/>

    ))
}

</View>
    

  )
}

</View>
</ScrollView>
    </SafeAreaView>

  );

};

export default MyOrdersScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',

  },

  reminderContainer: {
    height: 46,
   backgroundColor: '#D6E1D5',
    justifyContent: 'center',

  },

 reminderText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#888",
    marginLeft: 20,
  },


  emptyStateContainer: {
  backgroundColor: '#D6E1D5',
  borderRadius: 8,

  alignItems: 'center',

  paddingVertical: 28,
  marginTop:8

},

basketImage: {
  width: 50,
  height: 50,
  marginBottom: 12,
},

emptyTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 18,
  },

scheduleButton: {
  backgroundColor: '#000',

  width: 160,
  height: 42,

  borderRadius: 8,

  justifyContent: 'center',
  alignItems: 'center',
},

 scheduleButtonText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

tabContainer: {
  flexDirection: 'row',

  backgroundColor: '#F4F4F4',

  borderRadius: 10,

  marginTop: 12,
  marginBottom: 12,

  borderWidth: 1,
  borderColor: '#E5E5E5',

  overflow: 'hidden',
},

tabButton: {
  flex: 1,

  height: 42,

  justifyContent: 'center',
  alignItems: 'center',
  borderRadius:8,
},

activeTab: {
  backgroundColor: '#000',
},

tabText: {
    fontFamily: "Inter-Regular",
    color: "#000",
    fontSize: 14,
  },
activeTabText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

orderCard: {
  backgroundColor: '#FFF',

  borderRadius: 12,

  padding: 12,

  marginBottom: 12,

  borderWidth: 1,
  borderColor: '#E8E8E8',
},

productName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },


productInfo: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

 productPrice: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 6,
  },

deliveryText: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

actionButton: {
  marginTop: 10,

  backgroundColor: '#000',

  height: 36,

  borderRadius: 8,

  justifyContent: 'center',
  alignItems: 'center',
},

 actionButtonText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },

contentContainer:{
  paddingHorizontal:16,
}

});


