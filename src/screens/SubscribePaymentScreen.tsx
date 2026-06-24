import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image
} from 'react-native';

import {
  useSubscription,
} from '../context/SubscriptionContext';

import { useOrderHistory,} from '../context/OrderHistoryContext';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import { Ionicons }
from '@expo/vector-icons';

const SubscribePaymentScreen = () => {
const minimumWalletAmount = 500;
  const navigation =
    useNavigation<any>();

  const {
  subscriptionData,
  setSubscriptionData,
} = useSubscription();

const { addOrder } =
  useOrderHistory();

  const {
  cartItems,
  clearCart,
} = useCart();

    const [walletError, setWalletError] =
  useState('');

  const [amount, setAmount] =
    useState('');

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState('upi');

  const subscriptionItems =
  cartItems.filter(
    item => item.category === 'Milk'
  );

const instantItems =
  cartItems.filter(
    item => item.category !== 'Milk'
  );

const instantTotal =
  instantItems.reduce(
    (sum, item) =>
      sum +
      item.price *
        item.quantity,
    0
  );

const walletAmount =
  Number(amount || 0);

const totalAmount =
  instantTotal +
  walletAmount;


 const handleSubscribe = () => {

  if (
    subscriptionItems.length > 0 &&
    walletAmount < minimumWalletAmount
  ) {

    setWalletError(
      `Minimum wallet balance required is ₹${minimumWalletAmount}`
    );

    return;
  }

  setWalletError('');

  if (!subscriptionData) {
  return;
}

setSubscriptionData({
  ...subscriptionData,

  paymentMethod:
    paymentMethod === 'upi'
      ? 'UPI AutoPay'
      : 'Debit / Credit Card',

  walletAmount,

  subscriptionStatus: 'Active',

  nextDeliveryDate: 'Tomorrow',
});

addOrder({
  orderId:
    Date.now().toString(),

  orderType:
    'subscription',

  items:
    subscriptionItems,

  totalAmount:
    walletAmount,

  status:
    'scheduled',

  deliveryDate: new Date(
  Date.now() + 24 * 60 * 60 * 1000
).toISOString(),

  paymentMethod:
    paymentMethod === 'upi'
      ? 'UPI AutoPay'
      : 'Card AutoPay',
});

if (
  instantItems.length > 0
) {

  addOrder({
    orderId:
      `${Date.now()}-instant`,

    orderType:
      'instant',

    items:
      instantItems,

    totalAmount:
      instantTotal,

    status:
      'delivered',

    deliveryDate:
      'Today',

    paymentMethod:
      paymentMethod === 'upi'
        ? 'UPI'
        : 'Card',
  });

}


clearCart();

navigation.navigate(
  'SubscriptionSuccess'
);

};

return (
   <SafeAreaView style={styles.container}>
      <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 120,
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
    Subscribe
  </Text>

</View>

<Text style={styles.sectionTitle}>
  Add Money to Wallet
</Text>

<View style={styles.amountInputBox}>

  <Text style={styles.rupee}>
    ₹
  </Text>

  <TextInput
    placeholder="Enter Amount"
    value={amount}
    onChangeText={(text) => {

  setAmount(text);

  if (walletError) {
    setWalletError('');
  }

}}
    keyboardType="numeric"
    style={styles.amountInput}
  />

</View>

{
  walletError ? (
    <Text style={styles.errorText}>
      {walletError}
    </Text>
  ) : null
}

<View style={styles.quickAmountRow}>

  {[500, 1000, 1500].map(
    value => (

      <TouchableOpacity
        key={value}
        style={styles.quickBtn}
        onPress={() =>
          setAmount(
            value.toString()
          )
        }
      >

        <Text>
          + ₹{value}
        </Text>

      </TouchableOpacity>

    )
  )}

</View>

<View style={styles.summaryCard}>

  <Text style={styles.summaryTitle}>
    Order Summary
  </Text>

  <Text style={styles.sectionLabel}>
  Subscription Items
</Text>

{subscriptionItems.map(item => (

  <View
    key={item.id}
    style={styles.productSummaryRow}
  >

    <Text>
      {item.name} x{item.quantity}
    </Text>

    <Text>
      Subscription
    </Text>

  </View>

))}

<View style={styles.dashedLine} />

<Text style={styles.sectionLabel}>
  Instant Buy Items
</Text>

{instantItems.map(item => (

  <View
    key={item.id}
    style={styles.productSummaryRow}
  >

    <Text>
      {item.name} x{item.quantity}
    </Text>

    <Text>
      ₹
      {item.price *
        item.quantity}
    </Text>

  </View>

))}

  <View style={styles.dashedLine} />

 <View style={styles.summaryRow}>

  <Text>
    Wallet Topup
  </Text>

  <Text>
    ₹{walletAmount}
  </Text>

</View>

  <View style={styles.dashedLine} />

 <View style={styles.summaryRow}>

  <Text>
    Instant Buy Total
  </Text>

  <Text>
    ₹{instantTotal}
  </Text>

</View>

  <View style={styles.dashedLine} />

  <View style={styles.summaryRow}>

    <Text
      style={{
        fontWeight: '700',
      }}
    >
      Total Amount
    </Text>

    <Text
      style={{
        fontWeight: '700',
      }}
    >
      ₹{totalAmount}
    </Text>

  </View>

</View>

<Text style={styles.autoPayTitle}>
  Auto Pay Subscription
</Text>

<Text style={styles.autoPaySubTitle}>
  Never run out of wallet balance
</Text>

<View style={styles.paymentCard}>
    <TouchableOpacity
  style={styles.paymentRow}
  onPress={() =>
    setPaymentMethod('upi')
  }
>

  <View style={styles.methodLeft}>

  <View style={styles.paymentIconCircle}>
  <Image
    source={require('../../assets/icons/UPIAutoPay.png')}
    style={styles.paymentIcon}
    resizeMode="contain"
  />
</View>

  <View>

    <Text style={styles.methodTitle}>
      UPI AutoPay
    </Text>

    <Text style={styles.methodSub}>
      Pay automatically via UPI
    </Text>

  </View>

</View>

  <View style={styles.radioOuter}>
    {
      paymentMethod === 'upi' && (
        <View
          style={styles.radioInner}
        />
      )
    }
  </View>

</TouchableOpacity>
<View style={styles.divider} />

<TouchableOpacity
  style={styles.paymentRow}
  onPress={() =>
    setPaymentMethod('card')
  }
>

  <View style={styles.methodLeft}>

 <View style={styles.paymentIconCircle}>
  <Image
    source={require('../../assets/icons/DebitCreditCard.png')}
    style={styles.paymentIcon}
    resizeMode="contain"
  />
</View>

  <View>

    <Text style={styles.methodTitle}>
      Debit / Credit Card
    </Text>

    <Text style={styles.methodSub}>
      Save card & Auto pay
    </Text>

  </View>

</View>

  <View style={styles.radioOuter}>
    {
      paymentMethod === 'card' && (
        <View
          style={styles.radioInner}
        />
      )
    }
  </View>

</TouchableOpacity>


</View>



      <View style={styles.footer}>

  <TouchableOpacity
  style={styles.subscribeButton}
  onPress={handleSubscribe}
>

    <Text style={styles.subscribeText}>
      Subscribe Now
    </Text>

  </TouchableOpacity>

</View>

</ScrollView>
    </SafeAreaView>
  );
    

    

}

export default SubscribePaymentScreen;

const styles = StyleSheet.create({
    container: {
  flex: 1,
  backgroundColor: '#F8F8F8',
},

header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: 12,
},

headerTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#000',
  marginLeft: 12,
},

sectionTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#000',
  marginHorizontal: 16,
  marginTop: 24,
  marginBottom: 10,
},

amountInputBox: {
  flexDirection: 'row',
  alignItems: 'center',

  backgroundColor: '#FFF',

  marginHorizontal: 16,

  borderWidth: 1,
  borderColor: '#E7E7E7',

  borderRadius: 12,

  paddingHorizontal: 16,
  height: 56,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 3,

  elevation: 2,
},

rupee: {
  fontSize: 22,
  fontWeight: '600',
  color: '#000',
},

amountInput: {
  flex: 1,
  marginLeft: 10,
  fontSize: 16,
  color: '#000',
},

quickAmountRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',

  marginHorizontal: 16,
  marginTop: 12,
},

quickBtn: {
  flex: 1,

  height: 46,

  backgroundColor: '#FFF',

  borderWidth: 1,
  borderColor: '#E7E7E7',

  borderRadius: 12,

  justifyContent: 'center',
  alignItems: 'center',

  marginHorizontal: 4,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 3,

  elevation: 2,
},

summaryCard: {
  backgroundColor: '#FFF',

  marginHorizontal: 16,
  marginTop: 20,

  borderRadius: 16,

  borderWidth: 1,
  borderColor: '#E8E8E8',

  padding: 16,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 3,

  elevation: 2,
},

summaryTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#000',

  marginBottom: 14,
},

productSummaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',

  marginBottom: 12,
},

summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

dashedLine: {
  borderStyle: 'dashed',
  borderWidth: 0.5,
  borderColor: '#D5D5D5',

  marginVertical: 12,
},

autoPayTitle: {
  fontSize: 15,
  fontWeight: '600',
  color: '#000',

  marginHorizontal: 16,
  marginTop: 20,
},

autoPaySubTitle: {
  fontSize: 12,
  color: '#777',

  marginHorizontal: 16,
  marginTop: 4,
  marginBottom: 10,
},

paymentCard: {
  backgroundColor: '#FFF',

  marginHorizontal: 16,

  borderRadius: 16,

  borderWidth: 1,
  borderColor: '#E5E5E5',

  overflow: 'hidden',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  elevation: 3,
},

paymentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  paddingHorizontal: 14,
  paddingVertical: 18,
},

divider: {
  height: 1,
  backgroundColor: '#EEEEEE',
},

methodTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
},

methodSub: {
  fontSize: 11,
  color: '#777',
  marginTop: 3,
},

radioOuter: {
  width: 22,
  height: 22,

  borderRadius: 11,

  borderWidth: 1.5,
  borderColor: '#B8B8B8',

  justifyContent: 'center',
  alignItems: 'center',
},

radioInner: {
  width: 10,
  height: 10,

  borderRadius: 5,

  backgroundColor: '#0A8A2A',
},

footer: {
  marginHorizontal: 16,
  marginTop: 26,
  marginBottom: 30,
},
subscribeButton: {
  height: 52,

  backgroundColor: '#0A8A2A',

  borderRadius: 8,

  justifyContent: 'center',
  alignItems: 'center',
  marginBottom:40,
},

subscribeText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '600',
},

methodLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex:1,
},

iconCircle: {
  width: 44,
  height: 44,
  borderRadius: 22,

  backgroundColor: '#FFF',

  borderWidth: 1,
  borderColor: '#E5E5E5',

  justifyContent: 'center',
  alignItems: 'center',

  marginRight: 14,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 3,

  elevation: 2,
},

paymentIconCircle: {
  width: 48,
  height: 48,

  borderRadius: 24,

  backgroundColor: '#FFFFFF',

  borderWidth: 1,
  borderColor: '#E5E5E5',

  justifyContent: 'center',
  alignItems: 'center',

  marginRight: 14,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.08,
  shadowRadius: 2,

  elevation: 2,
},
paymentIcon: {
  width: 26,
  height: 26,
},

sectionLabel: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
  marginBottom: 10,
},

errorText: {
  color: '#E53935',

  fontSize: 12,

  marginTop: 6,
  marginHorizontal: 16,
},

});

