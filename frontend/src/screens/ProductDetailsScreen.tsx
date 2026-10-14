// import React from "react";
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";

// import { Ionicons } from "@expo/vector-icons";
// import { useCart } from "../context/CartContext";

// export default function ProductDetailsScreen({
//   route,
//   navigation,
// }: any) {
//   const { product } = route.params;

//   const { addToCart } = useCart();

//   // ================= INVENTORY =================

//   const totalStock = Number(product.stock ?? 0);

//   const subscriptionStock = Number(
//     product.subscription_stock ?? 0
//   );

//   const instantStock = Number(
//     product.instant_stock ?? 0
//   );

//   // ================= ADD TO CART =================
//   // Cart is for subscription

//   const handleAddToCart = () => {
//     if (subscriptionStock <= 0) {
//       return;
//     }

//     addToCart({
//       id: product.id,

//       name: product.name,

//       category:
//         product.category ||
//         (product.category_id === 1
//           ? "Milk"
//           : "Other"),

//       unit: "1 Unit",

//       price: Number(product.price),

//       image: String(product.image),

//       quantity: 1,

//       type: "subscription",
//     });

//     navigation.navigate("Cart");
//   };

//   // ================= INSTANT BUY =================

//   const handleInstantBuy = () => {
//     // Do not allow instant order if instant stock is 0
//     if (instantStock <= 0) {
//       return;
//     }

//     const instantItem = [
//       {
//         id: product.id,

//         name: product.name,

//         category:
//           product.category ||
//           (product.category_id === 1
//             ? "Milk"
//             : "Other"),

//         price: Number(product.price),

//         image: String(product.image),

//         quantity: 1,

//         type: "instant",

//         unit: "1 Unit",
//       },
//     ];

//     navigation.navigate("Address", {
//       items: instantItem,
//       type: "instant",
//     });
//   };

//   return (
//     <View style={styles.container}>

//       {/* ================= BACK BUTTON ================= */}

//       <TouchableOpacity
//         onPress={() => navigation.goBack()}
//         style={styles.backButton}
//       >
//         <Ionicons
//           name="arrow-back"
//           size={28}
//           color="#000"
//         />
//       </TouchableOpacity>

//       {/* ================= PRODUCT IMAGE ================= */}

//       <Image
//         source={{
//           uri: product.image,
//         }}
//         style={styles.image}
//         resizeMode="contain"
//       />

//       {/* ================= PRODUCT NAME ================= */}

//       <Text style={styles.name}>
//         {product.name}
//       </Text>

//       {/* ================= PRICE ================= */}

//       <Text style={styles.price}>
//         ₹ {product.price}
//       </Text>

//       {/* ================= TOTAL STOCK ================= */}

//       <Text style={styles.stock}>
//         Total Stock : {totalStock}
//       </Text>

//       {/* ================= SUBSCRIPTION STOCK ================= */}

//       <Text style={styles.subscriptionStock}>
//         Subscription Available : {subscriptionStock}
//       </Text>

//       {/* ================= INSTANT STOCK ================= */}

//       <Text style={styles.instantStock}>
//         Instant Available : {instantStock}
//       </Text>

//       {/* ================= CATEGORY ================= */}

//       <Text style={styles.category}>
//         Category :{" "}
//         {product.category || product.category_id}
//       </Text>

//       {/* ================= DESCRIPTION ================= */}

//       <Text style={styles.description}>
//         {product.description}
//       </Text>

//       {/* ================= ADD TO CART ================= */}

//       <TouchableOpacity
//         style={[
//           styles.cartButton,
//           subscriptionStock <= 0 &&
//             styles.disabledButton,
//         ]}
//         onPress={handleAddToCart}
//         disabled={subscriptionStock <= 0}
//       >
//         <Text style={styles.cartText}>
//           {subscriptionStock <= 0
//             ? "Subscription Out of Stock"
//             : "Add To Cart"}
//         </Text>
//       </TouchableOpacity>

//       {/* ================= INSTANT BUY ================= */}

//       <TouchableOpacity
//         style={[
//           styles.buyButton,
//           instantStock <= 0 &&
//             styles.disabledButton,
//         ]}
//         onPress={handleInstantBuy}
//         disabled={instantStock <= 0}
//       >
//         <Text style={styles.cartText}>
//           {instantStock <= 0
//             ? "Instant Order Unavailable"
//             : `Instant Buy (${instantStock} Available)`}
//         </Text>
//       </TouchableOpacity>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },

//   image: {
//     width: "100%",
//     height: 300,
//     borderRadius: 10,
//   },

//   name: {
//     fontSize: 20,
//     fontFamily: "Inter-Bold",
//     marginTop: 20,
//   },

//   price: {
//     fontSize: 18,
//     color: "green",
//     fontFamily: "Inter-Bold",
//     marginTop: 10,
//   },

//   stock: {
//     fontSize: 13,
//     fontFamily: "Inter-Regular",
//     marginTop: 10,
//   },

//   subscriptionStock: {
//     fontSize: 13,
//     color: "#555",
//     fontFamily: "Inter-Regular",
//     marginTop: 6,
//   },

//   instantStock: {
//     fontSize: 13,
//     color: "#008015",
//     fontFamily: "Inter-SemiBold",
//     marginTop: 6,
//   },

//   category: {
//     fontSize: 12,
//     fontFamily: "Inter-Regular",
//     marginTop: 10,
//   },

//   description: {
//     fontSize: 13,
//     marginTop: 15,
//     color: "#555",
//     fontFamily: "Inter-Regular",
//   },

//   cartButton: {
//     backgroundColor: "green",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 30,
//   },

//   buyButton: {
//     backgroundColor: "black",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 15,
//   },

//   cartText: {
//     color: "white",
//     textAlign: "center",
//     fontSize: 15,
//     fontFamily: "Inter-Bold",
//   },

//   disabledButton: {
//     backgroundColor: "#999",
//   },

//   backButton: {
//     marginBottom: 20,
//     marginTop: 20,
//   },
// });


import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function ProductDetailsScreen({
  route,
  navigation,
}: any) {
  // const { product } = route.params;
const product = route.params?.product;
if (!product) {
  return (
    <View style={styles.container}>
      <Text>Product details not found.</Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
console.log("PRODUCT DETAILS DATA =", product);

  const { addToCart } = useCart();

  // ================= INVENTORY =================

  // Total physical stock entered by admin
  const totalStock = Number(product.stock ?? 0);

  // Quantity reserved by active subscriptions
  const subscriptionRequired = Number(
    product.subscription_required ?? 0
  );

  // Stock available for instant orders
  const instantAvailable = Number(
    product.instant_available ?? 0
  );

  // ================= ADD TO CART =================
  // Cart is for subscription

  const handleAddToCart = () => {
    if (totalStock <= 0) {
      return;
    }

    addToCart({
      id: product.id,

      name: product.name,

      category:
        product.category ||
        (product.category_id === 1
          ? "Milk"
          : "Other"),

      unit: "1 Unit",

      price: Number(product.price),

      image: String(product.image),

      quantity: 1,

      type: "subscription",
    });

    navigation.navigate("Cart");
  };

  // ================= INSTANT BUY =================

  const handleInstantBuy = () => {
    if (instantAvailable <= 0) {
      return;
    }

    const instantItem = [
      {
        id: product.id,

        name: product.name,

        category:
          product.category ||
          (product.category_id === 1
            ? "Milk"
            : "Other"),

        price: Number(product.price),

        image: String(product.image),

        quantity: 1,

        type: "instant",

        unit: "1 Unit",
      },
    ];

    navigation.navigate("Address", {
      items: instantItem,
      type: "instant",
    });
  };

  return (
    <View style={styles.container}>

      {/* ================= BACK BUTTON ================= */}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons
          name="arrow-back"
          size={28}
          color="#000"
        />
      </TouchableOpacity>

      {/* ================= PRODUCT IMAGE ================= */}

      <Image
        source={{
          uri: product.image,
        }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* ================= PRODUCT NAME ================= */}

      <Text style={styles.name}>
        {product.name}
      </Text>

      {/* ================= PRICE ================= */}

      <Text style={styles.price}>
        ₹ {product.price}
      </Text>

      {/* ================= TOTAL STOCK ================= */}

      <Text style={styles.stock}>
        Total Stock : {totalStock}
      </Text>

      {/* ================= SUBSCRIPTION ================= */}

      <Text style={styles.subscriptionStock}>
        Subscription Required : {subscriptionRequired}
      </Text>

      {/* ================= INSTANT STOCK ================= */}

      <Text style={styles.instantStock}>
        Instant Available : {instantAvailable}
      </Text>

      {/* ================= CATEGORY ================= */}

      <Text style={styles.category}>
        Category :{" "}
        {product.category || product.category_id}
      </Text>

      {/* ================= DESCRIPTION ================= */}

      <Text style={styles.description}>
        {product.description}
      </Text>

      {/* ================= ADD TO CART ================= */}

      <TouchableOpacity
        style={[
          styles.cartButton,
          totalStock <= 0 &&
            styles.disabledButton,
        ]}
        onPress={handleAddToCart}
        disabled={totalStock <= 0}
      >
        <Text style={styles.cartText}>
          {totalStock <= 0
            ? "Subscription Out of Stock"
            : "Add To Cart"}
        </Text>
      </TouchableOpacity>

      {/* ================= INSTANT BUY ================= */}

      <TouchableOpacity
        style={[
          styles.buyButton,
          instantAvailable <= 0 &&
            styles.disabledButton,
        ]}
        onPress={handleInstantBuy}
        disabled={instantAvailable <= 0}
      >
        <Text style={styles.cartText}>
          {instantAvailable <= 0
            ? "Instant Order Unavailable"
            : `Instant Buy (${instantAvailable} Available)`}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
  },

  name: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    marginTop: 20,
  },

  price: {
    fontSize: 18,
    color: "green",
    fontFamily: "Inter-Bold",
    marginTop: 10,
  },

  stock: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    marginTop: 10,
  },

  subscriptionStock: {
    fontSize: 13,
    color: "#555",
    fontFamily: "Inter-Regular",
    marginTop: 6,
  },

  instantStock: {
    fontSize: 13,
    color: "#008015",
    fontFamily: "Inter-SemiBold",
    marginTop: 6,
  },

  category: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    marginTop: 10,
  },

  description: {
    fontSize: 13,
    marginTop: 15,
    color: "#555",
    fontFamily: "Inter-Regular",
  },

  cartButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },

  buyButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  cartText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Inter-Bold",
  },

  disabledButton: {
    backgroundColor: "#999",
  },

  backButton: {
    marginBottom: 20,
    marginTop: 20,
  },
});

