import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import TransactionCard
from '../components/TransacrtionCard';

import {
  walletTransactions,
} from '../data/walletTransactions';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import SubscriptionPlanCard
from '../components/SubscriptionPlanCard';

import {
  subscriptionPlans,
} from '../data/subscriptionPlans';

import {
  useNavigation,
} from '@react-navigation/native';

const WalletScreen = () => {

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
              ₹ 0.00
            </Text>

            <Text style={styles.balanceText}>
              Available Balance
            </Text>

          </View>

        </View>

        {/* Add Money Card */}

        <TouchableOpacity
          style={styles.addMoneyCard}
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

 {walletTransactions.map(item => (
  <TransactionCard
    key={item.id}
    type={item.type}
    title={item.title}
    subtitle={item.subtitle}
    amount={item.amount}
    date={item.date}
  />
))}

  

</View>

<View style={styles.sectionHeader}>

  <Text style={styles.sectionTitle}>
    Subscription Plans
  </Text>

  <TouchableOpacity>

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