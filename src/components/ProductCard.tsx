import React from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const ProductCard = ({ item }: any) => {

  return (

    <View style={styles.card}>

     <View style={styles.imageContainer}>

  <Image
    source={item.image}
    style={styles.productImage}
    resizeMode="contain"
  />

</View>

      <View style={styles.detailsContainer}>

        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text style={styles.quantity}>
          {item.quantity}
        </Text>

        <Text style={styles.price}>
          {item.price}
        </Text>

        <TouchableOpacity
          style={styles.button}
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

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  productImage: {
    width: 100,
    height: 100,
  },

  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 16,
    fontWeight:'500',
    color: '#000',
  },

  quantity: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },

  button: {
    marginTop: 8,
    backgroundColor: '#000',
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  imageContainer: {
  width: 100,
  height: 120,
  backgroundColor: '#F4F4F4',
  borderRadius: 16,
  justifyContent: 'center',
  alignItems: 'center',
},

});