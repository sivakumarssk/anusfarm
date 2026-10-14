import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';

const ProductCard = ({ item }: any) => {
  const { addToCart } = useCart();
  const navigation = useNavigation<any>();

 
const openProductDetails = () => {
  navigation.navigate("ProductDetails", {
    product: item,
  });
};



  return (
    <View style={styles.card}>
      {/* Clickable Product Image */}
      <TouchableOpacity
        style={styles.imageContainer}
        activeOpacity={0.8}
        onPress={openProductDetails}
      >
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.productImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.noImage}>No Image</Text>
        )}
      </TouchableOpacity>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <TouchableOpacity
          onPress={openProductDetails}
          activeOpacity={0.7}
        >
          <Text style={styles.productName}>
            {item.name}
          </Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>
          Stock: {item.stock}
        </Text>

        <Text style={styles.price}>
          ₹{item.price}
        </Text>

        {/* Add to Cart */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addToCart({
              id: item.id,
              name: item.name,
              price: Number(item.price),
              image: item.image,
              category: item.category,
              unit: item.unit || '1 L',
              quantity: 1,
              type: 'subscription',
            });
          }}
        >
          <Text style={styles.buttonText}>
            Grab Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCard;

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 18,
//     padding: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: '#EAEAEA',
//   },

//   imageContainer: {
//     width: 100,
//     height: 120,
//     backgroundColor: '#F4F4F4',
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   productImage: {
//     width: 100,
//     height: 100,
//   },

//   noImage: {
//     color: '#777',
//     fontSize: 12,
//   },

//   detailsContainer: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   productName: {
//     fontSize: 16,
//     fontFamily: 'Inter-Medium',
//     color: '#000',
//   },

//   quantity: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#777',
//     marginTop: 4,
//   },

//   price: {
//     fontSize: 16,
//     fontFamily: 'Inter-Bold',
//     color: '#000',
//     marginTop: 4,
//   },

//   button: {
//     marginTop: 8,
//     backgroundColor: '#000',
//     height: 36,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: '#FFF',
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//   },
// });

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  imageContainer: {
    width: 110,
    height: 130,
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  productImage: {
    width: 105,
    height: 105,
  },

  noImage: {
    color: "#777",
    fontSize: 12,
    fontFamily: "Inter-Regular",
  },

  detailsContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  productName: {
    fontSize: 17,
    fontFamily: "Inter-SemiBold",
    color: "#111",
  },

  quantity: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#777",
    marginTop: 6,
  },

  price: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#111",
    marginTop: 5,
  },

  button: {
    marginTop: 10,
    backgroundColor: "#2E7D32",
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
});