import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert,} from "react-native";
import { SafeAreaView,} from "react-native-safe-area-context";
import { useNavigation,} from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../components/CustomAlert";
import { API_URL } from "../config/api";   // change path if needed


const OrderHistoryScreen = () => {

  const navigation = useNavigation<any>();

  const [orders, setOrders] = useState<any[]>([]);

const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState("");
const [alertMessage, setAlertMessage] = useState("");
const [alertButtonText, setAlertButtonText] = useState("OK");
const [alertCancelText, setAlertCancelText] = useState<string | undefined>(
  undefined
);
const [alertConfirmAction, setAlertConfirmAction] =
  useState<(() => void) | null>(null);

const showCustomAlert = (
  title: string,
  message: string,
  onConfirm?: () => void,
  cancelText?: string,
  buttonText = "OK"
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setAlertConfirmAction(() => onConfirm ?? null);
  setAlertCancelText(cancelText);
  setAlertButtonText(buttonText);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);
  setAlertConfirmAction(null);
  setAlertCancelText(undefined);
};

const confirmCustomAlert = () => {
  const action = alertConfirmAction;
  closeCustomAlert();
  action?.();
};
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


      showCustomAlert(
  "Error",
  "Unable to load order history"
);

    }

  };


// const cancelOrder = (orderId: number) => {
//     Alert.alert(
//         "Cancel Order",
//         "Are you sure you want to cancel this order?",
//         [
//             {
//                 text: "No",
//                 style: "cancel",
//             },
//             {
//                 text: "Yes, Cancel",
//                 style: "destructive",
//                 onPress: async () => {
//                     try {
//                         const token = await AsyncStorage.getItem("token");

//                         const response = await axios.post(
//                             `${API_URL}/api/orders/${orderId}/cancel`,
//                             {},
//                             {
//                                 headers: {
//                                     Authorization: `Bearer ${token}`,
//                                 },
//                             }
//                         );

//                         if (response.data.success) {
//                             Alert.alert(
//                                 "Success",
//                                 "Your order has been cancelled."
//                             );

//                             await fetchOrders();
//                         }
//                     } catch (error: any) {
//                         Alert.alert(
//                             "Unable to Cancel",
//                             error.response?.data?.message ||
//                                 "Something went wrong. Please try again."
//                         );
//                     }
//                 },
//             },
//         ]
//     );
// };

const cancelOrder = (orderId: number) => {
showCustomAlert(
"Cancel Order",
"Are you sure you want to cancel this order?",
async () => {
try {
const token = await AsyncStorage.getItem("token");


    const response = await axios.post(
      `${API_URL}/api/orders/${orderId}/cancel`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      showCustomAlert(
        "Success",
        "Your order has been cancelled."
      );

      await fetchOrders();
    } else {
      showCustomAlert(
        "Unable to Cancel",
        response.data.message ||
          "Something went wrong. Please try again."
      );
    }
  } catch (error: any) {
    showCustomAlert(
      "Unable to Cancel",
      error.response?.data?.message ||
        "Something went wrong. Please try again."
    );
  }
},
"No",
"Yes, Cancel"


);
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
              <View key={order.id}>


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


{String(order.status).toLowerCase() === "pending" && (
  <TouchableOpacity
    style={styles.cancelButton}
    onPress={() => cancelOrder(order.id)}
  >
    <Ionicons
      name="close-circle-outline"
      size={18}
      color="#D32F2F"
    />

    <Text style={styles.cancelButtonText}>
      Cancel Order
    </Text>
  </TouchableOpacity>
)}

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
cancelButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10,
  paddingVertical: 9,
  paddingHorizontal: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#D32F2F",
  alignSelf: "flex-start",
},


headerTitle: {
  fontFamily: "Inter-Medium",
  fontSize: 18,
  marginLeft: 12,
  color: "#000",
},

name: {
  fontFamily: "Inter-SemiBold",
  fontSize: 16,
  color: "#000",
},

meta: {
  fontFamily: "Inter-Regular",
  fontSize: 12,
  color: "#777",
  marginTop: 3,
},

price: {
  fontFamily: "Inter-Medium",
  fontSize: 14,
  color: "#000",
  marginTop: 5,
},

delivery: {
  fontFamily: "Inter-Regular",
  fontSize: 14,
  color: "#444",
  marginTop: 5,
},

payment: {
  fontFamily: "Inter-Regular",
  fontSize: 12,
  color: "#777",
  marginTop: 3,
},

empty: {
  fontFamily: "Inter-Regular",
  textAlign: "center",
  marginTop: 50,
  fontSize: 16,
  color: "#777",
},

cancelButtonText: {
  fontFamily: "Inter-SemiBold",
  color: "#D32F2F",
  fontSize: 13,
  marginLeft: 6,
},
});