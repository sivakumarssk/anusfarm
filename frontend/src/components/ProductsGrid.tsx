import React from 'react';
//import { useCart } from '../context/CartContext';

import {
  FlatList,
  View,
} from 'react-native';

import ProductsGridCard
from './ProductsGridCard';

import {
  recentProductsData,
} from '../data/recenProductsData';

type Props = {
  selectedCategory: string;

  setLastAddedProduct: React.Dispatch<
    React.SetStateAction<any>
  >;
};



const ProductsGrid = ({
  selectedCategory,
  setLastAddedProduct,
}: Props) => {

  const filteredProducts =
    recentProductsData.filter(
      product =>
        product.category ===
        selectedCategory
    );

    //const { cartItems } = useCart();

  return (

    <View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => (

<ProductsGridCard
  item={item}
  setLastAddedProduct={
    setLastAddedProduct
  }
/>

        )}
      />

    </View>

  );

};

export default ProductsGrid;