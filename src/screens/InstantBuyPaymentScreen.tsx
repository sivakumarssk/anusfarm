import React, {useState} from 'react';
import { useCart } from '../context/CartContext';
import {useOrderHistory,} from '../context/OrderHistoryContext';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import { Ionicons }
from '@expo/vector-icons';

const InstantBuyPaymentScreen = () => {
const [
  paymentMethod,
  setPaymentMethod,
] = useState('upi');


  const navigation =
    useNavigation<any>();

    const { addOrder } =
  useOrderHistory();

  const {
  cartItems,
  clearCart,
} = useCart();

  const subtotal =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  const deliveryCharge = 0;

  const totalAmount =
    subtotal + deliveryCharge;


    const paymentOptions = [

  {
    id: 'upi',
    title: 'UPI AutoPay',
    subtitle:
      'Pay automatically via UPI',
    icon: require('../../assets/icons/UPIAutoPay.png'),
  },

  {
    id: 'card',
    title: 'Debit / Credit Card',
    subtitle:
      'Save card & Auto pay',
    icon: require('../../assets/icons/DebitCreditCard.png'),
  },

  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle:
      'All major banks',
    icon: require('../../assets/icons/NetBanking.png'),
  },

  {
    id: 'wallet',
    title: 'Wallets',
    subtitle:
      'Paytm, PhonePe, Amazon Pay',
    icon: require('../../assets/icons/wallet.png'),
  },

  {
    id: 'cod',
    title: 'Cash on Delivery',
    subtitle:
      'Pay when your order is delivered',
    icon: require('../../assets/icons/CashOnDelivery.png'),
  },

];


const handlePayNow = () => {

  addOrder({
    orderId:
      Date.now().toString(),

    orderType:
      'instant',

    items:
      cartItems,

    totalAmount:
      totalAmount,

    status:
      'delivered',

    deliveryDate: new Date().toISOString(),

    paymentMethod:
      paymentMethod,
  });

  clearCart();

  navigation.navigate(
    'InstantBuySuccess'
  );

};

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={false}
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
            Instant Buy
          </Text>

        </View>

        {/* Order Summary */}

        <Text
          style={styles.sectionTitle}
        >
          Order Summary
        </Text>

        <View style={styles.summaryCard}>

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Subtotal (
              {cartItems.length}
              {' '}items)
            </Text>

            <Text style={styles.value}>
              ₹{subtotal}
            </Text>

          </View>

          <View
            style={styles.dashedLine}
          />

          <View style={styles.summaryRow}>

            <Text style={styles.label}>
              Delivery
            </Text>

            <Text
              style={styles.freeText}
            >
              Free
            </Text>

          </View>

          <View
            style={styles.dashedLine}
          />

          <View style={styles.summaryRow}>

            <Text
              style={styles.totalLabel}
            >
              Total Amount
            </Text>

            <Text
              style={styles.totalValue}
            >
              ₹{totalAmount}
            </Text>

          </View>

        </View>

        <Text style={styles.paymentTitle}>
  Choose Payment Method
</Text>

<View style={styles.paymentCard}>

  {paymentOptions.map(
    (option, index) => (

      <View key={option.id}>

        <TouchableOpacity
          style={styles.paymentRow}
          onPress={() =>
            setPaymentMethod(
              option.id
            )
          }
        >

          <View style={styles.methodLeft}>

            <View
              style={
                styles.paymentIconCircle
              }
            >

              <Image
                source={option.icon}
                style={
                  styles.paymentIcon
                }
                resizeMode="contain"
              />

            </View>

            <View>

              <Text
                style={
                  styles.methodTitle
                }
              >
                {option.title}
              </Text>

              <Text
                style={
                  styles.methodSub
                }
              >
                {option.subtitle}
              </Text>

            </View>

          </View>

          <View
            style={
              styles.radioOuter
            }
          >

            {
              paymentMethod ===
                option.id && (
                <View
                  style={
                    styles.radioInner
                  }
                />
              )
            }

          </View>

        </TouchableOpacity>

        {
          index !==
            paymentOptions.length - 1 && (
            <View
              style={
                styles.divider
              }
            />
          )
        }

      </View>

    )
  )}

</View>


<TouchableOpacity
  style={styles.payButton}
  onPress={handlePayNow}
>
  <Text style={styles.payText}>
    Pay Now
  </Text>
</TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );
};

export default InstantBuyPaymentScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,
    paddingTop: 20,
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
    marginBottom: 12,
  },

  summaryCard: {
    backgroundColor: '#FFF',

    marginHorizontal: 16,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: '#E8E8E8',

    padding: 14,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,

    elevation: 2,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    fontSize: 14,
    color: '#555',
  },

  value: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },

  freeText: {
    fontSize: 14,
    color: '#0A8A2A',
    fontWeight: '500',
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },

  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },

  dashedLine: {
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: '#D6D6D6',

    marginVertical: 12,
  },


  paymentTitle: {
  fontSize: 15,
  fontWeight: '600',

  color: '#000',

  marginHorizontal: 16,
  marginTop: 20,
  marginBottom: 12,
},

paymentCard: {
  backgroundColor: '#FFF',

  marginHorizontal: 16,

  borderRadius: 16,

  borderWidth: 1,
  borderColor: '#E8E8E8',

  overflow: 'hidden',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 3,

  elevation: 2,
},

paymentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  paddingHorizontal: 14,
  paddingVertical: 16,
},

methodLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

paymentIconCircle: {
  width: 48,
  height: 48,

  borderRadius: 24,

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
  shadowRadius: 2,

  elevation: 2,
},

paymentIcon: {
  width: 24,
  height: 24,
},

methodTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
},

methodSub: {
  fontSize: 11,
  color: '#777',
  marginTop: 2,
},

radioOuter: {
  width: 20,
  height: 20,

  borderRadius: 10,

  borderWidth: 1.5,
  borderColor: '#B5B5B5',

  justifyContent: 'center',
  alignItems: 'center',
},

radioInner: {
  width: 8,
  height: 8,

  borderRadius: 4,

  backgroundColor: '#0A8A2A',
},

divider: {
  height: 1,
  backgroundColor: '#EEEEEE',
},

payButton: {
  height: 52,

  backgroundColor: '#008015',

  borderRadius: 8,

  justifyContent: 'center',
  alignItems: 'center',

  marginHorizontal: 16,
  marginTop: 50,
  marginBottom: 30,
},

payText: {
  color: '#FFF',
  fontSize: 16,
  fontWeight: '600',
},

});