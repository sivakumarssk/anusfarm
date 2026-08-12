// import React from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Image,
// } from 'react-native';

// import {
//   SafeAreaView,
// } from 'react-native-safe-area-context';

// import {
//   useNavigation,
// } from '@react-navigation/native';

// import { Ionicons }
// from '@expo/vector-icons';

// const orders = [
//   {
//     id: '1',
//     name: 'Fresh Chicken',
//     quantity: '500 GMS',
//     price: 140,
//     delivered: 'Delivered Today',
//     image: require('../../assets/products/chicken.png'),
//   },
//   {
//     id: '2',
//     name: 'Desi Ghee',
//     quantity: '500 GMS',
//     price: 270,
//     delivered: 'Delivered Yesterday',
//     image: require('../../assets/products/ghee.png'),
//   },
//   {
//     id: '3',
//     name: 'Fresh Chicken',
//     quantity: '1 KG',
//     price: 250,
//     delivered: 'Delivered Yesterday',
//     image: require('../../assets/products/chicken.png'),
//   },
// ];

// const OrderHistoryScreen = () => {

//   const navigation =
//     useNavigation<any>();

//   return (

//     <SafeAreaView
//       style={styles.container}
//     >

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           paddingBottom: 30,
//         }}
//       >

//         <View style={styles.header}>

//           <TouchableOpacity
//             onPress={() =>
//               navigation.goBack()
//             }
//           >
//             <Ionicons
//               name="arrow-back"
//               size={24}
//               color="#000"
//             />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>
//             Order History
//           </Text>

//         </View>

//         {orders.map(item => (

//           <View
//             key={item.id}
//             style={styles.card}
//           >

//             <Image
//               source={item.image}
//               style={styles.productImage}
//             />

//             <View style={styles.details}>

//               <Text style={styles.name}>
//                 {item.name}
//               </Text>

//               <Text style={styles.meta}>
//                 {item.quantity} | x1 Qty
//               </Text>

//               <Text style={styles.price}>
//                 ₹{item.price}
//               </Text>

//               <Text style={styles.delivery}>
//                 {item.delivered}
//               </Text>

//             </View>

//           </View>

//         ))}

//       </ScrollView>

//     </SafeAreaView>

//   );
// };

// export default OrderHistoryScreen;

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',

//     paddingHorizontal: 16,
//     paddingTop: 16,

//     marginBottom: 20,
//   },

//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '500',

//     marginLeft: 12,

//     color: '#000',
//   },

//   card: {
//     flexDirection: 'row',

//     backgroundColor: '#FFFFFF',

//     marginHorizontal: 16,
//     marginBottom: 18,

//     borderRadius: 18,

//     padding: 12,

//     borderWidth: 1,
//     borderColor: '#E8E8E8',

//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,

//     elevation: 2,
//   },

//   productImage: {
//     width: 78,
//     height: 84,

//     borderRadius: 16,

//     backgroundColor: '#F5F5F5',
//   },

//   details: {
//     flex: 1,

//     marginLeft: 12,

//     justifyContent: 'center',
//   },

//   name: {
//     fontSize: 16,
//     fontWeight: '600',

//     color: '#000',
//   },

//   meta: {
//     fontSize: 12,

//     color: '#777',

//     marginTop: 2,
//   },

//   price: {
//     fontSize: 14,
//     fontWeight: '500',

//     color: '#000',

//     marginTop: 4,
//   },

//   delivery: {
//     fontSize: 14,

//     color: '#444',

//     marginTop: 2,
//   },

// });

import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  Ionicons
} from "@expo/vector-icons";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";   // change path if needed


const OrderHistoryScreen = () => {

  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<any[]>([]);


  useEffect(() => {
    fetchOrders();
  }, []);



  const fetchOrders = async () => {

    try {

      const token = await AsyncStorage.getItem("token");


      const response = await axios.get(
        `${API_URL}/api/orders/my`,
        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }
      );


      console.log(
        "ORDER HISTORY DATA = ",
        response.data
      );


      setOrders(response.data.orders);


    } catch(error:any){

      console.log(
        "ORDER HISTORY ERROR = ",
        error.response?.data || error.message
      );


      Alert.alert(
        "Error",
        "Unable to load order history"
      );

    }

  };



  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:30,
        }}
      >


        <View style={styles.header}>


          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >

            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
            />

          </TouchableOpacity>



          <Text style={styles.headerTitle}>
            Order History
          </Text>


        </View>




        {
          orders.length === 0 ? (

            <Text style={styles.empty}>
              No orders found
            </Text>

          ) : (


            orders.map((order)=>(


              <View
                key={order.id}
              >


                {
                  order.products.map(
                    (item:any,index:number)=>(


                    <View
                      key={index}
                      style={styles.card}
                    >


                      <Image
                        source={{
                          uri:
                          `${API_URL}/uploads/${item.image}`
                        }}
                        style={styles.productImage}
                      />



                      <View style={styles.details}>


                        <Text style={styles.name}>
                          {item.product_name}
                        </Text>



                        <Text style={styles.meta}>
                          Qty: {item.quantity}
                        </Text>



                        <Text style={styles.price}>
                          ₹{item.price}
                        </Text>



                        <Text style={styles.delivery}>
                          {order.status}
                        </Text>



                        <Text style={styles.payment}>
                          Payment: {order.payment_method}
                        </Text>



                      </View>



                    </View>


                    )
                  )
                }



              </View>


            ))

          )
        }



      </ScrollView>


    </SafeAreaView>

  );

};



export default OrderHistoryScreen;



const styles = StyleSheet.create({


  container:{
    flex:1,
    backgroundColor:"#F8F8F8",
  },


  header:{
    flexDirection:"row",
    alignItems:"center",

    paddingHorizontal:16,
    paddingTop:16,

    marginBottom:20,
  },


  headerTitle:{
    fontSize:18,
    fontWeight:"500",

    marginLeft:12,

    color:"#000",
  },


  card:{
    flexDirection:"row",

    backgroundColor:"#FFFFFF",

    marginHorizontal:16,
    marginBottom:18,

    borderRadius:18,

    padding:12,

    borderWidth:1,
    borderColor:"#E8E8E8",

    elevation:2,
  },


  productImage:{
    width:78,
    height:84,

    borderRadius:16,

    backgroundColor:"#F5F5F5",
  },


  details:{
    flex:1,

    marginLeft:12,

    justifyContent:"center",
  },


  name:{
    fontSize:16,
    fontWeight:"600",

    color:"#000",
  },


  meta:{
    fontSize:12,

    color:"#777",

    marginTop:3,
  },


  price:{
    fontSize:14,

    fontWeight:"500",

    color:"#000",

    marginTop:5,
  },


  delivery:{
    fontSize:14,

    color:"#444",

    marginTop:5,
  },


  payment:{
    fontSize:12,

    color:"#777",

    marginTop:3,
  },


  empty:{
    textAlign:"center",

    marginTop:50,

    fontSize:16,

    color:"#777",
  },


});