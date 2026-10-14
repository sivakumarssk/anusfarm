import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

import {
  useNavigation,
} from '@react-navigation/native';

const EmptyCart = () => {

  const navigation =
    useNavigation<any>();

  return (

    <View style={styles.container}>

      <Image
        source={require('../../assets/icons/cart.png')}
        style={styles.image}
      />

      <Text style={styles.title}>
        Your Cart is Empty
      </Text>

      <Text style={styles.subtitle}>
        Looks like you haven't added
        any products yet.
      </Text>

      <TouchableOpacity
        style={styles.button}
       onPress={() =>
  navigation.navigate(
    'HomeScreen',
    {
      screen: 'Products',
    }
  )
}
>

        <Text style={styles.buttonText}>
          Start Shopping
        </Text>

      </TouchableOpacity>

    </View>

  );

};

export default EmptyCart;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  image: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: '#4CAF50',
  },

  title: {
  fontSize: 22,
  fontWeight: '700',
  fontFamily: 'Inter-Bold',
  color: '#000',
},

 subtitle: {
  textAlign: 'center',
  color: '#666',
  marginTop: 10,
  lineHeight: 22,
  fontFamily: 'Inter-Regular',
},

  button: {
    marginTop: 24,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },

  buttonText: {
  color: '#FFF',
  fontWeight: '600',
  fontFamily: 'Inter-SemiBold',
},

});