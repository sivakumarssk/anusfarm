import {View,Text,TouchableOpacity,StyleSheet,Image,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TransactionCard from '../components/TransacrtionCard';
import { SafeAreaView,} from 'react-native-safe-area-context';
import SubscriptionPlanCard from '../components/SubscriptionPlanCard';
import {subscriptionPlans,} from '../data/subscriptionPlans';
import { useNavigation,} from '@react-navigation/native';
import {  useState, useCallback  } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
interface Wallet {
  id: number;
  user_id: number;
  balance: string;
  created_at: string;
  updated_at: string;
}

interface Transaction {
  id: number;
  wallet_id: number;
  user_id: number;
    type: "credit" | "debit";
  amount: string;
  description: string;
  created_at: string;
}
const WalletScreen = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
const [transactions, setTransactions] = useState<Transaction[]>([]);
  const navigation = useNavigation<any>();
useFocusEffect(
  useCallback(() => {
    fetchWallet();
    fetchTransactions();
  }, [])
);
const fetchWallet = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${API_URL}/api/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      setWallet(data.wallet);
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchTransactions = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/api/wallet/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setTransactions(data.transactions);
    }
  } catch (error) {
    console.log(error);
  }
};

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

      {/* Header */}

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

        <Text
          style={styles.headerTitle}
        >
          Wallet
        </Text>

        <View
          style={styles.headerIcons}
        >
<TouchableOpacity>
          <Image
            source={require('../../assets/icons/notification.png')}
            style={styles.headerIcon}
          />
          </TouchableOpacity>


          <TouchableOpacity
          onPress={()=>{
            navigation.navigate("Cart")
          }}
          >
          <Image
            source={require('../../assets/icons/cart.png')}
            style={styles.headerIcon}
          />
          </TouchableOpacity>

        </View>

      </View>

      {/* Wallet Card */}

      <View style={styles.balanceCard}>

        <View style={styles.balanceTopRow}>

          <View style={styles.walletRow}>

            <Image
              source={require('../../assets/icons/wallet.png')}
              style={styles.walletIcon}
            />

            <Text style={styles.walletLabel}>
              Wallet
            </Text>

          </View>

          <View>

            <Text style={styles.balanceAmount}>
            ₹ {wallet?.balance || "0.00"}
            </Text>

            <Text style={styles.balanceText}>
              Available Balance
            </Text>

          </View>

        </View>

        {/* Add Money Card */}

        <TouchableOpacity
  style={styles.addMoneyCard}
  onPress={() => navigation.navigate("AddMoney")}
>

          <View
            style={styles.addMoneyLeft}
          >

            <View
              style={
                styles.addMoneyIconContainer
              }
            >

           <Image
              source={require('../../assets/icons/AddMoney.png')}
              style={styles.walletIcon}
            />

            </View>

            <View>

              <Text
                style={styles.addMoneyTitle}
              >
                Add Money
              </Text>

              <Text
                style={
                  styles.addMoneySubtitle
                }
              >
                Recharge your wallet now!
              </Text>

            </View>

          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#16A34A"
          />

        </TouchableOpacity>

      </View>

      <View style={styles.sectionHeader}>

  <Text style={styles.sectionTitle}>
    Transaction History
  </Text>

  <TouchableOpacity
  onPress={() =>
    navigation.navigate(
      'TransactionHistory'
    )
  }
>

    <Text style={styles.viewAll}>
      View All
    </Text>

  </TouchableOpacity>

</View>

<View style={styles.transactionContainer}>

  {transactions.length === 0 ? (
   <View
  style={{
    paddingVertical: 30,
    alignItems: "center",
  }}
>
  <Ionicons
    name="wallet-outline"
    size={40}
    color="#999"
  />
  <Text
    style={{
      marginTop: 10,
      color: "#777",
    }}
  >
    No Transactions Yet
  </Text>
</View>
  ) : (
   transactions.slice() .reverse().slice(0, 3).map(item => (
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


<View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>
    Subscription Plans
  </Text>
  
<TouchableOpacity
  onPress={() => navigation.navigate("SubscriptionPlans")}
>
  <Text style={styles.viewAll}>
    View Plans
  </Text>
</TouchableOpacity>
</View>
 



<View
  style={{
    marginHorizontal: 16,
    marginTop: 10,
  }}
>

  {subscriptionPlans.map(plan => (

    <SubscriptionPlanCard
      key={plan.id}
      plan={plan}
    />

  ))}

</View>

</ScrollView>

    </SafeAreaView>

  );

};

export default WalletScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },

  headerIcons: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerIcon: {
    width: 20,
    height: 20,
    marginLeft: 16,
  },

  balanceCard: {
    backgroundColor: '#DDEADD',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 14,
  },

  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },

  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  walletIcon: {
    width: 20,
    height: 20,
    tintColor: '#24612D',
  },

  walletLabel: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  balanceAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    textAlign: 'right',
  },

  balanceText: {
    fontSize: 11,
    color: '#777',
    textAlign: 'right',
    marginTop: 2,
  },

  addMoneyCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addMoneyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  addMoneyIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    //backgroundColor: '#E8F5E9',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  addMoneyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  addMoneySubtitle: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  sectionHeader: {
  marginHorizontal: 16,
  marginTop: 22,

  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#000',
},

viewAll: {
  color: '#16A34A',
  fontSize: 16,
  fontWeight: '400',
  textDecorationLine:'underline'
},

transactionContainer: {
  backgroundColor: '#FFF',
  marginHorizontal: 16,
  marginTop: 10,
  borderRadius: 18,
  paddingHorizontal: 14,
},

});