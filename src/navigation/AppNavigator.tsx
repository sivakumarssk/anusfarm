import React from 'react';

import CartScreen
from '../screens/CartScreen';

import { NavigationContainer } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigator';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/OnboardingScreen/onboardingScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import InstantBuyPaymentScreen from '../screens/InstantBuyPaymentScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import LoginScreen from '../screens/LoginScreen';
import SplashScreen from '../screens/SplashScreen';
import SubscribePaymentScreen from '../screens/SubscribePaymentScreen';
import SubscriptionSuccessScreen from '../screens/SubscriptionSuccessScreen';
import InstantBuySuccessScreen from '../screens/InstantBuySuccessScreen';
import PausedDeliveriesScreen from '../screens/PausedDeliveriesScreen';
import AddressScreen from '../screens/AddressScreen';
import EditScheduleScreen from '../screens/EditScheduleScreen';

import LocationScreen from '../screens/LocationScreen';
import WalletScreen from '../screens/WalletScreen';
import DeliveryScheduleScreen from '../screens/DeliveryScheduleScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import LocationUnavailableScreen from '../screens/LocationUnavailableScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  return (

    <NavigationContainer>

      <Stack.Navigator
      initialRouteName='Splash'
        screenOptions={{
          headerShown: false,
        }}
      >
      
      <Stack.Screen
  name="Splash"
  component={SplashScreen}
/>
     
        <Stack.Screen
          name="Onboarding"
          component={OnboardingScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
  name="OtpVerify"
  component={OtpVerifyScreen}
/>

<Stack.Screen
  name="Location"
  component={LocationScreen}
/>

<Stack.Screen
  name="LocationUnavailable"
  component={LocationUnavailableScreen}
/>

<Stack.Screen
  name="GuestHome"
  component={BottomTabNavigator}
/>

<Stack.Screen
name="HomeScreen"
component={BottomTabNavigator}
/>

<Stack.Screen
  name="TransactionHistory"
  component={
    TransactionHistoryScreen
  }
/>

<Stack.Screen
  name="Cart"
  component={CartScreen}
  options={{
    headerShown: false,
  }}
/>

<Stack.Screen
  name="Wallet"
  component={WalletScreen}
/>

<Stack.Screen
  name="DeliverySchedule"
  component={
    DeliveryScheduleScreen
  }
/>

<Stack.Screen
  name="SubscribePayment"
  component={SubscribePaymentScreen}
/>

<Stack.Screen
  name="SubscriptionSuccess"
  component={SubscriptionSuccessScreen}
/>

<Stack.Screen
  name="InstantBuyPayment"
  component={InstantBuyPaymentScreen}
/>

<Stack.Screen
  name="InstantBuySuccess"
  component={InstantBuySuccessScreen}
/>

<Stack.Screen
  name="OrderHistory"
  component={OrderHistoryScreen}
/>

<Stack.Screen
  name="PausedDeliveries"
  component={PausedDeliveriesScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen
  name="Address"
  component={AddressScreen}
  options={{ headerShown: false }}
/>

<Stack.Screen
  name="EditSchedule"
  component={EditScheduleScreen}
/>

<Stack.Screen
  name="TrackOrder"
  component={TrackOrderScreen}
/>

      </Stack.Navigator>

    </NavigationContainer>

  );
};

export default AppNavigator;