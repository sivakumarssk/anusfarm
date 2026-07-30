
import {
  FlatList,
  View,
  Text
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ProductsGridCard from './ProductsGridCard';

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

  const [products, setProducts] = useState<any[]>([]);


  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);


  const fetchProducts = async () => {
    try {

      const response = await fetch(
        `http://192.168.0.112:5000/api/products/category/${selectedCategory}`
      );

      const data = await response.json();

          console.log("PRODUCTS DATA:", data);

      if(data.success){
        setProducts(data.products);
      }

    } catch(error){
      console.log(
        "Fetch Products Error:",
        error
      );
    }
  };


  return (
    <View>

      <FlatList

        data={products}

        keyExtractor={(item)=>item.id.toString()}

        numColumns={2}

        scrollEnabled={false}

        renderItem={({item})=>(
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


            