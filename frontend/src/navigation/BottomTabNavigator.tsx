import React from 'react';

import { Image } from 'react-native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {

  return (

    <Tab.Navigator

      screenOptions={{

        headerShown: false,

        tabBarStyle: {
  position: 'absolute',

  
  left: 12,
  right: 12,

  height: 90,
  paddingTop:10,

  backgroundColor: '#000',

  borderRadius: 20,

  borderTopWidth: 0,

  elevation: 10,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.15,
  shadowRadius: 8,
},

        tabBarActiveTintColor: '#FFF',

        tabBarInactiveTintColor: '#FFF',

        tabBarLabelStyle: {
          fontSize: 10,
          marginBottom: 6,
        },

      }}
    >

      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (

            <Image
              source={
                focused
                  ? require('../../assets/icons/home-active.png')
                  : require('../../assets/icons/home-inactive.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />

          ),
        }}
      />

      <Tab.Screen
        name="Products"
        component={ProductsScreen}
        options={{
          tabBarIcon: ({ focused }) => (

            <Image
              source={
                focused
                  ? require('../../assets/icons/products-active.png')
                  : require('../../assets/icons/products-inactive.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />

          ),
        }}
      />

      <Tab.Screen
        name="My Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ focused }) => (

            <Image
              source={
                focused
                  ? require('../../assets/icons/MyOrders-active.png')
                  : require('../../assets/icons/MyOrders-inactive.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />

          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (

            <Image
              source={
                focused
                  ? require('../../assets/icons/profile-active.png')
                  : require('../../assets/icons/profile-inactive.png')
              }
              style={{
                width: 24,
                height: 24,
              }}
            />

          ),
        }}
      />

    </Tab.Navigator>

  );

};

export default BottomTabNavigator;