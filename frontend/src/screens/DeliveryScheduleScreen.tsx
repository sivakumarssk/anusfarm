import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import { useSubscription,} from '../context/SubscriptionContext';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import { Ionicons }
from '@expo/vector-icons';

const DeliveryScheduleScreen = () => {
  const {
  setSubscriptionData,
} = useSubscription();

  const navigation =
    useNavigation<any>();

  const {
    cartItems,
  } = useCart();

  const [
    selectedFrequency,
    setSelectedFrequency,
  ] = useState('Every Day');

  const [
    selectedTime,
    setSelectedTime,
  ] = useState('Morning');

  const [selectedDays, setSelectedDays] =
  useState<string[]>([]);

  const subscriptionItems =
    cartItems.filter(
      item => item.category === 'Milk'
    );

  const instantItems =
    cartItems.filter(
      item => item.category !== 'Milk'
    );

  const frequencyOptions = [
    {
      title: 'Every Day',
      subtitle:
        'Get milk delivery every day',
      image: require('../../assets/icons/EveryDay.png')
    },
    {
      title: 'Weekdays',
      subtitle:
        'Monday to Friday',
         image: require('../../assets/icons/WeekDays.png'),
    },
    {
      title: 'Alternative Days',
      subtitle:
        'Day-by-day delivery',
         image: require('../../assets/icons/AlternativeDays.png'),
    },
    {
      title: 'Custom Days',
      subtitle:
        'Select your preferred days',
         image: require('../../assets/icons/CustomDays.png'),
    },
  ];

  const days = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
];


const toggleDay = (day: string) => {

  if (selectedDays.includes(day)) {

    setSelectedDays(
      selectedDays.filter(
        item => item !== day
      )
    );

  } else {

    setSelectedDays([
      ...selectedDays,
      day,
    ]);

  }

};

const handleContinue = () => {

 setSubscriptionData({
  frequency: selectedFrequency,

  selectedDays,

  deliveryTime: selectedTime,

  subscriptionItems,

  instantItems,

  instantTotal: instantItems.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  ),

  paymentMethod: '',

  walletAmount: 0,

  subscriptionStatus: 'ACTIVE',

  nextDeliveryDate: '',
});

  navigation.navigate(
    'SubscribePayment'
  );

};

  return (

    <SafeAreaView
      style={styles.container}
    >

       <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 100,
       paddingTop: 8,
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
            Delivery Schedule
          </Text>

        </View>

        <Text
          style={styles.sectionTitle}
        >
          Choose how many days you
          want milk delivery
        </Text>

        <View
          style={styles.optionsCard}
        >

          {frequencyOptions.map(
  (option, index) => (

            <View key={option.title}>

<TouchableOpacity
  style={[
    styles.optionRow,
    index === frequencyOptions.length - 1 && {
      borderBottomWidth: 0,
    },
  ]}
  onPress={() =>
    setSelectedFrequency(
      option.title
    )
  }
>

                <View
                  style={
                    styles.leftContent
                  }
                >

                  <View
                    style={
                      styles.iconCircle
                    }
                  >
                   <Image
                   source={option.image}
                   style={{
                    width:20,
                    height:20,
                    }}
                    resizeMode="contain"
                   />
                  </View>

                  <View>

                    <Text
                      style={
                        styles.optionTitle
                      }
                    >
                      {option.title}
                    </Text>

                    <Text
                      style={
                        styles.optionSubtitle
                      }
                    >
                      {option.subtitle}
                    </Text>

                  </View>

                </View>

    <View style={styles.radioOuter}>
  {
    selectedFrequency === option.title && (
      <View style={styles.radioInner} />
    )
  }
</View>
</TouchableOpacity>



           

              {
  selectedFrequency === 'Custom Days' &&
  option.title === 'Custom Days' && (

    <View style={styles.daysContainer}>

      <Text style={styles.daysTitle}>
        Select Days
      </Text>

      <View style={styles.daysRow}>

        {days.map(day => (

          <TouchableOpacity
            key={day}
            style={[
              styles.dayChip,

              selectedDays.includes(day) &&
                styles.selectedDayChip,
            ]}
            onPress={() =>
              toggleDay(day)
            }
          >

            <Text
              style={[
                styles.dayText,

                selectedDays.includes(day) &&
                  styles.selectedDayText,
              ]}
            >
              {day}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

    </View>

  )
}

   </View>

            )
          )}

        </View>

        {/* Delivery Time */}

        <Text
          style={styles.timeTitle}
        >
          Choose delivery time
        </Text>

        <View
          style={styles.timeRow}
        >

          <TouchableOpacity
            style={[
              styles.timeCard,

              selectedTime ===
                'Morning' &&
                styles.selectedTimeCard,
            ]}
            onPress={() =>
              setSelectedTime(
                'Morning'
              )
            }
          >

            <Text
              style={styles.timeText}
            >
              Morning
            </Text>

            <Text
              style={
                styles.timeSubText
              }
            >
              06:00AM - 08:00AM
            </Text>

          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeCard,

              selectedTime ===
                'Evening' &&
                styles.selectedTimeCard,
            ]}
            onPress={() =>
              setSelectedTime(
                'Evening'
              )
            }
          >

            <Text
              style={styles.timeText}
            >
              Evening
            </Text>

            <Text
              style={
                styles.timeSubText
              }
            >
              06:00PM - 08:00PM
            </Text>

          </TouchableOpacity>

        </View>

        {/* Subscription Items */}

        <Text
          style={styles.listTitle}
        >
          Subscription Items
        </Text>

        <View style={styles.listCard}>

         {subscriptionItems.map(item => (

  <View
    key={item.id}
    style={styles.productRow}
  >

    <View style={styles.productLeft}>

      <Image
        source={item.image}
        style={styles.productImage}
      />

      <View>

        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text style={styles.productCategory}>
          {item.category}
        </Text>

      </View>

    </View>

    <View style={styles.productRight}>

      <Text style={styles.productQty}>
        Qty {item.quantity}
      </Text>

      <Text style={styles.productPrice}>
        ₹{item.price}
      </Text>

    </View>

  </View>

))}

        </View>

        {/* One Time Items */}

        {
          instantItems.length > 0 && (

            <>
              <Text
                style={
                  styles.listTitle
                }
              >
                One-Time Purchase
                Items
              </Text>

              <View
                style={
                  styles.listCard
                }
              >

               {instantItems.map(item => (

  <View
    key={item.id}
    style={styles.productRow}
  >

    <View style={styles.productLeft}>

      <Image
        source={item.image}
        style={styles.productImage}
      />

      <View>

        <Text style={styles.productName}>
          {item.name}
        </Text>

        <Text style={styles.productCategory}>
          {item.category}
        </Text>

      </View>

    </View>

    <View style={styles.productRight}>

      <Text style={styles.productQty}>
        Qty {item.quantity}
      </Text>

      <Text style={styles.productPrice}>
        ₹{item.price}
      </Text>

    </View>

  </View>

))}

              </View>
            </>
          )
        }

         

        <View style={styles.footer}>

    <TouchableOpacity
      style={styles.continueButton}
      onPress={handleContinue}
    >
      <Text style={styles.continueText}>
        Continue
      </Text>
    </TouchableOpacity>

  </View>

     </ScrollView>

    </SafeAreaView>

  );

};

export default DeliveryScheduleScreen;

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
  fontSize: 18,
  fontWeight: '600',
  color: '#000',
  marginLeft: 12,
},

  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 24,
    fontSize: 14,
    color: '#333',
    fontWeight:600,
  },

optionsCard: {
  backgroundColor: '#FFF',
  marginHorizontal: 12,
  marginTop: 10,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#D9D9D9',
  overflow: 'hidden',
   shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.08,
  shadowRadius: 4,

  elevation: 2,
},
optionRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  paddingHorizontal: 12,
  paddingVertical: 16,

  borderBottomWidth: 1,
  borderBottomColor: '#E2E2E2',
},

  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#c2c1c1',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
  shadowColor: '#000',
shadowOffset: {
  width: 0,
  height: 1,
},
shadowOpacity: 0.08,
shadowRadius: 2,

elevation: 2,
},

 optionTitle: {
  fontSize: 15,
  fontWeight: '500',
  color: '#000',
},

 optionSubtitle: {
  fontSize: 10,
  color: '#8A8A8A',
  marginTop: 2,
},

//   radioOuter: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 1,
//     borderColor: '#CCC',
//   },

  radioSelected: {
    backgroundColor: '#0A8A2A',
    borderColor: '#0A8A2A',
  },

  timeTitle: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },

  timeCard: {
  width: '48%',
  height: 56,
  backgroundColor: '#FFF',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#DADADA',
  justifyContent: 'center',
  alignItems: 'center',
},

  selectedTimeCard: {
  borderWidth: 1,
  borderColor: '#0A8A2A',
  backgroundColor: '#F4FFF4',
},

timeText: {
  fontSize: 11,
  fontWeight: '500',
},

timeSubText: {
  fontSize: 8,
  color: '#777',
  marginTop: 1,
},

  listTitle: {
    marginHorizontal: 12,
    marginTop: 24,
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
  },

 listCard: {
  backgroundColor: '#FFF',
  marginHorizontal: 12,
  borderRadius: 16,
  paddingHorizontal: 14,
  paddingVertical: 8,

  borderWidth: 1,
  borderColor: '#E8E8E8',

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 1,
  },
  shadowOpacity: 0.05,
  shadowRadius: 3,

  elevation: 2,
},

  itemText: {
    fontSize: 14,
    marginBottom: 8,
  },

  continueButton: {
    backgroundColor: '#008015',
    marginHorizontal: 12,
    marginLeft:5,
    marginVertical: 24,
    height: 50,
    width:365,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

 footer: {
  bottom: 20,
  left: 8,
  right: 8,
  marginTop:24
},

radioOuter: {
  width: 20,
  height: 20,
  borderRadius: 10,
  borderWidth: 1.2,
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

productRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  paddingVertical: 12,

  borderBottomWidth: 1,
  borderBottomColor: '#EEEEEE',
},

productName: {
  fontSize: 14,
  color: '#000',
},

productQty: {
  fontSize: 14,
  fontWeight: '600',
  color: '#0A8A2A',
},

productLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
},

productImage: {
  width: 44,
  height: 44,
  borderRadius: 10,
  marginRight: 12,
},

productRight: {
  alignItems: 'flex-end',
},

productCategory: {
  fontSize: 11,
  color: '#888',
  marginTop: 2,
},

productPrice: {
  fontSize: 14,
  fontWeight: '700',
  color: '#0A8A2A',
  marginTop: 2,
},

daysContainer: {
  backgroundColor: '#FFF',
  marginHorizontal: 12,
  marginTop: 10,
  marginBottom: 12,

  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E4E4E4',

  padding: 12,
},

daysTitle: {
  fontSize: 12,
  fontWeight: '500',
  color: '#000',

  marginBottom: 10,
},

daysRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

dayChip: {
  width: 38,
  height: 28,

  borderRadius: 6,

  borderWidth: 1,
  borderColor: '#CFCFCF',

  justifyContent: 'center',
  alignItems: 'center',

  marginRight: 8,
},

selectedDayChip: {
  backgroundColor: '#0A8A2A',
  borderColor: '#0A8A2A',
},

dayText: {
  fontSize: 11,
  color: '#444',
},

selectedDayText: {
  color: '#FFF',
  fontWeight: '600',
},

});