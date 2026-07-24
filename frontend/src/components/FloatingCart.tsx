import React from 'react';
import {
  useNavigation,
} from '@react-navigation/native';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  cartCount: number;
  productImage: any;
};

const FloatingCart = ({
  cartCount,
  productImage,
}: Props) => {

  if (cartCount === 0) {
    return null;
  }

  const navigation = useNavigation<any>();

  return (

    <TouchableOpacity
      style={styles.container}
      onPress={()=>
        navigation.navigate('Cart')
      }
    >

      <View
  style={{
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
  <Image
   // source={require('../../assets/products/a2-buffalo-milk.png')}
   source={productImage}
    style={styles.image}
    resizeMode="contain"
  />
</View>

      <View style={styles.textContainer}>

        <Text style={styles.title}>
          Cart
        </Text>

        <Text style={styles.subtitle}>
          {cartCount} Item
          {cartCount > 1 ? 's' : ''}
        </Text>

      </View>

    </TouchableOpacity>

  );

};

export default FloatingCart;

const styles = StyleSheet.create({

  container: {
    position: 'absolute',

    bottom: 100,

    alignSelf: 'center',

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#3D3D3D',

    borderRadius: 25,

    paddingLeft: 6,
    paddingRight: 14,

    height: 48,
    width:110,

    elevation: 6,
  },

  image: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: '#FFF',
  },

  textContainer: {
    marginLeft: 8,
  },

  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },

  subtitle: {
    color: '#D0D0D0',
    fontSize: 11,
    marginTop: -2,
  },

});