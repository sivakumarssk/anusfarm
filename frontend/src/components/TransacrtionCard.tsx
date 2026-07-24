import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';

type Props = {
  type: 'credit' | 'debit';
  title: string;
  subtitle: string;
  amount: string;
  date: string;
};

const TransactionCard = ({
  type,
  title,
  subtitle,
  amount,
  date,
}: Props) => {

  const isCredit =
    type === 'credit';

  return (

    <View style={styles.container}>

      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              isCredit
                ? '#E8F5E9'
                : '#FDECEC',
          },
        ]}
      >

        <Image
  source={
    isCredit
      ? require('../../assets/icons/wallet.png')
      : require('../../assets/icons/cart.png')
  }
  style={{
    width: 20,
    height: 20,
    tintColor: isCredit
      ? '#16A34A'
      : '#D32F2F',
  }}
/>

        

      </View>

      <View style={styles.info}>

        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          {subtitle}
        </Text>

      </View>

      <View>

        <Text
          style={[
            styles.amount,
            {
              color: isCredit
                ? '#16A34A'
                : '#000',
            },
          ]}
        >
          {isCredit ? '+' : '-'}
          ₹{amount}
        </Text>

        <Text style={styles.date}>
          {date}
        </Text>

      </View>

    </View>

  );

};

export default TransactionCard;

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,

    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  subtitle: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },

  amount: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },

  date: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },

});