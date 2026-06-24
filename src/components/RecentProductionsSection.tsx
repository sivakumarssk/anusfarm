import React from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import RecentOrderCard
from './RecentOrderedCard';

import {
  recentProductsData,
} from '../data/recenProductsData';

const RecentProductsSection = () => {
  const navigation = useNavigation<any>();

  return (

    <View
      style={{
        marginTop: 10,
      }}
    >

        <View
  style={{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 10,
  }}
>

  <Text
    style={{
      fontSize: 18,
      fontWeight: '600',
      color: '#000',
    }}
  >
    Recently Ordered
  </Text>

  <TouchableOpacity
    onPress={() => {
      // Later:
       navigation.navigate('OrderHistory')
    }}
  >

 <Ionicons
  name="arrow-forward"
  size={22}
  color="#000"
/>

  </TouchableOpacity>

</View>

      <FlatList
       data={[...recentProductsData]
  .sort(
    (a, b) =>
      new Date(b.orderedAt).getTime() -
      new Date(a.orderedAt).getTime()
  )
  .slice(0, 2)
}
        keyExtractor={(item) => item.id}
        numColumns={2}
        scrollEnabled={false}
        renderItem={({ item }) => (
        <RecentOrderCard
  item={item}
/>
        )}
      />

    </View>

  );

};

export default RecentProductsSection;