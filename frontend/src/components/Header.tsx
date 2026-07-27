import React from 'react';

import {useNavigation} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const Header = ({location}:any) => {
  const navigation = useNavigation<any>();

  return (

    <View style={styles.container}>

      {/* Left Section */}

      <View>

        <Text style={styles.helloText}>
          Hello !
        </Text>

        <View style={styles.locationContainer}>

  <Image
    source={require('../../assets/icons/location.png')}
    style={styles.locationIcon}
    resizeMode="contain"
  />

  <Text style={styles.locationText}>
  {location || "Select your location"}
</Text>

</View>

      </View>

      {/* Right Section */}

      <View style={styles.iconContainer}>

        <TouchableOpacity
          style={styles.iconButton}
        >

          <Image
            source={require('../../assets/icons/notification.png')}
            style={styles.icon}
            resizeMode="contain"
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={()=>{
            navigation.navigate("Wallet");
          }}
        >

          <Image
            source={require('../../assets/icons/wallet.png')}
            style={styles.icon}
            resizeMode="contain"
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
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

export default Header;

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 45,
  },

  helloText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
    marginBottom: 3,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

    locationIcon: {
  width: 16,
  height: 16,
  marginRight: 4,
},

  locationText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 3,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    marginLeft: 12,
  },

  icon: {
    width: 20,
    height: 20,
  },


});