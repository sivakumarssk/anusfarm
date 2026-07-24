import React from 'react';

import {
  View,
  TextInput,
  StyleSheet,
  Image
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => {

  return (

    <View style={styles.container}>

     <Image
  source={require('../../assets/icons/search.png')}
  style={styles.searchIcon}
  resizeMode="contain"
/>

      <TextInput
        style={styles.input}
        placeholder="Search for Milk, Chicken,...."
        placeholderTextColor="#777"
      />

    </View>

  );

};

export default SearchBar;

const styles = StyleSheet.create({

  container: {
    height: 50,
    backgroundColor: '#D6E1D5',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#000',
  },
  searchIcon: {
  width: 22,
  height: 22,
},

});