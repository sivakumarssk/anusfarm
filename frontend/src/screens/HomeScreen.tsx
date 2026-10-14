import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, ScrollView ,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BannerSection from '../components/BannerSection';
import ProductSectionHeader from '../components/ProductSectionHeader';
import ProductCarousel from '../components/ProductCarousel';
import FeatureSection from '../components/FeaturesSection';
import QualityTestingCard from '../components/QualityTestingCard';
import SubscriptionCard from '../components/SubscriptionCard';
import RecentProductsSection from '../components/RecentProductionsSection';
import {API_URL} from "../config/api";
import { useCart } from '../context/CartContext';

const GuestHomeScreen = ({ route }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState("");
  const [userName, setUserName] = useState("");
const { totalItems } = useCart();
  // Get login status
  useEffect(() => {
    const getLoginStatus = async () => {
      try {
        const status = await AsyncStorage.getItem("isLoggedIn");
        setIsLoggedIn(status === "true");
      } catch (error) {
        console.log("Login Status Error:", error);
      }
    };
    getLoginStatus();
  }, []);
  // Get saved location
  // 2. Add this (replace getSavedLocation with this)

useFocusEffect(
  useCallback(() => {
    let isActive = true;

    const getUserLocation = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          if (isActive) setLocation("");
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // 1. Get this user's previously selected address
        const selectedResponse = await fetch(
          `${API_URL}/api/addresses/selected`,
          { method: "GET", headers }
        );

        const selectedData = await selectedResponse.json();

        if (!isActive) return;

        if (
          selectedResponse.ok &&
          selectedData.success &&
          selectedData.address
        ) {
          setLocation(selectedData.address.full_address || "");
          return;
        }

        // 2. Check this user's saved normal location
        const userId = await AsyncStorage.getItem("userId");

        const savedLocation = userId
          ? await AsyncStorage.getItem(`userLocation_${userId}`)
          : null;

        if (savedLocation) {
          try {
            const parsedLocation = JSON.parse(savedLocation);

            if (isActive) {
              setLocation(parsedLocation.address || "");
            }

            return;
          } catch (error) {
            console.log("SAVED LOCATION PARSE ERROR:", error);
          }
        }
        // 2. If no address was selected, get this user's saved addresses
        const addressResponse = await fetch(
          `${API_URL}/api/addresses`,
          { method: "GET", headers }
        );

        const addressData = await addressResponse.json();

        if (!isActive) return;

        if (
          addressResponse.ok &&
          Array.isArray(addressData.addresses) &&
          addressData.addresses.length > 0
        ) {
          // Use the first address if no selection exists
          setLocation(addressData.addresses[0].full_address || "");
          return;
        }

        // 3. If there are no saved addresses, use the user's location
        const locationResponse = await fetch(
          `${API_URL}/api/location`,
          { method: "GET", headers }
        );

        const locationData = await locationResponse.json();

        if (!isActive) return;

        if (locationResponse.ok && locationData.success) {
          setLocation(
            locationData.location?.address ||
              locationData.location?.full_address ||
              ""
          );
        } else {
          setLocation("");
        }
      } catch (error) {
        console.log("HOME LOCATION ERROR:", error);
        if (isActive) setLocation("");
      }
    };

    getUserLocation();

    return () => {
      isActive = false;
    };
  }, [])
);




useFocusEffect(
  useCallback(() => {
    const getUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${API_URL}/api/users/profile`,{
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.success) {
          setUserName(data.user.name || "");
           // save latest name
          await AsyncStorage.setItem(
            "userName",
            data.user.name || ""
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserProfile();
  }, [])
);
console.log("USERNAME:", userName);
  return (
    // <SafeAreaView style={styles.container}>
    <SafeAreaView style={styles.safeArea}>
      {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}> */}
        <View style={styles.floatingHome}>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollContent}>
  
  <Header
  location={location}
  userName={userName}
  onSelectAddress={(address: string) => setLocation(address)}
/>
        {/* Search */}
        <SearchBar />

        {/* Banner */}
        <BannerSection />

        {/* Subscription */}
        {isLoggedIn && (
          <SubscriptionCard />
        )}

        {/* Product Header */}
        <ProductSectionHeader />

        {/* Products */}
        <ProductCarousel />

        {/* Recent Products */}
        {isLoggedIn && (
          <RecentProductsSection />
        )}

        {/* Features */}
        <FeatureSection />

        {/* Quality */}
        <QualityTestingCard />

      </ScrollView>
      </View>
    </SafeAreaView>
  );

};
export default GuestHomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },

 floatingHome: {
  flex: 1,

  marginTop: 0,
  marginBottom: 14,

  backgroundColor: "#FFF",

  borderRadius: 0,

  overflow: "hidden",

  elevation: 0,

  shadowColor: "transparent",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowOpacity: 0,
  shadowRadius: 0,
},

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
});