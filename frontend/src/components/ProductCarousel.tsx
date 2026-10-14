import React, {useEffect, useRef,useState,} from 'react';
import {View, FlatList, StyleSheet,Dimensions,} from 'react-native';
  import { API_URL } from '../config/api';
import ProductCard from './ProductCard';
const { width } = Dimensions.get('window');
const ProductCarousel = () => {
  const flatListRef = useRef<FlatList>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] =
    useState(0);
  // Get products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`);
      const data = await response.json();
      console.log("PRODUCT RESPONSE:", data);
      setProducts(data.products);
    } catch(error) {
      console.log(
        "Product fetch error:",
        error
      );
    }

  };
  useEffect(() => {
    fetchProducts();
  }, []);
  // Auto slide
  useEffect(() => {
    if(products.length === 0)
      return;
    const interval = setInterval(() => {
      let nextIndex =
        currentIndex + 1;
      if(nextIndex >= products.length){
        nextIndex = 0;
        flatListRef.current?.scrollToOffset({
          offset:0,
          animated:true
        });
      }
      else {
        flatListRef.current?.scrollToIndex({
          index:nextIndex,
          animated:true
        });
      }
      setCurrentIndex(nextIndex);
    },5000);
    return () =>
      clearInterval(interval);
  },[currentIndex, products]);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={products}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item)=>item.id.toString()}
        renderItem={({item})=>(
          <View
            style={styles.cardContainer}>
            <ProductCard
              item={item}/>
          </View>
        )}
        onMomentumScrollEnd={(event)=>{
          const index = Math.round(
            event.nativeEvent.contentOffset.x /
            width
          );
          setCurrentIndex(index);
        }}
      />
      <View
        style={styles.indicatorContainer}>

        {products.map((_,index)=>(
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index &&
              styles.activeDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};
export default ProductCarousel;

const styles = StyleSheet.create({
  // cardContainer:{
  //   width: width - 32,
  // },


  // indicatorContainer:{
  //   flexDirection:'row',
  //   justifyContent:'center',
  //   marginTop:10,
  // },


  // dot:{
  //   width:8,
  //   height:8,
  //   borderRadius:4,
  //   backgroundColor:'#D9D9D9',
  //   marginHorizontal:4,
  // },


  // activeDot:{
  //   width:24,
  //   borderRadius:4,
  //   backgroundColor:'#000',
  // },


  cardContainer: {
  width: width - 32,
  paddingHorizontal: 0,
},

indicatorContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 12,
  marginBottom: 4,
},

dot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: "#D9D9D9",
  marginHorizontal: 3,
},

activeDot: {
  width: 22,
  height: 7,
  borderRadius: 4,
  backgroundColor: "#2E7D32",
},
});