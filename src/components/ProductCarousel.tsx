import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';

import ProductCard from './ProductCard';
import { productData } from '../data/productData';

const { width } = Dimensions.get('window');

const ProductCarousel = () => {

  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  useEffect(() => {

    const interval = setInterval(() => {

      let nextIndex =
        currentIndex + 1;

      if (
        nextIndex >=
        productData.length
      ) {

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

    }, 5000);

    return () =>
      clearInterval(interval);

  }, [currentIndex]);

  return (

    <View>

      <FlatList
        ref={flatListRef}
        data={productData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View
            style={styles.cardContainer}
          >

            <ProductCard
              item={item}
            />

          </View>

        )}
        onMomentumScrollEnd={(
          event
        ) => {

          const index =
            Math.round(
              event.nativeEvent
                .contentOffset.x /
                width
            );

          setCurrentIndex(index);

        }}
      />

      {/* Indicators */}

      <View
        style={styles.indicatorContainer}
      >

        {productData.map(
          (_, index) => (

            <View
              key={index}
              style={[
                styles.dot,

                currentIndex ===
                  index &&
                  styles.activeDot,
              ]}
            />

          )
        )}

      </View>

    </View>

  );

};

export default ProductCarousel;

const styles =
  StyleSheet.create({

    cardContainer: {
      width: width - 32,
    },

    indicatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },

    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#D9D9D9',
      marginHorizontal: 4,
    },

    activeDot: {
      width: 24,
      borderRadius: 4,
      backgroundColor: '#000',
    },

});