import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { bannerData } from '../data/bannerData';

const { width } = Dimensions.get('window');

const BannerSection = () => {

    const flatListRef = useRef<FlatList>(null);

const [currentIndex, setCurrentIndex] =
  useState(0);

  useEffect(() => {

  const interval = setInterval(() => {

    let nextIndex = currentIndex + 1;

    if (nextIndex >= bannerData.length) {

      nextIndex = 0;

      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });

    } else {

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

    }

    setCurrentIndex(nextIndex);

  }, 3000);

  return () => clearInterval(interval);

}, [currentIndex]);

    

  return (

    <View>
<FlatList
  ref={flatListRef}
  data={bannerData}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.id}
  getItemLayout={(_, index) => ({
    length: 260,
    offset: 260 * index,
    index,
  })}
  renderItem={({ item }) => (
    <Image
      source={item.image}
      style={styles.bannerImage}
      resizeMode="contain"
    />
  )}
/>
   

      {/* Dots */}

     

    </View>

  );

};

export default BannerSection;

const styles = StyleSheet.create({

  bannerImage: {
    width: 250,
    height: 250,
    borderRadius: 20,
    marginTop: 20,
    marginLeft:10
  },


});