import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';

import {
  useSubscription,
} from '../context/SubscriptionContext';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

const SubscriptionSuccessScreen = () => {
  const {
  subscriptionData,
} = useSubscription();

  const navigation = useNavigation<any>();

  return (

    <SafeAreaView style={styles.container}>

        <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 20,
  }}
>

      <View style={styles.content}>

        <Image
        source={require('../../assets/images/SubscriptionSuccess.png')}
        style={{
          width:400,
          height:120,
        }}
        resizeMode='contain'
        />


        <Text style={styles.successTitle}>
          Subscription Successful!
        </Text>

        <Text style={styles.successSubtitle}>
          Your milk delivery subscription is all set.
        </Text>

        <Text style={styles.successSubtitle}>
          We'll deliver fresh milk as per your schedule.
        </Text>

        <Text style={styles.summaryHeading}>
  Subscription Summary
</Text>

<View style={styles.summaryCard}>

  {/* Delivery Days */}

  <View style={styles.summaryRow}>
    <View style={styles.rowLeft}>
  <View style={styles.summaryIconCircle}>
    <Image
      source={require('../../assets/icons/DeliveryDays.png')}
      style={styles.summaryIcon}
    />
  </View>

  <Text style={styles.rowLabel}>
    Delivery Days
  </Text>
</View>

    <View>
      <Text style={styles.rowValue}>
  {subscriptionData?.frequency}
</Text>

<Text style={styles.rowSubValue}>
  {
    subscriptionData?.selectedDays
      ?.join(', ')
  }
</Text>
    </View>
  </View>

  <View style={styles.divider} />

  {/* Delivery Time */}

  <View style={styles.summaryRow}>
    <View style={styles.rowLeft}>
  <View style={styles.summaryIconCircle}>
    <Image
      source={require('../../assets/icons/DeliveryTime.png')}
      style={styles.summaryIcon}
    />
  </View>

  <Text style={styles.rowLabel}>
    Delivery Time
  </Text>
</View>

    <Text style={styles.rowValue}>

  {
    subscriptionData?.deliveryTime ===
    'Morning'

      ? '06:00AM - 08:00AM'

      : '06:00PM - 08:00PM'
  }

</Text>
  </View>

  <View style={styles.divider} />

  {/* Product */}

  {/* Products */}

<View style={styles.summaryRow}>

  <View style={styles.rowLeft}>
    <View style={styles.summaryIconCircle}>
      <Image
        source={require('../../assets/icons/Product.png')}
        style={styles.summaryIcon}
      />
    </View>

    <Text style={styles.rowLabel}>
      Products
    </Text>
  </View>

  <View style={styles.productsContainer}>

    {
      subscriptionData?.subscriptionItems?.map(
        item => (
          <View
            key={item.id}
            style={styles.productItemRow}
          >
            <Text style={styles.productItemName}>
              {item.name}
            </Text>

            <Text style={styles.productItemQty}>
              Qty {item.quantity}
            </Text>
          </View>
        )
      )
    }

  </View>

</View>

<View style={styles.divider} />

  {/* Payment */}

  <View style={styles.summaryRow}>
    <View style={styles.rowLeft}>
  <View style={styles.summaryIconCircle}>
    <Image
      source={require('../../assets/icons/PaymentMethod.png')}
      style={styles.summaryIcon}
    />
  </View>

  <Text style={styles.rowLabel}>
    Payment Method
  </Text>
</View>

    <View>
      <Text style={styles.rowValue}>
  {subscriptionData?.paymentMethod}
</Text>

      <Text style={styles.rowSubValue}>
  {subscriptionData?.subscriptionStatus}
</Text>
    </View>
  </View>

  <View style={styles.divider} />

  {/* Next Delivery */}

  <View style={styles.summaryRow}>
    <View style={styles.rowLeft}>
  <View style={styles.summaryIconCircle}>
    <Image
      source={require('../../assets/icons/NextDelivery.png')}
      style={styles.summaryIcon}
    />
  </View>

  <Text style={styles.rowLabel}>
    Next Delivery
  </Text>
</View>

    <View>
      <Text style={styles.rowValue}>
        {subscriptionData?.nextDeliveryDate}
      </Text>

      <Text style={styles.rowSubValue}>
        06:00AM - 08:00AM
      </Text>
    </View>
  </View>

</View>

      {
(subscriptionData?.instantItems?.length ?? 0) > 0 && (
    <>
      <Text style={styles.summaryHeading}>
        Instant Buy Summary
      </Text>

      <View style={styles.summaryCard}>

        <View style={styles.summaryRow}>
         <Text style={styles.rowLabel}>
  Subtotal (
  {subscriptionData?.instantItems?.length ?? 0}
  {' '}items)
</Text>

          <Text style={styles.rowValue}>
            ₹{subscriptionData?.instantTotal}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.rowLabel}>
            Delivery
          </Text>

          <Text
            style={[
              styles.rowValue,
              { color: '#0A8A2A' }
            ]}
          >
            Free
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text
            style={[
              styles.rowLabel,
              { fontWeight: '700' }
            ]}
          >
            Total Amount
          </Text>

          <Text
            style={[
              styles.rowValue,
              { fontWeight: '700' }
            ]}
          >
            ₹{subscriptionData?.instantTotal}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.rowLabel}>
            Payment Method
          </Text>

          <Text style={styles.rowValue}>
            {subscriptionData?.paymentMethod}
          </Text>
        </View>

      </View>
    </>
  )
}

      </View>




      <TouchableOpacity
  style={styles.homeButton}
  onPress={() =>
    navigation.navigate("MySubscriptions")
  }
>
  <Text style={styles.homeButtonText}>
    View My Subscription
  </Text>
</TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );
};

export default SubscriptionSuccessScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    justifyContent: 'space-between',
  },

  content: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 24,
  },

  successIcon: {
    fontSize: 80,
  },

  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
  },

  successSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    textAlign: 'center',
  },

  homeButton: {
    height: 52,
    backgroundColor: '#000',
    borderRadius: 10,

    marginTop:30,
    marginHorizontal: 20,
    marginBottom: 30,

    justifyContent: 'center',
    alignItems: 'center',
  },

  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  summaryHeading: {
  fontSize: 18,
  fontWeight: '600',
  color: '#000',

  marginTop: 40,
  marginBottom: 16,

  alignSelf: 'flex-start',
},

summaryCard: {
  width: '100%',

  backgroundColor: '#FFF',

  borderRadius: 20,

  borderWidth: 1,
  borderColor: '#E8E8E8',

  paddingVertical: 8,

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

  paddingHorizontal: 16,
  paddingVertical: 14,
},

divider: {
  height: 1,
  backgroundColor: '#EFEFEF',
},

rowLabel: {
  fontSize: 14,
  fontWeight: '500',
  color: '#000',
},

rowValue: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
  textAlign: 'right',
},

rowSubValue: {
  fontSize: 11,
  color: '#8A8A8A',
  marginTop: 2,
  textAlign: 'right',
},

rowLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},

summaryIconCircle: {
  width: 40,
  height: 40,

  borderRadius: 18,

  backgroundColor: '#eff7f0',

  justifyContent: 'center',
  alignItems: 'center',

  marginRight: 12,
},

summaryIcon: {
  width: 22,
  height: 22,
},

productsContainer: {
  alignItems: 'flex-end',
},

productItemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},

productItemName: {
  fontSize: 13,
  color: '#000',
  marginRight: 8,
},

productItemQty: {
  fontSize: 12,
  fontWeight: '600',
  color: '#0A8A2A',
},

});