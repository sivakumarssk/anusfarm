import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, ScrollView } from 'react-native';
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

const GuestHomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState("");
  const [userName, setUserName] = useState("");

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
useEffect(() => {
  const getUserLocation = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await fetch(
         "http://192.168.0.112:5000/api/location",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setLocation(data.location.address);
      }
    } catch (error) {
      console.log(error);
    }
  };
  getUserLocation();
}, []);

useFocusEffect(
  useCallback(() => {
    const getUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://192.168.0.112:5000/api/users/profile",{
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        console.log("HOME PROFILE:", data);
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
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}>
        {/* Header */}
       <Header 
  location={location}
  userName={userName}/>
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

    </SafeAreaView>
  );

};
export default GuestHomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
  },

});