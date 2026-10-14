

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProductSectionHeader = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Explore Products
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => navigation.navigate('Products')}
      >
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProductSectionHeader;

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 18,
//     marginBottom: 12,
//   },

//   title: {
//     fontSize: 15,
//     fontFamily: 'Inter-Medium',
//     color: '#000',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    marginBottom: 14,
    paddingHorizontal: 2,
  },

  title: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#111",
  },
});