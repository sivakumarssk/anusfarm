import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const ProductSectionHeader = () => {

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Explore Products
      </Text>

      <TouchableOpacity>

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

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },

});