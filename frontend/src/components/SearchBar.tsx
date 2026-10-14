


import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../config/api";

const SearchBar = () => {
  const navigation = useNavigation<any>();

  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get actual products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();

        if (response.ok && data.success) {
          setProducts(data.products || []);
        } else {
          console.log("Products API error:", data);
        }
      } catch (error) {
        console.log("Search products error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products as the user types
  const filteredProducts = searchText.trim()
    ? products.filter((product) =>
        String(product.name || "")
          .toLowerCase()
          .includes(searchText.trim().toLowerCase())
      )
    : [];

  const openProductDetails = (product: any) => {
    setSearchText("");

    navigation.navigate("ProductDetails", {
      product,
    });
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/icons/search.png")}
          style={styles.searchIcon}
          resizeMode="contain"
        />

        <TextInput
          style={styles.input}
          placeholder="Search for Milk, Chicken,...."
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
        />

        {loading && (
          <ActivityIndicator size="small" color="#2E7D32" />
        )}
      </View>

      {searchText.trim().length > 0 && (
        <View style={styles.resultsContainer}>
          {filteredProducts.length > 0 ? (
           
<View style={styles.resultsList}>
  {filteredProducts.slice(0, 10).map((item, index) => (
    <TouchableOpacity
      key={String(item.id ?? index)}
      style={styles.productRow}
      activeOpacity={0.7}
      onPress={() => openProductDetails(item)}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="contain"
        />
      ) : (
        <View
          style={[
            styles.productImage,
            styles.imagePlaceholder,
          ]}
        />
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text style={styles.productPrice}>
          ₹{Number(item.price || 0).toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
</View>


          ) : (
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No products found
                </Text>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 19,
    zIndex: 10,
    position: "relative",
  },

  container: {
  height: 50,
  backgroundColor: "#FFF",
  borderRadius: 16,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  borderWidth: 1,
  borderColor: "#000",
  marginHorizontal: 2,
},

  input: {
    flex: 1,
    marginLeft: 12,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#000",
  },

  searchIcon: {
    width: 22,
    height: 22,
  },

  resultsContainer: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    // borderColor:"#000",
    overflow: "hidden",
    elevation: 5,
    maxHeight: 280,
  },

  resultsList: {
    maxHeight: 280,
  },

  productRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F7F7F7",
  },

  imagePlaceholder: {
    backgroundColor: "#F0F0F0",
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#000",
  },

  productPrice: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#2E7D32",
    marginTop: 4,
  },

  emptyContainer: {
    padding: 16,
    alignItems: "center",
  },

  emptyText: {
    fontFamily: "Inter-Regular",
    fontSize: 13,
    color: "#777",
  },
});

