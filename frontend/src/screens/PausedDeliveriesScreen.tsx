// import React from 'react';

// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   ScrollView
// } from 'react-native';

// import {
//   SafeAreaView,
// } from 'react-native-safe-area-context';

// import {
//   useNavigation,
// } from '@react-navigation/native';

// import { Ionicons }
// from '@expo/vector-icons';

// const PausedDeliveriesScreen = () => {

//   const navigation =
//     useNavigation<any>();

//   return (

//     <SafeAreaView
//       style={styles.container}
//     >

//          <ScrollView
//                 showsVerticalScrollIndicator={
//                   false
//                 }
//               >

//       {/* Header */}

//       <View style={styles.header}>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.goBack()
//           }
//         >
//           <Ionicons
//             name="arrow-back"
//             size={24}
//             color="#000"
//           />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>
//           Paused Deliveries
//         </Text>

//       </View>

//       {/* Product Card */}

//       <View style={styles.card}>

//         <Image
//           source={require('../../assets/products/a2-buffalo-milk.png')}
//           style={styles.productImage}
//           resizeMode="contain"
//         />

//         <View style={styles.details}>

//           <Text style={styles.productName}>
//             A2 Buffalo Milk
//           </Text>

//           <Text style={styles.productInfo}>
//             500 ML | x1 Qty
//           </Text>

//           <Text style={styles.price}>
//             ₹63
//           </Text>

//           <Text style={styles.schedule}>
//             Scheduled daily till 1st July
//           </Text>

//           <TouchableOpacity
//             style={styles.continueButton}
//           >
//             <Text style={styles.continueText}>
//               Continue
//             </Text>
//           </TouchableOpacity>

//         </View>

//       </View>
//       </ScrollView>

//     </SafeAreaView>

//   );
// };

// export default PausedDeliveriesScreen;

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
//   },

//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',

//     marginLeft: 12,

//     color: '#000',
//   },

//   card: {
//     flexDirection: 'row',

//     backgroundColor: '#FFF',

//     marginHorizontal: 16,
//     marginTop: 28,

//     borderRadius: 20,

//     padding: 12,

//     borderWidth: 1,
//     borderColor: '#E7E7E7',
//   },

//   productImage: {
//     width: 100,
//     height: 130,

//     borderRadius: 14,

//     backgroundColor: '#F3F3F3',
//   },

//   details: {
//     flex: 1,
//     marginLeft: 10,
//   },

//   productName: {
//     fontSize: 16,
//     fontWeight: '600',

//     color: '#000',
//   },

//   productInfo: {
//     fontSize: 12,

//     color: '#777',

//     marginTop: 2,
//   },

//   price: {
//     fontSize: 18,
//     fontWeight: '500',

//     color: '#000',

//     marginTop: 4,
//   },

//   schedule: {
//     fontSize: 12,

//     color: '#555',

//     marginTop: 2,
//   },

//   continueButton: {
//     width: 130,
//     height: 38,

//     backgroundColor: '#000',

//     borderRadius: 10,

//     justifyContent: 'center',
//     alignItems: 'center',

//     marginTop: 8,
//   },

//   continueText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontWeight: '500',
//   },

// });

import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
   Image
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Ionicons
} from '@expo/vector-icons';

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {API_URL} from "../config/api";


const PausedDeliveriesScreen = () => {


  const navigation = useNavigation<any>();


  const [pausedSubscriptions,setPausedSubscriptions] =
  useState<any[]>([]);


  const [loading,setLoading] =
  useState(true);



  useEffect(()=>{

    fetchPausedSubscriptions();

  },[]);




  const fetchPausedSubscriptions = async()=>{

    try{


      const token =
      await AsyncStorage.getItem("token");



      const response =
      await axios.get(

        `${API_URL}/api/subscriptions/paused`,

        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }

      );



      console.log(
        "PAUSED DATA:",
        response.data
      );



      setPausedSubscriptions(
        response.data.subscriptions || []
      );



    }
    catch(error:any){


      console.log(
        "PAUSED ERROR:",
        error.response?.data || error.message
      );


    }
    finally{

      setLoading(false);

    }

  };





  return (

    <SafeAreaView
      style={styles.container}
    >


      <ScrollView
        showsVerticalScrollIndicator={false}
      >


        {/* Header */}

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
            Paused Deliveries
          </Text>


        </View>





        {
          loading ?

          <ActivityIndicator
            size="large"
            style={{
              marginTop:40
            }}
          />

          :


          pausedSubscriptions.length === 0 ?

          <Text style={styles.emptyText}>
            No paused deliveries
          </Text>


          :


          pausedSubscriptions.map((item)=>(


            <View
              style={styles.card}
              key={item.id}
            >
               
               <Image
    source={{
      uri:`${API_URL}/uploads/${item.items?.[0]?.image}`
    }}
    style={styles.productImage}
    resizeMode="contain"
  />


              <View style={styles.details}>


                <Text style={styles.productName}>
                  {item.plan}
                </Text>



                <Text style={styles.productInfo}>
                  {item.frequency}
                </Text>



                <Text style={styles.productInfo}>
                  Delivery Time: {item.delivery_time}
                </Text>



                <Text style={styles.price}>
                  ₹{item.wallet_amount}
                </Text>



                <Text style={styles.schedule}>
                  Status: {item.status}
                </Text>



                <TouchableOpacity
                  style={styles.continueButton}
                >

                  <Text style={styles.continueText}>
                    Continue
                  </Text>


                </TouchableOpacity>



              </View>



            </View>


          ))


        }



      </ScrollView>


    </SafeAreaView>

  );

};


export default PausedDeliveriesScreen;




const styles = StyleSheet.create({


  container:{
    flex:1,
    backgroundColor:'#F8F8F8',
  },


  header:{
    flexDirection:'row',
    alignItems:'center',
    paddingHorizontal:16,
    paddingTop:16,
  },


  headerTitle:{
    fontSize:18,
    fontWeight:'600',
    marginLeft:12,
    color:'#000',
  },


  card:{
    backgroundColor:'#FFF',
    marginHorizontal:16,
    marginTop:28,
    borderRadius:20,
    padding:16,
    borderWidth:1,
    borderColor:'#E7E7E7',
  },
productImage:{
  width:120,
  height:120,
  alignSelf:'center',
  marginBottom:10,
},

  details:{
    flex:1,
  },


  productName:{
    fontSize:18,
    fontWeight:'600',
    color:'#000',
  },


  productInfo:{
    fontSize:14,
    color:'#555',
    marginTop:6,
  },


  price:{
    fontSize:18,
    fontWeight:'600',
    color:'#000',
    marginTop:8,
  },


  schedule:{
    fontSize:14,
    color:'#777',
    marginTop:6,
  },


  continueButton:{
    width:130,
    height:38,
    backgroundColor:'#000',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:12,
  },


  continueText:{
    color:'#FFF',
    fontSize:14,
    fontWeight:'500',
  },


  emptyText:{
    textAlign:'center',
    marginTop:50,
    fontSize:16,
    color:'#777',
  },


});