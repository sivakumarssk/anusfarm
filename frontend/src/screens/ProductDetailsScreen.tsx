import React from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import { useCart } from "../context/CartContext";


export default function ProductDetailsScreen({
  route,
  navigation
}: any) {


  const { product } = route.params;


  const {
    addToCart
  } = useCart();



  const handleAddToCart = () => {

     console.log("IMAGE BEFORE CART:", product.image);

    addToCart({

      id: product.id,

      name: product.name,

      
category:
product.category ||
(product.category_id === 1 ? "Milk":"Other"),

      unit: "1 Unit",

      price: Number(product.price),

      image:String(product.image),
       quantity: 1,
     type: "subscription",

    });



    navigation.navigate("Cart");


  };

// const handleInstantBuy = () => {

//   const instantItem = {
//     id: product.id,

//     name: product.name,

//     category:
//       product.category ||
//       (product.category_id === 1 ? "Milk" : "Other"),

//     price: Number(product.price),

//     image: String(product.image),

//     quantity: 1,

//     type: "instant" as const,

//     unit: "1 Unit",
//   };


//   addToCart(instantItem);


//  navigation.navigate("Address");

// };
const handleInstantBuy = () => {

  const instantItem = [
    {
      id: product.id,

      name: product.name,

      category:
        product.category ||
        (product.category_id === 1 ? "Milk" : "Other"),

      price: Number(product.price),

      image: String(product.image),

      quantity: 1,

      type: "instant",

      unit: "1 Unit",
    }
  ];


  navigation.navigate(
    "Address",
    {
      items: instantItem,
      type: "instant"
    }
  );

};
  return (

    <View style={styles.container}>


      <Image
        source={{
          uri: product.image
        }}
        style={styles.image}
        resizeMode="contain"
      />



      <Text style={styles.name}>
        {product.name}
      </Text>



      <Text style={styles.price}>
        ₹ {product.price}
      </Text>



      <Text style={styles.stock}>
        Stock : {product.stock}
      </Text>



      <Text style={styles.category}>
        Category : {product.category || product.category_id}
      </Text>



      <Text style={styles.description}>
        {product.description}
      </Text>



      <TouchableOpacity
        style={styles.cartButton}
        onPress={handleAddToCart}
      >

        <Text style={styles.cartText}>
          Add To Cart
        </Text>

      </TouchableOpacity>
        
        <TouchableOpacity
  style={styles.buyButton}
  onPress={handleInstantBuy}
>
  <Text style={styles.cartText}>
    Instant Buy
  </Text>
</TouchableOpacity>

    </View>

  );

}




const styles = StyleSheet.create({


container:{
  padding:20,
  backgroundColor:"#fff"
},



image:{
  width:"100%",
  height:300,
  borderRadius:10
},



name:{
  fontSize:25,
  fontWeight:"bold",
  marginTop:20
},



price:{
  fontSize:22,
  color:"green",
  fontWeight:"bold",
  marginTop:10
},



stock:{
  fontSize:16,
  marginTop:10
},



category:{
  fontSize:16,
  marginTop:10
},



description:{
  fontSize:16,
  marginTop:15,
  color:"#555"
},



cartButton:{
  backgroundColor:"green",
  padding:15,
  borderRadius:10,
  marginTop:30
},
buyButton:{
  backgroundColor:"black",
  padding:15,
  borderRadius:10,
  marginTop:15
},


cartText:{
  color:"white",
  textAlign:"center",
  fontSize:18,
  fontWeight:"bold"
}



});