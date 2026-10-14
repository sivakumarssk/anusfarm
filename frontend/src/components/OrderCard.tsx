import React from 'react';

import { View,  Text,  StyleSheet,  TouchableOpacity,  Image,} from 'react-native';

  const OrderCard = ({order,  onPress,  onPressAction,  showActionButton = false,}: any) => {
  
  const products = order.products || [];
const firstProduct = products[0];

  return (
  <TouchableOpacity
  style={styles.card}
  activeOpacity={0.8}
  onPress={() => {
    console.log("ORDER CARD CLICKED");
    // onPress && onPress();
    if(onPress){
   onPress(order);
 }
  }}>
  
<View style={{
  backgroundColor:'#F5F5F5',
  height:120,
  width:100,
  justifyContent:'center',
  alignItems:'center',
  borderRadius:20,
}}>


     {/* {firstProduct?.image ? (
  <Image
  source={{
    uri: firstProduct.image,
  }}
  style={styles.image}
  resizeMode="contain"
/>
) : (
  <View
    style={[
      styles.image,
      {
        backgroundColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
        
      },
    ]}
  >
    <Text style={{ fontFamily: "Inter-Regular" }}>
  No Image
</Text>
  </View>
)} */}

{firstProduct?.image ? (
  <Image
    source={{ uri: firstProduct.image }}
    style={styles.image}
    resizeMode="contain"
    onError={(error) =>
      console.log(
        "ORDER PRODUCT IMAGE ERROR:",
        firstProduct.image,
        error.nativeEvent.error
      )
    }
  />
) : (
  <View
    style={[
      styles.image,
      {
        backgroundColor: "#EEE",
        justifyContent: "center",
        alignItems: "center",
      },
    ]}
  >
    <Text style={{ fontFamily: "Inter-Regular" }}>
      No Image
    </Text>
  </View>
)}
      </View>

      <View style={styles.content}>

       
  
{
products.map((item:any,index:number)=>(

<View key={index}>

<Text style={styles.name}>
 {item.product_name}
</Text>

<Text style={styles.info}>
 Qty {item.quantity}
</Text>

<Text style={styles.price}>
 ₹{item.price}
</Text>

</View>

))
}

      <Text style={styles.status}>
  Status: {order.status}
</Text>

<Text style={styles.status}>
  Ordered: {new Date(order.created_at).toLocaleDateString()}
</Text>

      {
  showActionButton && (

    <TouchableOpacity
      style={styles.button}
      onPress={onPressAction}
    >
      <Text style={styles.buttonText}>
        Change Schedule
      </Text>
    </TouchableOpacity>

  )
}

      </View>

    </TouchableOpacity>

  );

};

export default OrderCard;

// const styles = StyleSheet.create({

//   card: {
//     flexDirection: 'row',

//     backgroundColor: '#FFF',

//     borderRadius: 16,

//     padding: 12,
  

//     marginBottom: 12,

//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//   },

//   image: {
//     width: 80,
//     height: 110,
//     borderRadius: 12,
//   },

//   content: {
//     flex: 1,
//     marginLeft: 12,
//   },

//   name: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#000',
//   },

//   info: {
//     fontSize: 12,
//     color: '#777',
//     marginTop: 4,
//   },

//   price: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#000',
//     marginTop: 6,
//   },

//   status: {
//     fontSize: 11,
//     color: '#666',
//     marginTop: 4,
//   },

//   button: {
//     height: 34,

//     backgroundColor: '#000',

//     borderRadius: 8,

//     marginTop: 8,

//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   buttonText: {
//     color: '#FFF',
//     fontSize: 12,
//     fontWeight: '600',
//   },

// });

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  image: {
    width: 80,
    height: 110,
    borderRadius: 12,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontFamily: "Inter-SemiBold",
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
  },

  info: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  price: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginTop: 6,
  },

  status: {
    fontFamily: "Inter-Regular",
    fontSize: 11,
    color: "#666",
    marginTop: 4,
  },

  button: {
    height: 34,
    backgroundColor: "#000",
    borderRadius: 8,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "Inter-SemiBold",
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});