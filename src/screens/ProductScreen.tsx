import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

import {
  StyleSheet,
  ScrollView,
} from 'react-native';

import FloatingCart
from '../components/FloatingCart';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import ProductsHeader
from '../components/ProductsHeader';

import SearchBar
from '../components/SearchBar';

import ProductsGrid
from '../components/ProductsGrid';

import ProductCategoryTabs
from '../components/ProductsCategoryTabs';

const ProductsScreen = () => {

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('Milk');

const {
  totalItems,
  cartItems,
  lastAddedItem,
} = useCart();

// const latestCartItem =
//   cartItems.length > 0
//     ? cartItems[cartItems.length - 1]
//     : null;




  const [
  lastAddedProduct,
  setLastAddedProduct,
] = useState<any>(null);

 

  return (

  
    <SafeAreaView
      style={styles.container}
    >
          <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
               paddingBottom:120,
        }}
      >
<ProductsHeader
  cartCount={totalItems}
/>

<SearchBar />

<ProductCategoryTabs
  selectedCategory={
    selectedCategory
  }
  onSelectCategory={
    setSelectedCategory
  }
/>

<ProductsGrid
  selectedCategory={
    selectedCategory
  }
  setLastAddedProduct={
    setLastAddedProduct
  }
/>
  </ScrollView>

<FloatingCart
  cartCount={totalItems}
  productImage={
    lastAddedItem?.image
  }
/>

    </SafeAreaView>
  

  );

};

export default ProductsScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
  },

});