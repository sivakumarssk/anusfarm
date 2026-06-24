import React from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

type Props = {
  item: any;
};

const RecentOrderCard = ({
  item,
}: Props) => {

  return (

    <View style={styles.card}>

      <Image
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        numberOfLines={1}
        style={styles.name}
      >
        {item.name}
      </Text>

      <Text style={styles.quantity}>
        {item.quantity}
      </Text>

      <Text style={styles.price}>
        {item.price}
      </Text>

    </View>

  );

};

export default RecentOrderCard;

const styles = StyleSheet.create({

  card: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    margin: 6,

    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  image: {
    width: '100%',
    height: 90,
    alignSelf: 'center',
  },

  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
    marginTop: 6,
  },

  quantity: {
    fontSize: 10,
    color: '#777',
    marginTop: 4,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginTop: 4,
  },

});