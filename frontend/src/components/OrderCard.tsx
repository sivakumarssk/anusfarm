import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const OrderCard = ({
  order,
  onPressAction,
  showActionButton = false,
}: any) => {
  const product =
  order.items &&
  order.items.length > 0
    ? order.items[0]
    : null;
  return (

    <View style={styles.card}>
<View style={{
  backgroundColor:'#F5F5F5',
  height:120,
  width:100,
  justifyContent:'center',
  alignItems:'center',
  borderRadius:20,
}}>


     {product?.image ? (
  <Image
    source={{ uri: product.image }}
    style={styles.image}
    resizeMode="contain"
    onLoad={() => console.log("ORDER IMAGE:", product.image)}
    onError={(e) =>
      console.log("IMAGE ERROR:", e.nativeEvent.error)
    }
  />
) : (
  <View
    style={[
      styles.image,
      {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEE",
      },
    ]}
  >
    <Text>No Image</Text>
  </View>
)}
      </View>

      <View style={styles.content}>

        <Text style={styles.name}>
  {product?.name || "No Product"}
</Text>

<Text style={styles.info}>
  {product
    ? `${product.unit} | Qty ${product.quantity}`
    : "No items"}
</Text>

<Text style={styles.price}>
  ₹{product?.price ?? 0}
</Text>

       <Text style={styles.status}>
  {
    order.status === 'scheduled'
      ? `Scheduled ${
          new Date(
            order.deliveryDate
          ).toDateString()
        }`
      : 'Delivered'
  }
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

    </View>

  );

};

export default OrderCard;

const styles = StyleSheet.create({

  card: {
    flexDirection: 'row',

    backgroundColor: '#FFF',

    borderRadius: 16,

    padding: 12,
  

    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#E8E8E8',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  info: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 6,
  },

  status: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },

  button: {
    height: 34,

    backgroundColor: '#000',

    borderRadius: 8,

    marginTop: 8,

    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

});