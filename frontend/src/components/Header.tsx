import { useNavigation,useFocusEffect} from '@react-navigation/native';
import { View,Text,StyleSheet,TouchableOpacity, Image,} from 'react-native';
import React, { useState, useCallback } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api"; // adjust the path if needed
const Header = ({ location , userName }: any) => {
  const [unreadCount, setUnreadCount] = useState(0);
  console.log("CURRENT BADGE COUNT =", unreadCount);
  const navigation = useNavigation<any>();
  useFocusEffect(
  useCallback(() => {

    fetchUnreadCount();

    const timer = setInterval(() => {
      fetchUnreadCount();
    }, 3000);

    return () => clearInterval(timer);

  }, [])
);
 
   

const fetchUnreadCount = async () => {
  try {
   const token = await AsyncStorage.getItem("token");

if (!token) return;


    const response = await fetch(
      `${API_URL}/api/notifications/unread-count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
console.log("UNREAD DATA =", data);
    if (data.success) {
      console.log("SETTING BADGE COUNT =", data.count);
      setUnreadCount(data.count);
    }
  } catch (error) {
    console.log(error);
  }
};
  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View>

       <Text style={styles.helloText}>
  Hello {userName ? userName : "!"}
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
  onPress={() => navigation.navigate("Notification")}
>

  <Image
    source={require("../../assets/icons/notification.png")}
    style={styles.icon}
    resizeMode="contain"
  />
  {unreadCount > 0 && (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {unreadCount}
      </Text>
    </View>
  )}

</TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
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

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
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
  overflow: 'visible',
},
 badge:{
  position:"absolute",
  top:-8,
  right:-8,
  backgroundColor:"red",
  width:22,
  height:22,
  borderRadius:11,
  justifyContent:"center",
  alignItems:"center",
  zIndex:999,
  elevation:10,
},

badgeText:{
  color:"white",
  fontSize:12,
  fontWeight:"bold",
},

iconButton:{
  marginLeft:12,
  position:"relative",
  width:35,
  height:35,
  justifyContent:"center",
  alignItems:"center",
  overflow:"visible",
},

  icon: {
  width:28,
  height:28,
},


});