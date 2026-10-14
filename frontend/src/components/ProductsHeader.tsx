

import React from 'react';
import {
  useNavigation,
} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type Props = {
  cartCount: number;
};

const ProductsHeader = ({
  cartCount,
}: Props) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>

      {/* Back Arrow + Title */}
      <View style={styles.leftContainer}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={26}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.title}>
          Products
        </Text>

      </View>

      {/* Right Icons */}
      <View style={styles.iconsContainer}>

        <TouchableOpacity>
          <Image
            source={require('../../assets/icons/notification.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Wallet");
          }}
        >
          <Image
            source={require('../../assets/icons/wallet.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
          >
            <Image
              source={require('../../assets/icons/cart.png')}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {cartCount}
              </Text>
            </View>
          )}
        </View>

      </View>

    </View>
  );
};

export default ProductsHeader;

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },

  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginLeft: 10,
    marginRight: 8,
  },

  title: {
  fontSize: 20,
  fontFamily: 'Inter-Bold',
  color: '#000',
},

  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },

  icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
  color: '#FFF',
  fontSize: 10,
  fontFamily: 'Inter-Bold',
},

});
