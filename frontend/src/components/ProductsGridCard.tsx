import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

type Props = {
  item: any;
  setLastAddedProduct: React.Dispatch<React.SetStateAction<any>>;
};

const ProductsGridCard = ({
  item,
  setLastAddedProduct,
}: Props) => {
  const navigation = useNavigation<any>();

  const {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const cartItem = cartItems.find(
    (product) => product.id === item.id
  );

  const quantity = cartItem?.quantity || 0;

  const handleIncrease = () => {
    setLastAddedProduct(item);

    if (cartItem) {
      increaseQuantity(item.id);
    } else {
      addToCart({
  id: item.id,
  name: item.name,
  category: item.category,
unit: item.unit || "1 Unit",
price: Number(item.price),
image: item.image,
quantity: 1,
type: item.category === "Milk" ? "subscription" : "instant",
});
    }
  };

  const handleDecrease = () => {
    decreaseQuantity(item.id);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          product: item,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="contain"
      />

      <Text numberOfLines={1} style={styles.name}>
        {item.name}
      </Text>

      <Text style={styles.quantity}>
        Stock : {item.stock}
      </Text>

      <Text style={styles.price}>
        ₹{item.price}
      </Text>

      {quantity === 0 ? (
        <TouchableOpacity
          style={styles.button}
          onPress={(e) => {
            e.stopPropagation();
            handleIncrease();
          }}
        >
          <Text style={styles.buttonText}>
            Add +
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleDecrease();
            }}
          >
            <Text style={styles.actionText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.countText}>
            {quantity}
          </Text>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              handleIncrease();
            }}
          >
            <Text style={styles.actionText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProductsGridCard;

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

  name: {
  fontSize: 11,
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
  fontSize: 12,
  fontFamily: "Inter-Bold",
  color: "#000",
  marginTop: 4,
},

  button: {
    backgroundColor: "#000",
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  buttonText: {
  color: "#FFF",
  fontSize: 12,
  fontFamily: "Inter-SemiBold",
},

  quantityContainer: {
    height: 32,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 8,
  },

 actionText: {
  fontSize: 18,
  fontFamily: "Inter-SemiBold",
  color: "#000",
},

 countText: {
  fontSize: 14,
  fontFamily: "Inter-SemiBold",
  color: "#000",
},
});