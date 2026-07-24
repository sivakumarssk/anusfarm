import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import { Ionicons }
from '@expo/vector-icons';

import TransactionCard
from '../components/TransacrtionCard';

import {
  walletTransactions,
} from '../data/walletTransactions';

const TransactionHistoryScreen = () => {

  const navigation =
    useNavigation<any>();

  return (

    <SafeAreaView
      style={styles.container}
    >

          <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 30,
    }}
  >

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#000"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Transaction History
        </Text>

      </View>

      

        <View
          style={styles.cardContainer}
        >

          {walletTransactions.map(
            item => (

              <TransactionCard
                key={item.id}
                type={item.type}
                title={item.title}
                subtitle={item.subtitle}
                amount={item.amount}
                date={item.date}
              />

            )
          )}

        </View>

      </ScrollView>

    </SafeAreaView>

  );

};

export default TransactionHistoryScreen;

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#F8F8F8',
    },

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 20,
      marginBottom: 18,
    },

    headerTitle: {
      fontSize: 22,
      fontWeight: '600',
      color: '#000',
      marginLeft: 12,
    },

    cardContainer: {
      backgroundColor: '#FFF',
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 18,
      paddingHorizontal: 14,

      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 6,

      elevation: 3,
    },

  });