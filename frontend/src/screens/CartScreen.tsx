// import React from 'react';
// import { addressesData,} from '../data/addressData';
// import EmptyCart from '../components/EmptyCart';
// import { useCart } from '../context/CartContext';
// import {  View,Text,StyleSheet,ScrollView,TouchableOpacity,Image,} from 'react-native';
// import { useNavigation }from '@react-navigation/native';
// import { Ionicons }from '@expo/vector-icons';
// import {SafeAreaView,} from 'react-native-safe-area-context';

// const CartScreen = () => {

//   const {cartItems,increaseQuantity,decreaseQuantity,removeItem,} = useCart();

// const subscriptionItems = cartItems;
// const instantItems = cartItems;
// const hasSubscriptionItems = cartItems.length > 0;


//   console.log("SUBSCRIPTION ITEMS:", subscriptionItems);
// console.log("HAS SUBSCRIPTION:", hasSubscriptionItems);

// const totalItems = cartItems.reduce(
//   (sum, item) => sum + item.quantity,0);

// const subtotal = cartItems.reduce((sum, item) =>
//     sum + item.price * item.quantity,0);

//     const navigation =useNavigation<any>();

//   const selectedAddress = addressesData.find(
//     address =>address.isSelected);

// if (cartItems.length === 0) {
//   return <EmptyCart />;
// }

//   return (

//     <SafeAreaView  style={styles.container}>

//       <ScrollView showsVerticalScrollIndicator={false}>

//         {/* Header */}

//         <View style={styles.header}>

// <TouchableOpacity onPress={() => navigation.goBack()}>
//   <Ionicons name="arrow-back" size={24} color="#000"/>
// </TouchableOpacity>

//           <Text style={styles.headerTitle}> My Cart </Text>

//           <View  style={styles.headerIcons}>

//             <TouchableOpacity>
//        <Image source={require('../../assets/icons/notification.png')}  style={styles.icon} />
//             </TouchableOpacity>

//             <TouchableOpacity>
//               <Image  source={require('../../assets/icons/wallet.png')}  style={styles.icon}/>
//                </TouchableOpacity>
        
//           </View>
//         </View>
//         <View style={styles.deliveryBanner}>
//             <Text style={styles.deliveryText}>Your order will be delivered dialy at 6:00 AM </Text>
//         </View>

//        <View style={styles.addressContainer}>

//   <View style={styles.addressHeader}>

//     <Text style={styles.addressTitle}>  Delivery Address</Text>
     
//     <TouchableOpacity>
//       <Text style={styles.changeText}> Change </Text>
//     </TouchableOpacity>

//   </View>

//   <View style={styles.addressCard}>
//     <View style={styles.locationIconContainer}>
//       <Ionicons  name="location-outline" size={26} color="#4CAF50" />
//     </View>

//     <View style={styles.addressInfo}>
//       <Text style={styles.addressType}>{selectedAddress?.type} </Text>
//       <Text style={styles.addressText}>{selectedAddress?.address} </Text>
//       <Text style={styles.phoneText}> {selectedAddress?.phone} </Text>
//     </View>

//   </View>
// </View>

// <View style={styles.orderSummaryHeader}>

//   <Text style={styles.orderSummaryTitle}>
//     Order Summary
//   </Text>

// </View>

// {cartItems.map(item => (
//     <View key={item.id} style={styles.productCard}>

//   <View style={styles.imageContainer}>
//     <Image source={typeof item.image === "string"
//       ? { uri: item.image }: item.image}
//   style={styles.productImage}resizeMode="contain"/>
//   </View>
//   <View style={styles.productInfo}>

//     <View style={styles.topRow}>
//       <Text style={styles.productName}>{item.name}</Text>
//       <TouchableOpacity onPress={() =>removeItem(item.id)}>
//         <Ionicons
//           name="trash-outline"
//           size={22}
//           color="#333" />
//       </TouchableOpacity>
//     </View>

//    <Text style={styles.productQuantity}>{item.unit} | x{item.quantity} Qty</Text>

//   <Text style={styles.productPrice}> ₹{item.price * item.quantity}</Text>

//     <View style={styles.qtyContainer}>
//       <TouchableOpacity onPress={() => decreaseQuantity(item.id) }>
//         <Text style={styles.qtyButton}>-</Text>
//       </TouchableOpacity>

//    <Text style={styles.qtyValue}>{item.quantity}</Text>

//       <TouchableOpacity onPress={() => increaseQuantity(item.id)}>
//         <Text style={styles.qtyButton} >+</Text>
//       </TouchableOpacity>
//     </View>
//   </View>
// </View>
//   ))
// }

// <View style={styles.addMoreItemsCard}>
//   <View style={styles.addMoreItemsLeft}>
//     <View style={styles.plusIconContainer}>
//       <Image
//       source={require('../../assets/icons/cart.png')}
//       style={{
//         width:20,
//         height:20,
//         tintColor:'#4CAF50'
//       }}/>

//     </View>

//     <View>

//       <Text style={styles.addMoreTitle}>
//         Add more items
//       </Text>

//       <Text style={styles.addMoreSubtitle}>
//         Browse products to add to your cart
//       </Text>

//     </View>

//   </View>

//   <TouchableOpacity
//     onPress={() =>
//       navigation.navigate('Products')
//     }
//   >

//     <Ionicons
//       name="chevron-forward"
//       size={20}
//       color="#333"
//     />

//   </TouchableOpacity>

// </View>

// <View style={styles.applyCouponContainer}>
//   <View style={styles.addMoreItemsLeft}>
//     <View style={styles.couponContainer}>
//   <Image
//   source={require("../../assets/icons/applyCoupon.png")}
//   style={{
//     width:20,
//     height:20,
//     tintColor:'#4CAF50'
//   }}
//   />
//  </View>
//  <View>
//   <Text style={styles.addMoreTitle}>
//     Apply Coupon
//   </Text>
//   <Text style={styles.addMoreSubtitle}>
//    Get extra savings
//   </Text>
//  </View>
//   </View>
//  <TouchableOpacity>
//   <Ionicons
//       name="chevron-forward"
//       size={20}
//       color="#333"
//     />
//  </TouchableOpacity>
// </View>

// <View style={styles.orderSummaryHeader}>

//   <Text style={styles.orderSummaryTitle}>
//     Bill Summary
//   </Text>

// </View>
// <View style={styles.billSummaryCard}>
//   <View >
//     <View style={styles.billSummaryItems}>
//     <Text>
//   Subtotal ({totalItems} items)
// </Text>
//     <Text>
//   ₹{subtotal}
// </Text>
//      </View>
//     <View style={styles.divider} />
//           <View style={styles.billSummaryItems}>
//     <Text>
//       Delivery
//     </Text>
//     <Text>
//       Free
//     </Text>
//     </View>
//     <View style={styles.divider} />
//         <View style={styles.billSummaryItems}>
//     <Text
//   style={{
//     fontWeight: '700',
//   }}
// >
//   Total Amount
// </Text>
//   <Text
//   style={{
//     fontWeight: '700',
//   }}
// >
//   ₹{subtotal}
// </Text>
//     </View>
//   </View>
  
  
// </View>

// <View style={styles.walletContainer}>
//   <Text style={styles.WalletText}>
//     Wallet Balance: ₹ 0
//   </Text>
//    <TouchableOpacity
//     onPress={() =>
//       navigation.navigate('Wallet')
//     }
//   >
//     <Text style={styles.money}>
//       Add Money
//     </Text>
//   </TouchableOpacity>

// </View>

// <View style={styles.bottomButtonContainer}>

//   {/* {hasSubscriptionItems && ( */}

//     <TouchableOpacity
//       style={styles.subscribeButton}
//       onPress={() =>
//         navigation.navigate(
//           'DeliverySchedule'
//         )
//       }
//     >
//       <Text
//         style={styles.subscribeButtonText}
//       >
//         Subscribe
//       </Text>
//     </TouchableOpacity>

//   {/* )} */}

 
//   <TouchableOpacity
//   style={styles.instantBuyButton}
//   onPress={() =>
//     navigation.navigate("Address")
//   }
// >
  
//     <Text
//       style={
//         styles.instantBuyButtonText
//       }
//     >
//       Instant Buy
//     </Text>
//   </TouchableOpacity>

// </View>

//       </ScrollView>

//     </SafeAreaView>

//   );

// };

// export default CartScreen;

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: '#F8F8F8',
//     marginTop:28,

//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 12,
//     paddingLeft:16,
//     paddingRight:18
//   },

//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#000',
//     marginLeft: 8,
//   },

//   phoneText: {
//   fontSize: 13,

//   color: '#666',

//   marginTop: 4,
// },

//   headerIcons: {
//     marginLeft: 'auto',
//     flexDirection: 'row',
//   },
//   addressInfo: {
//   flex: 1,
// },

//   icon: {
//     width: 20,
//     height: 20,
//     marginLeft: 12,
//     resizeMode:'contain'
//   },

//   deliveryBanner: {
//   backgroundColor: '#D9E8D9',
//   paddingVertical: 12,
//   paddingHorizontal: 14,
//   marginBottom: 16,
//   justifyContent:"center",
//   alignItems:"center"
//   },

// deliveryText: {
//   fontSize: 14,
//   color: '#4F5D4F',
// },
// addressCard: {
//   backgroundColor: '#FFF',

//   borderRadius: 14,

//   padding: 14,
//   flexDirection: 'row',

//   borderWidth:1,
//   borderColor:'#E5E5E5'
// },

// addressHeader: {
//   flexDirection: 'row',

//   justifyContent:
//     'space-between',

//   alignItems: 'center',

//   marginBottom: 10,
// },

// addressTitle: {
//   fontSize: 16,
//   fontWeight: '600',

//   color: '#000',
// },

// changeText: {
//   fontSize: 14,
//   fontWeight: '600',

//   color: '#2E7D32',
// },

// addressType: {
//   fontSize: 15,
//   fontWeight: '600',

//   color: '#000',

//   marginBottom: 6,
// },

// addressText: {
//   fontSize: 13,

//   color: '#666',
//   lineHeight: 20,
// },
// addressContainer: {
//   marginHorizontal: 16,
//   marginBottom: 16,
// },
// locationIconContainer: {
//   width: 44,
//   height: 44,

//   borderRadius: 22,

//   backgroundColor: '#E8F4E8',

//   justifyContent: 'center',
//   alignItems: 'center',

//   marginRight: 12,
// },
// orderSummaryHeader: {
//   marginHorizontal: 16,
//   marginBottom: 12,
// },

// orderSummaryTitle: {
//   fontSize: 18,
//   fontWeight: '400',
//   color: '#000',
// },

// productCard: {
//   backgroundColor: '#FFF',

//   marginHorizontal: 16,
//   marginBottom: 14,

//   borderRadius: 20,

//   padding: 14,

//   flexDirection: 'row',

//   shadowColor: '#000',
//   shadowOpacity: 0.05,
//   shadowRadius: 4,

//   elevation: 2,
// },

// productImage: {
//   width: 80,
//   height: 80,
// },

// productInfo: {
//   flex: 1,
//   marginLeft: 14,
// },

// productName: {
//   fontSize: 18,
//   fontWeight: '500',
//   color: '#000',
// },

// productQuantity: {
//   fontSize: 13,
//   color: '#666',
//   marginTop: 4,
// },

// productPrice: {
//   fontSize: 18,
//   fontWeight: '700',
//   color: '#000',
//   marginTop: 4,
// },
// qtyContainer: {
//   width: 165,
//   height: 38,

//   borderWidth: 1,
//   borderColor: '#000',

//   borderRadius: 8,

//   flexDirection: 'row',

//   alignItems: 'center',
//   justifyContent: 'space-between',

//   paddingHorizontal: 16,

//   marginTop: 10,
// },
// qtyButton: {
//   fontSize: 24,
//   fontWeight: '500',
// },
// qtyValue: {
//   fontSize: 18,
//   fontWeight: '500',
// },
// imageContainer: {
//   width: 95,
//   height: 95,

//   borderRadius: 18,

//   backgroundColor: '#F5F5F5',

//   justifyContent: 'center',
//   alignItems: 'center',
// },
// topRow: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'flex-start',
// },

// addMoreItemsCard: {
//   backgroundColor: '#FFF',

//   marginHorizontal: 16,
//   marginBottom: 12,

//   borderRadius: 12,

//   padding: 14,

//   flexDirection: 'row',

//   justifyContent: 'space-between',

//   alignItems: 'center',
// },

// addMoreItemsLeft: {
//   flexDirection: 'row',
//   alignItems: 'center',
// },

// plusIconContainer: {
//   width: 36,
//   height: 36,

//   borderRadius: 18,

//   backgroundColor: '#E8F4E8',

//   justifyContent: 'center',
//   alignItems: 'center',

//   marginRight: 12,
// },

// addMoreTitle: {
//   fontSize: 14,
//   fontWeight: '600',
//   color: '#000',
// },

// addMoreSubtitle: {
//   fontSize: 12,
//   color: '#777',

//   marginTop: 2,
// },
// applyCouponContainer:{
//    backgroundColor: '#ddeadd',
//    marginHorizontal: 16,
//   marginBottom: 12,

//   borderRadius: 12,

//   padding: 14,

//   flexDirection: 'row',

//   justifyContent: 'space-between',

//   alignItems: 'center',

// },
// couponContainer: {
//   width: 36,
//   height: 36,

//   borderRadius: 18,

//   backgroundColor: '#E8F4E8',

//   justifyContent: 'center',
//   alignItems: 'center',

//   marginRight: 12,
// },
// divider: {
//   borderBottomWidth: 1,
//   borderStyle: 'dashed',
//   borderColor: '#D9D9D9',
//   marginVertical: 12,
// },
// billSummaryItems: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   width:'100%'
// },
// billSummaryCard: {
//   backgroundColor: '#FFF',
//   borderRadius: 14,
//   padding: 16,
//   marginHorizontal: 16,
//   marginBottom: 16,

//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 4,
//   },
//   shadowOpacity: 0.12,
//   shadowRadius: 8,

//   elevation: 5,
// },
// walletContainer:{
//   marginTop:20,
//   backgroundColor:"#FFF",
// alignItems:"center",
//   height:50,
//   borderRadius:10,
//   marginBottom:16,
//   flexDirection:"row",
//   justifyContent:"space-between",
//   width:"100%",
//    shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 4,
//   },
//   shadowOpacity: 0.12,
//   shadowRadius: 8,

//   elevation: 5,
// },
// money:{
//   marginRight:22,
//    color: '#c5180f',
//   fontSize: 14,
//   textDecorationLine: 'underline',
//   textDecorationColor: '#c5180f',
// },
// WalletText:{
//     marginLeft:10,
// },
// bottomButtonContainer: {
//   flexDirection: "row",
//   justifyContent: "space-between",
//   marginHorizontal: 16,
//   marginTop: 15,
//   marginBottom: 30,
// },

// subscribeButton: {
//   flex: 1,
//   height: 52,

//   backgroundColor: '#000',

//   borderWidth: 1,
//   borderColor: '#E5E5E5',

//   borderRadius: 12,

//   justifyContent: 'center',
//   alignItems: 'center',

//   marginRight: 10,

//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 3,
//   },
//   shadowOpacity: 0.15,
//   shadowRadius: 6,

//   elevation: 25,
// },

// instantBuyButton: {
//   flex: 1,
//   height: 52,

//   backgroundColor: '#FFFFFF',
//   borderWidth:1,
//   borderColor:'#E5E5E5',

//   borderRadius: 12,

//   justifyContent: 'center',
//   alignItems: 'center',

//   marginLeft: 10,

//   shadowColor: '#000',
//   shadowOffset: {
//     width: 0,
//     height: 2,
//   },
//   shadowOpacity: 0.05,
//   shadowRadius: 4,

//   elevation: 2,
// },

// subscribeButtonText: {
//   fontSize: 15,
//   fontWeight: '500',
//   color: '#FFF',
// },

// instantBuyButtonText: {
//   fontSize: 15,
//   fontWeight: '500',
//   color: '#000',
// },



// });

import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import EmptyCart from '../components/EmptyCart';
import { useCart } from '../context/CartContext';

import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '../config/api';


// ==========================================================
// ADDRESS TYPE
// ==========================================================

interface Address {
  id: number;
  address_type: string;
  full_address: string;
  phone: string;
  latitude: string;
  longitude: string;
  is_selected?: boolean;
}


// ==========================================================
// CART SCREEN
// ==========================================================

const CartScreen = () => {

  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart();

  const navigation = useNavigation<any>();


  // ========================================================
  // ADDRESS STATE
  // ========================================================

  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);

  const [loadingAddress, setLoadingAddress] =
    useState(false);


  // ========================================================
  // FETCH DYNAMIC ADDRESS
  // ========================================================

  const fetchAddress = async () => {

    try {

      setLoadingAddress(true);

      const token =
        await AsyncStorage.getItem('token');

      console.log(
        "CART TOKEN:",
        token
      );

      if (!token) {
        console.log("NO TOKEN FOUND");
        return;
      }


      const response = await axios.get(
        `${API_URL}/api/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      console.log(
        "CART ADDRESS RESPONSE:",
        response.data
      );


      const addressList =
        response.data?.addresses || [];


      if (addressList.length > 0) {

        // If backend gives selected address,
        // show that address.
        const selected =
          addressList.find(
            (address: Address) =>
              address.is_selected === true
          );


        // If no selected address exists,
        // show the first address.
        setSelectedAddress(
          selected || addressList[0]
        );

      } else {

        setSelectedAddress(null);

      }

    } catch (error: any) {

      console.log(
        "CART ADDRESS ERROR:",
        error?.response?.data ||
        error?.message ||
        error
      );

      setSelectedAddress(null);

    } finally {

      setLoadingAddress(false);

    }

  };


  // ========================================================
  // REFRESH ADDRESS WHEN CART SCREEN OPENS
  // ========================================================

  useFocusEffect(
    useCallback(() => {

      fetchAddress();

    }, [])
  );


  // ========================================================
  // CART CALCULATIONS
  // ========================================================

  const subscriptionItems = cartItems;

  const instantItems = cartItems;

  const hasSubscriptionItems =
    cartItems.length > 0;


  console.log(
    "SUBSCRIPTION ITEMS:",
    subscriptionItems
  );

  console.log(
    "HAS SUBSCRIPTION:",
    hasSubscriptionItems
  );


  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  const subtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  // ========================================================
  // EMPTY CART
  // ========================================================

  if (cartItems.length === 0) {

    return <EmptyCart />;

  }


  // ========================================================
  // UI
  // ========================================================

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
      >


        {/* ==================================================
            HEADER
        ================================================== */}

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


          <Text
            style={styles.headerTitle}
          >
            My Cart
          </Text>


          <View
            style={styles.headerIcons}
          >

            <TouchableOpacity>

              <Image
                source={require(
                  '../../assets/icons/notification.png'
                )}
                style={styles.icon}
              />

            </TouchableOpacity>


            <TouchableOpacity>

              <Image
                source={require(
                  '../../assets/icons/wallet.png'
                )}
                style={styles.icon}
              />

            </TouchableOpacity>

          </View>

        </View>


        {/* ==================================================
            DELIVERY BANNER
        ================================================== */}

        <View
          style={styles.deliveryBanner}
        >

          <Text
            style={styles.deliveryText}
          >
            Your order will be delivered dialy at 6:00 AM
          </Text>

        </View>


        {/* ==================================================
            DELIVERY ADDRESS
        ================================================== */}

        <View
          style={styles.addressContainer}
        >

          <View
            style={styles.addressHeader}
          >

            <Text
              style={styles.addressTitle}
            >
              Delivery Address
            </Text>


            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Address")
              }
            >

              <Text
                style={styles.changeText}
              >
                Change
              </Text>

            </TouchableOpacity>

          </View>


          {/* ADDRESS CARD */}

          <View
            style={styles.addressCard}
          >

            <View
              style={
                styles.locationIconContainer
              }
            >

              <Ionicons
                name="location-outline"
                size={26}
                color="#4CAF50"
              />

            </View>


            <View
              style={styles.addressInfo}
            >

              {/* LOADING */}

              {loadingAddress ? (

                <View
                  style={styles.loadingContainer}
                >

                  <ActivityIndicator
                    size="small"
                    color="#4CAF50"
                  />

                  <Text
                    style={styles.loadingText}
                  >
                    Loading address...
                  </Text>

                </View>

              ) : selectedAddress ? (

                /* ================================
                   DYNAMIC ADDRESS
                   ================================ */

                <>

                  <Text
                    style={styles.addressType}
                  >
                    {selectedAddress.address_type}
                  </Text>


                  <Text
                    style={styles.addressText}
                  >
                    {selectedAddress.full_address}
                  </Text>


                  <Text
                    style={styles.phoneText}
                  >
                    {selectedAddress.phone}
                  </Text>

                </>

              ) : (

                /* ================================
                   NO ADDRESS
                   ================================ */

                <>

                  <Text
                    style={styles.noAddressText}
                  >
                    No delivery address added
                  </Text>


                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Address")
                    }
                  >

                    <Text
                      style={styles.changeText}
                    >
                      Add Address
                    </Text>

                  </TouchableOpacity>

                </>

              )}

            </View>

          </View>

        </View>


        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <View
          style={styles.orderSummaryHeader}
        >

          <Text
            style={styles.orderSummaryTitle}
          >
            Order Summary
          </Text>

        </View>


        {/* ==================================================
            PRODUCTS
        ================================================== */}

        {cartItems.map(item => (

          <View
            key={item.id}
            style={styles.productCard}
          >

            <View
              style={styles.imageContainer}
            >

              <Image
                source={
                  typeof item.image === "string"
                    ? { uri: item.image }
                    : item.image
                }
                style={styles.productImage}
                resizeMode="contain"
              />

            </View>


            <View
              style={styles.productInfo}
            >

              <View
                style={styles.topRow}
              >

                <Text
                  style={styles.productName}
                >
                  {item.name}
                </Text>


                <TouchableOpacity
                  onPress={() =>
                    removeItem(item.id)
                  }
                >

                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="#333"
                  />

                </TouchableOpacity>

              </View>


              <Text
                style={
                  styles.productQuantity
                }
              >
                {item.unit} | x
                {item.quantity} Qty
              </Text>


              <Text
                style={styles.productPrice}
              >
                ₹
                {item.price *
                  item.quantity}
              </Text>


              <View
                style={
                  styles.qtyContainer
                }
              >

                <TouchableOpacity
                  onPress={() =>
                    decreaseQuantity(
                      item.id
                    )
                  }
                >

                  <Text
                    style={
                      styles.qtyButton
                    }
                  >
                    -
                  </Text>

                </TouchableOpacity>


                <Text
                  style={styles.qtyValue}
                >
                  {item.quantity}
                </Text>


                <TouchableOpacity
                  onPress={() =>
                    increaseQuantity(
                      item.id
                    )
                  }
                >

                  <Text
                    style={
                      styles.qtyButton
                    }
                  >
                    +
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          </View>

        ))}


        {/* ==================================================
            ADD MORE ITEMS
        ================================================== */}

        <View
          style={styles.addMoreItemsCard}
        >

          <View
            style={styles.addMoreItemsLeft}
          >

            <View
              style={styles.plusIconContainer}
            >

              <Image
                source={require(
                  '../../assets/icons/cart.png'
                )}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#4CAF50',
                }}
              />

            </View>


            <View>

              <Text
                style={
                  styles.addMoreTitle
                }
              >
                Add more items
              </Text>


              <Text
                style={
                  styles.addMoreSubtitle
                }
              >
                Browse products to add to your cart
              </Text>

            </View>

          </View>


          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Products'
              )
            }
          >

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#333"
            />

          </TouchableOpacity>

        </View>


        {/* ==================================================
            COUPON
        ================================================== */}

        <View
          style={
            styles.applyCouponContainer
          }
        >

          <View
            style={
              styles.addMoreItemsLeft
            }
          >

            <View
              style={
                styles.couponContainer
              }
            >

              <Image
                source={require(
                  "../../assets/icons/applyCoupon.png"
                )}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: '#4CAF50',
                }}
              />

            </View>


            <View>

              <Text
                style={
                  styles.addMoreTitle
                }
              >
                Apply Coupon
              </Text>


              <Text
                style={
                  styles.addMoreSubtitle
                }
              >
                Get extra savings
              </Text>

            </View>

          </View>


          <TouchableOpacity>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#333"
            />

          </TouchableOpacity>

        </View>


        {/* ==================================================
            BILL SUMMARY
        ================================================== */}

        <View
          style={
            styles.orderSummaryHeader
          }
        >

          <Text
            style={
              styles.orderSummaryTitle
            }
          >
            Bill Summary
          </Text>

        </View>


        <View
          style={
            styles.billSummaryCard
          }
        >

          <View>

            <View
              style={
                styles.billSummaryItems
              }
            >

              <Text>
                Subtotal ({totalItems} items)
              </Text>


              <Text>
                ₹{subtotal}
              </Text>

            </View>


            <View
              style={styles.divider}
            />


            <View
              style={
                styles.billSummaryItems
              }
            >

              <Text>
                Delivery
              </Text>


              <Text>
                Free
              </Text>

            </View>


            <View
              style={styles.divider}
            />


            <View
              style={
                styles.billSummaryItems
              }
            >

              <Text
                style={{
                  fontWeight: '700',
                }}
              >
                Total Amount
              </Text>


              <Text
                style={{
                  fontWeight: '700',
                }}
              >
                ₹{subtotal}
              </Text>

            </View>

          </View>

        </View>


        {/* ==================================================
            WALLET
        ================================================== */}

        <View
          style={
            styles.walletContainer
          }
        >

          <Text
            style={styles.WalletText}
          >
            Wallet Balance: ₹ 0
          </Text>


          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Wallet'
              )
            }
          >

            <Text
              style={styles.money}
            >
              Add Money
            </Text>

          </TouchableOpacity>

        </View>


        {/* ==================================================
            BUTTONS
        ================================================== */}

        <View
          style={
            styles.bottomButtonContainer
          }
        >

          <TouchableOpacity
            style={
              styles.subscribeButton
            }
            onPress={() =>
              navigation.navigate(
                'DeliverySchedule'
              )
            }
          >

            <Text
              style={
                styles.subscribeButtonText
              }
            >
              Subscribe
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={
              styles.instantBuyButton
            }
            onPress={() =>
              navigation.navigate(
                "Address"
              )
            }
          >

            <Text
              style={
                styles.instantBuyButtonText
              }
            >
              Instant Buy
            </Text>

          </TouchableOpacity>

        </View>


      </ScrollView>

    </SafeAreaView>

  );

};


export default CartScreen;


// ==========================================================
// STYLES
// ==========================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    marginTop: 28,
  },


  // HEADER

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    paddingLeft: 16,
    paddingRight: 18,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginLeft: 8,
  },

  headerIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
  },

  icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
    resizeMode: 'contain',
  },


  // DELIVERY BANNER

  deliveryBanner: {
    backgroundColor: '#D9E8D9',
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  deliveryText: {
    fontSize: 14,
    color: '#4F5D4F',
  },


  // ADDRESS

  addressContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  addressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },

  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  locationIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  addressInfo: {
    flex: 1,
  },

  addressType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },

  addressText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },

  phoneText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  noAddressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 13,
  },


  // ORDER SUMMARY

  orderSummaryHeader: {
    marginHorizontal: 16,
    marginBottom: 12,
  },

  orderSummaryTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },


  // PRODUCT

  productCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  imageContainer: {
    width: 95,
    height: 95,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  productImage: {
    width: 80,
    height: 80,
  },

  productInfo: {
    flex: 1,
    marginLeft: 14,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  productName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },

  productQuantity: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },

  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },

  qtyContainer: {
    width: 165,
    height: 38,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 10,
  },

  qtyButton: {
    fontSize: 24,
    fontWeight: '500',
  },

  qtyValue: {
    fontSize: 18,
    fontWeight: '500',
  },


  // ADD MORE ITEMS

  addMoreItemsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addMoreItemsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  plusIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  addMoreTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  addMoreSubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },


  // COUPON

  applyCouponContainer: {
    backgroundColor: '#ddeadd',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  couponContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F4E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },


  // BILL SUMMARY

  divider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D9D9D9',
    marginVertical: 12,
  },

  billSummaryItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  billSummaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },


  // WALLET

  walletContainer: {
    marginTop: 20,
    backgroundColor: "#FFF",
    alignItems: "center",
    height: 50,
    borderRadius: 10,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  money: {
    marginRight: 22,
    color: '#c5180f',
    fontSize: 14,
    textDecorationLine: 'underline',
    textDecorationColor: '#c5180f',
  },

  WalletText: {
    marginLeft: 10,
  },


  // BOTTOM BUTTONS

  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 15,
    marginBottom: 30,
  },

  subscribeButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 25,
  },

  instantBuyButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  subscribeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFF',
  },

  instantBuyButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },

});