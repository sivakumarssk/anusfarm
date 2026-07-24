
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BannerSection from '../components/BannerSection';
import ProductSectionHeader from '../components/ProductSectionHeader';
import ProductCarousel from '../components/ProductCarousel';
import FeatureSection from '../components/FeaturesSection';
import QualityTestingCard from '../components/QualityTestingCard';
import SubscriptionCard from '../components/SubscriptionCard';
import RecentProductsSection
from '../components/RecentProductionsSection';
import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import React, {
  useEffect,
  useState
} from 'react';

import AsyncStorage
from '@react-native-async-storage/async-storage';

import { SafeAreaView } from 'react-native-safe-area-context';

const GuestHomeScreen = () => {
 // const isLoggedIn = true;

 const [isLoggedIn, setIsLoggedIn] =
  useState(false);

  useEffect(() => {

  const getLoginStatus = async () => {

    const status =
      await AsyncStorage.getItem(
        'isLoggedIn'
      );

    setIsLoggedIn(
      status === 'true'
    );

  };

  getLoginStatus();

}, []);

  return (

    <SafeAreaView style={styles.container}>


  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 100,
    }}
  >

      {/* Header */}
      <Header />

      {/* Search Bar */}
      <SearchBar/>

      {/* Banner Section */}
      <BannerSection/>

      {isLoggedIn && (
  <SubscriptionCard />
)}

      <ProductSectionHeader />


      {/* Products Section */}
      <ProductCarousel />

            {isLoggedIn && (
 <RecentProductsSection />
)}

      {/* Quality Section */}
     <FeatureSection />
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

  header: {
    marginTop: 15,
  },

  helloText: {
    fontSize: 14,
    color: '#000',
  },

  locationText: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },

  searchBar: {
    height: 50,
    backgroundColor: '#EAF2EA',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 15,
  },

  searchText: {
    color: '#999',
    fontSize: 13,
  },

  bannerSection: {
    height: 140,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productsSection: {
    height: 120,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qualitySection: {
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

});