import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,} from 'react-native';
import {SafeAreaView,} from 'react-native-safe-area-context';
import {useNavigation,} from '@react-navigation/native';
import { Ionicons }from '@expo/vector-icons';
import TransactionCard from '../components/TransacrtionCard';
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
import { useFocusEffect } from "@react-navigation/native";

// interface Transaction {
//   id: number;
//   wallet_id: number;
//   user_id: number;
//   type: "credit" | "debit";
//   amount: string;
//   description: string;
//   created_at: string;
// }
interface Transaction {
  id: number | string;
  type: 'credit' | 'debit' | 'subscription';
  amount: string;
  description: string;
  created_at: string;
}
const TransactionHistoryScreen = () => {
const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigation = useNavigation<any>();
// const fetchTransactions = async () => {
//   try {
//     const token = await AsyncStorage.getItem("token");

//     const response = await fetch(
//       `${API_URL}/api/wallet/transactions`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     const data = await response.json();
//     console.log("TRANSACTIONS:", data);

//     if (data.success) {
//   setTransactions(data.transactions);
// } else {
//   setTransactions([]);
// }
//   } catch (error) {
//     console.log(error);
//   }
// };

      const fetchTransactions = async () => {

  try {

    const token = await AsyncStorage.getItem("token");


    const headers = {
      Authorization: `Bearer ${token}`,
    };


    // Wallet transactions
    const walletResponse = await fetch(
      `${API_URL}/api/wallet/transactions`,
      {
        headers,
      }
    );


    const walletData = await walletResponse.json();


    // Subscription transactions
    const subscriptionResponse = await fetch(
      `${API_URL}/api/subscription-transactions/my`,
      {
        headers,
      }
    );


    const subscriptionData = await subscriptionResponse.json();



    console.log("WALLET DATA:", walletData);

    console.log(
      "SUBSCRIPTION DATA:",
      subscriptionData
    );



    let allTransactions: Transaction[] = [];



    // Add wallet transactions

    if(walletData.success){

      allTransactions.push(

        ...walletData.transactions.map((item:any)=>({

          id:item.id,

          type:item.type,

          amount:item.amount,

          description:item.description,

          created_at:item.created_at

        }))

      );

    }




    // Add subscription transactions

    if(subscriptionData.success){

      allTransactions.push(

        ...subscriptionData.transactions.map((item:any)=>({

          id:`sub-${item.id}`,

          type:"subscription",

          amount:item.amount,

          description:
          item.description ||
          item.plan + " Payment",

          created_at:item.created_at

        }))

      );

    }




    // Latest transaction first

    allTransactions.sort(
      (a,b)=>
      new Date(b.created_at).getTime()
      -
      new Date(a.created_at).getTime()
    );



    setTransactions(allTransactions);



  }
  catch(error){

    console.log(
      "TRANSACTION ERROR:",
      error
    );

  }

};

useFocusEffect(
  useCallback(() => {
    fetchTransactions();
  }, [])
);
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

          {/* {walletTransactions.map(
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
          )} */}
          {transactions.length === 0 ? (
 <View
  style={{
    paddingVertical: 40,
    alignItems: "center",
  }}
>
  <Ionicons
    name="wallet-outline"
    size={50}
    color="#999"
  />

  <Text
    style={{
      marginTop: 10,
      color: "#777",
      fontSize: 16,
    }}
  >
    No Transactions Yet
  </Text>
</View>
) : (
  transactions.slice().reverse().map(item => (
    <TransactionCard
      key={item.id}
      type={item.type}
      title={item.description}
      subtitle={item.type}
      amount={item.amount}
      date={new Date(item.created_at).toLocaleDateString()}
    />
  ))
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