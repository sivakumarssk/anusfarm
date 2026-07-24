import React from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const OrdersHeader = () => {
  const navigation = useNavigation<any>();

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        My Orders
      </Text>

      <View style={styles.iconsContainer}>

        <TouchableOpacity>

          <Image
            source={require('../../assets/icons/notification.png')}
            style={styles.icon}
            resizeMode="contain"
          />

        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>{
          navigation.navigate("Wallet")
        }}
        >

          <Image
            source={require('../../assets/icons/wallet.png')}
            style={styles.icon}
            resizeMode="contain"
          />

        </TouchableOpacity>

        <TouchableOpacity
        onPress={()=>{
          navigation.navigate("Cart")
        }}
        >

          <Image
            source={require('../../assets/icons/cart.png')}
            style={styles.icon}
            resizeMode="contain"
          />

        </TouchableOpacity>

      </View>

    </View>

  );

};

export default OrdersHeader;

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },

  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 22,
    height: 22,
    marginLeft: 14,
  },

});