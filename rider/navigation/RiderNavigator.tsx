
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import RiderLoginScreen from "../screens/RiderLoginScreen";
import RiderHomeScreen from "../screens/RiderHomeScreen";
import RiderOrdersScreen from "../screens/RiderOrdersScreen";
import RiderSubscriptionDeliveriesScreen from "../screens/RiderSubscriptionDeliveriesScreen";
import RiderSubscriptionDeliveryDetailsScreen
  from "../screens/RiderSubscriptionDeliveryDetailsScreen";
  import RiderOrderDetailsScreen from "../screens/RiderOrderDetails";
const Stack = createNativeStackNavigator();

const RiderNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RiderLogin"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="RiderLogin"
          component={RiderLoginScreen}
        />

      <Stack.Screen
          name="RiderHome"
          component={RiderHomeScreen}
        />

        <Stack.Screen
  name="RiderOrders"
  component={RiderOrdersScreen}
/>
<Stack.Screen
  name="RiderOrderDetails"
  component={RiderOrderDetailsScreen}
/>

<Stack.Screen
  name="RiderSubscriptionDeliveries"
  component={RiderSubscriptionDeliveriesScreen}
/>
<Stack.Screen
  name="RiderSubscriptionDeliveryDetails"
  component={
    RiderSubscriptionDeliveryDetailsScreen
  }
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RiderNavigator;
