// import React from 'react';

// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
// } from 'react-native';

// type Props = {
//   item: any;
// };

// const RecentOrderCard = ({
//   item,
// }: Props) => {

//   return (

//     <View style={styles.card}>

//       <Image
//         source={item.image}
//         style={styles.image}
//         resizeMode="contain"
//       />

//       <Text
//         numberOfLines={1}
//         style={styles.name}
//       >
//         {item.name}
//       </Text>

//       <Text style={styles.quantity}>
//         {item.quantity}
//       </Text>

//       <Text style={styles.price}>
//         {item.price}
//       </Text>

//     </View>

//   );

// };

// export default RecentOrderCard;

// const styles = StyleSheet.create({

//   card: {
//     width: '47%',
//     backgroundColor: '#FFF',
//     borderRadius: 16,
//     padding: 10,
//     margin: 6,

//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//   },

//   image: {
//     width: '100%',
//     height: 90,
//     alignSelf: 'center',
//   },

//   name: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: '#000',
//     marginTop: 6,
//   },

//   quantity: {
//     fontSize: 10,
//     fontFamily: 'Inter-Regular',
//     color: '#777',
//     marginTop: 4,
//   },

//   price: {
//     fontSize: 16,
//    fontFamily: 'Inter-Bold',
//     color: '#000',
//     marginTop: 4,
//   },

// });



import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../config/api";

type Props = {
  item: any;
};

const RecentOrderCard = ({ item }: Props) => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);

  const openProductDetails = async () => {
    try {
      setLoading(true);

      const productId = item.product_id ?? item.id;

      console.log("Clicked recent product:", item);
      console.log("Fetching product ID:", productId);

    const response = await fetch(
  `${API_URL}/api/products/${productId}`
);

const data = await response.json();

console.log("API URL:", `${API_URL}/api/products/${productId}`);
console.log("API STATUS:", response.status);
console.log("API RESPONSE:", data);

      if (!response.ok || !data.success || !data.product) {
        Alert.alert(
          "Product not found",
          "Unable to load the product details. Please try again."
        );
        return;
      }

      navigation.navigate("ProductDetails", {
        product: data.product,
      });
    } catch (error) {
      console.error("PRODUCT DETAILS ERROR:", error);

      Alert.alert(
        "Error",
        "Unable to load product details. Please check your internet connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={openProductDetails}
      disabled={loading}
    >
      {loading ? (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <ActivityIndicator size="small" color="#2E7D32" />
        </View>
      ) : typeof item.image === "number" ? (
        <Image
          source={item.image}
          style={styles.image}
          resizeMode="contain"
        />
      ) : item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>
            Image unavailable
          </Text>
        </View>
      )}

      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>

      <Text style={styles.quantity}>
        {item.quantity}
      </Text>

      <Text style={styles.price}>
        {item.price}
      </Text>
    </TouchableOpacity>
  );
};

export default RecentOrderCard;

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 10,
    margin: 6,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  image: {
    width: "100%",
    height: 90,
    alignSelf: "center",
  },
  imagePlaceholder: {
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#777",
    fontSize: 11,
  },
  name: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: "#000",
    marginTop: 6,
  },
  quantity: {
    fontSize: 10,
    fontFamily: "Inter-Regular",
    color: "#777",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#000",
    marginTop: 4,
  },
});

