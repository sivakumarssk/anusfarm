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

  const loadOrders = async () => {

try {

const token = await AsyncStorage.getItem("token");

const res = await fetch(`${API_URL}/api/orders/my`,{
headers:{
Authorization:`Bearer ${token}`
}
}
);


const json = await res.json();

console.log("MY ORDERS:",json);


if(json.success){

const backendOrders = json.orders.map((order:any)=>({

id:order.id,

orderId:order.id.toString(),

orderType:"instant",

deliveryDate:order.created_at,

created_at:order.created_at,

status:order.status.toLowerCase(),

products:order.products.map((item:any)=>({

...item,

image:encodeURI(
`${API_URL.replace("/api","")}/uploads/${item.image}`
)

})),

total:order.total_amount

}));


setOrders(backendOrders);

}


}
catch(error){

console.log(
"LOAD ORDERS ERROR:",
error
);

}

};
    
const filteredOrders = selectedTab === 'instant' ? orders.filter(
   order => order.orderType ==='instant'  ): orders.filter(
        order =>order.orderType ==='subscription');

  console.log("Selected Tab:", selectedTab);
console.log("Filtered Orders:", filteredOrders);


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
          fontSize: 16,
          fontWeight: '600',
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
          fontWeight: '600',
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
    fontSize:16,
    fontWeight:"600",
    marginTop:20,
    marginBottom:12,
  }}
>
  Pending Orders
</Text>


{
  pendingOrders.length === 0 ? (

    <Text
      style={{
        color:"#777",
        marginBottom:10
      }}
    >
      No Pending Orders
    </Text>

  ) : (

    pendingOrders.map(order => (

//      <OrderCard
//   key={order.orderId}
//   order={order}
//   showActionButton={false}
//   onPress={() =>
//     navigation.navigate("TrackOrder", {
//       orderId: order.orderId,
//     })
//   }
// />
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
      fontWeight: '600',
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
    fontSize: 16,
    color: '#888',
    marginLeft:20,
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
  fontSize: 18,
  fontWeight: '600',

  color: '#000',

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
  color: '#FFF',

  fontSize: 14,
  fontWeight: '600',
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
  color: '#000',
  fontSize: 14,
},

activeTabText: {
  color: '#FFF',
  fontSize: 14,
  fontWeight: '600',
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
  fontSize: 15,
  fontWeight: '600',
  color: '#000',
},

productInfo: {
  fontSize: 12,
  color: '#777',
  marginTop: 4,
},

productPrice: {
  fontSize: 16,
  fontWeight: '700',
  color: '#000',
  marginTop: 6,
},

deliveryText: {
  fontSize: 12,
  color: '#777',
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
  color: '#FFF',
  fontSize: 12,
  fontWeight: '600',
},

contentContainer:{
  paddingHorizontal:16,
}

});


