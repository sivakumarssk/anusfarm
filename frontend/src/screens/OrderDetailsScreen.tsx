// import React, { useEffect, useState } from "react";
// import {View, Text,StyleSheet, TouchableOpacity,ScrollView,Image,} from "react-native";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "../config/api";

// const OrderDetailsScreen = () => {
//   const route: any = useRoute();
//   const navigation: any = useNavigation();

//   const { order: selectedOrder } = route.params;

//   const [order, setOrder] = useState(selectedOrder);

//   const orderId = selectedOrder.id;

//   useEffect(() => {
//     loadOrder();
//   }, []);

//   const loadOrder = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");

//       const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
// console.log("ORDER DETAILS:", JSON.stringify(data, null, 2));
//       console.log("ORDER DETAILS", data);

//       if (data.success) {
//          data.order.products.forEach((item: any) => {
//     console.log("IMAGE FROM API =", item.image);
//   });
//         const updatedProducts = data.order.products.map((item: any) => ({
//           ...item,
//           image: `${API_URL.replace("/api", "")}/uploads/${item.image}`,
//         }));

//         setOrder({
//           ...data.order,
//           products: updatedProducts,
//         });
//       }
//     } catch (error) {
//       console.log("ORDER DETAILS ERROR:", error);
//     }
//   };

//   if (!order) {
//     return (
//       <View style={styles.center}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Order Details</Text>

//       {order.products?.map((item: any, index: number) => (
        
//         <View key={index} style={styles.card}>
//           <Image
//             source={{
//               uri: item.image,
//             }}
//             style={styles.image}
//             resizeMode="contain"
//              onLoad={() => console.log("IMAGE LOADED")}
//   onError={(e) => console.log("IMAGE ERROR:", e.nativeEvent)}
//           />

//           <Text style={styles.productName}>{item.product_name}</Text>

//           <Text style={styles.text}>
//             Quantity: {item.quantity}
//           </Text>

//           <Text style={styles.text}>
//             Price: ₹{item.price}
//           </Text>
//         </View>
//       ))}

//       <TouchableOpacity
//         style={styles.trackButton}
//         onPress={() =>
//           navigation.navigate("TrackOrder", {
//             orderId: order.order_id || order.id,
//           })
//         }
//       >
//         <Text style={styles.trackText}>Track Order</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default OrderDetailsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//     padding: 16,
//   },

//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//   },

//   card: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 15,
//     elevation: 2,
//   },

//   image: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     alignSelf: "center",
//     marginBottom: 10,
//   },

//   productName: {
//     fontSize: 17,
//     fontWeight: "600",
//     marginBottom: 5,
//   },

//   text: {
//     fontSize: 15,
//     color: "#555",
//     marginTop: 2,
//   },

//   trackButton: {
//     backgroundColor: "#000",
//     height: 50,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 25,
//     marginBottom: 30,
//   },

//   trackText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
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
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const OrderDetailsScreen = () => {
  const route: any = useRoute();
  const navigation: any = useNavigation();

  const { order: selectedOrder } = route.params;

  const [order, setOrder] = useState(selectedOrder);

  const orderId = selectedOrder.id;

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      console.log("ORDER DETAILS:", JSON.stringify(data, null, 2));
      console.log("ORDER DETAILS", data);

      if (data.success) {
        data.order.products.forEach((item: any) => {
          console.log("IMAGE FROM API =", item.image);
        });

        const updatedProducts = data.order.products.map((item: any) => ({
          ...item,
          image: `${API_URL.replace("/api", "")}/uploads/${item.image}`,
        }));

        setOrder({
          ...data.order,
          products: updatedProducts,
        });
      }
    } catch (error) {
      console.log("ORDER DETAILS ERROR:", error);
    }
  };

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Back Arrow + Existing Title */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.title}>Order Details</Text>
      </View>

      {order.products?.map((item: any, index: number) => (
        <View key={index} style={styles.card}>
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.image}
            resizeMode="contain"
            onLoad={() => console.log("IMAGE LOADED")}
            onError={(e) =>
              console.log("IMAGE ERROR:", e.nativeEvent)
            }
          />

          <Text style={styles.productName}>
            {item.product_name}
          </Text>

          <Text style={styles.text}>
            Quantity: {item.quantity}
          </Text>

          <Text style={styles.text}>
            Price: ₹{item.price}
          </Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.trackButton}
        onPress={() =>
          navigation.navigate("TrackOrder", {
            orderId: order.order_id || order.id,
          })
        }
      >
        <Text style={styles.trackText}>Track Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop:20
  },

  backButton: {
    marginRight: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",

  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },

  productName: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 5,
  },

  text: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },

  trackButton: {
    backgroundColor: "#000",
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 30,
  },

  trackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
