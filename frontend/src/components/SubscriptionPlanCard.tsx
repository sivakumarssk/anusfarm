import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

type Props = {
  plan: any;
};

const SubscriptionPlanCard = ({
  plan,
}: Props) => {

  return (

    <View style={styles.card}>

      <View style={styles.topRow}>

        <View style={styles.leftSection}>

          <View style={styles.iconContainer}>

            <Image
              source={require('../../assets/icons/calendar.png')}
              style={styles.icon}
            />

          </View>

          <View>

            <View style={styles.titleRow}>

              <Text style={styles.title}>
                {plan.title}
              </Text>

              <View style={styles.activeBadge}>

                <Text style={styles.activeText}>
                  {plan.status}
                </Text>

              </View>

            </View>

            <Text style={styles.product}>
              {plan.product}
            </Text>

          </View>

        </View>

        <Text style={styles.price}>
          ₹{plan.amount} / month
        </Text>

      </View>

      <View style={styles.divider} />

     <View style={styles.featureRow}>

  <View style={styles.featureItem}>

    <Image
      source={require('../../assets/icons/DialyDelivery.png')}
      style={styles.featureIcon}
    />

    <Text style={styles.feature}>
      Daily Delivery
    </Text>

  </View>

  <View style={styles.featureItem}>

    <Image
      source={require('../../assets/icons/SkipAnytime.png')}
      style={styles.featureIcon}
    />

    <Text style={styles.feature}>
      Skip Anytime
    </Text>

  </View>

  <View style={styles.featureItem}>

    <Image
      source={require('../../assets/icons/EasyCancellation.png')}
      style={styles.featureIcon}
    />

    <Text style={styles.feature}>
      Easy Cancellation
    </Text>

  </View>

</View>

      <View style={styles.deliveryCard}>

     <View style={styles.deliverySection}>

          <Text style={styles.label}>
            Next Delivery
          </Text>

          <Text style={styles.value}>
            {plan.nextDelivery}
          </Text>

        </View>

        <View style={styles.verticalDivider} />

       <View style={styles.deliverySection}>

          <Text style={styles.label}>
            Valid Till
          </Text>

          <Text style={styles.value}>
            {plan.validTill}
          </Text>

        </View>

      </View>

    </View>

  );

};

export default SubscriptionPlanCard;

const styles = StyleSheet.create({

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 12,
    elevation: 2,
  },

 topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
},

  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },

  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  icon: {
    width: 16,
    height: 16,
    tintColor: '#0A8A2A',
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: '600',
  },

  activeBadge: {
    backgroundColor: '#D8EFD8',
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
  },

  activeText: {
    color: '#0A8A2A',
    fontSize: 10,
    fontWeight:'600',
  },

  product: {
    marginTop: 2,
    color: '#888',
    fontSize: 12,
  },

  price: {
    color: '#0A8A2A',
    fontWeight: '700',
    fontSize: 13,
    marginTop:2,
  },

  divider: {
    height: 1,
    backgroundColor: '#ECECEC',
    marginVertical: 10,
  },

  featureRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal:2,
},

  feature: {
    fontSize: 10,
    color: '#666',
  },

  deliveryCard: {
  backgroundColor: '#DDEADD',
  borderRadius: 12,
  marginTop: 12,
  paddingVertical: 10,
  paddingHorizontal: 12,
  flexDirection: 'row',
  alignItems: 'center',
},

verticalDivider: {
  width: 1,
  height: 32,
  backgroundColor: '#B8CBB8',
  marginHorizontal: 12,
},

  label: {
  color: '#8A8A8A',
  fontSize: 10,
},

 value: {
  marginTop: 2,
  color: '#0A8A2A',
  fontWeight: '700',
  fontSize: 13,
},
  featureItem: {
  flexDirection: 'row',
  alignItems: 'center',
},

featureIcon: {
  width: 16,
  height: 16,
  marginRight: 4,
},

deliverySection: {
  flex: 1,
},



});