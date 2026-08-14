
import {
  FlatList,
  View,
  Text
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ProductsGridCard from './ProductsGridCard';
import { API_URL } from "../config/api";

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

console.log(
"PRODUCT API URL:",
`${API_URL}/api/products/category/${selectedCategory}`
);

const response = await fetch(
`${API_URL}/api/products/category/${selectedCategory}`
);

console.log(
"STATUS:",
response.status
);

const data = await response.json();

console.log(
"PRODUCT RESPONSE:",
data
);


if(data.success){
 setProducts(data.products);
}


}
catch(error){

console.log(
"PRODUCT FETCH ERROR:",
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


            