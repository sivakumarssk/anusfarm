import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import { Ionicons }
from '@expo/vector-icons';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

const ProfileScreen = () => {

  const navigation =
      useNavigation<any>();

  const menuItems = [
  {
    title: 'My Subscriptions',
    icon: 'calendar-outline',
    image:require("../../assets/icons/MySubscription.png")
  },
  {
    title: 'Delivery Address',
    icon: 'location-outline',
    screen:'Address',
     image:require("../../assets/icons/location.png")
  },
  {
    title: 'Pause Deliveries',
    icon: 'pause-circle-outline',
    screen:'PausedDeliveries',
     image:require("../../assets/icons/PauseDeliveries.png")
  },
  {
    title: 'Order History',
    icon: 'receipt-outline',
    screen:'OrderHistory',
     image:require("../../assets/icons/OrderHistory.png")
  },
  {
    title: 'Transaction History',
    icon: 'wallet-outline',
    screen:"TransactionHistory",
     image:require("../../assets/icons/TransactionHistory.png")
  },
  {
    title: 'Policies',
    icon: 'document-text-outline',
     image:require("../../assets/icons/Policies.png")
  },
  {
    title: "FAQ's",
    icon: 'help-circle-outline',
     image:require("../../assets/icons/FAQ.png")
  },
  {
    title: 'About Us',
    icon: 'information-circle-outline',
     image:require("../../assets/icons/AboutUs.png")
  },
  {
    title: 'Contact Us',
    icon: 'call-outline',
    image:require("../../assets/icons/ContactUs.png")
  },
];

  return (
    <SafeAreaView>

      <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 100,
    }}
  >

    <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons
      name="arrow-back"
      size={24}
      color="#000"
    />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>
    My Account
  </Text>
</View>

<View style={styles.profileCard}>

  <View style={styles.profileTop}>

    <View>
      <Text style={styles.userName}>
       Kullai Babu
      </Text>

      <Text style={styles.userPhone}>
        +91 6985471235
      </Text>
    </View>

    <TouchableOpacity>
      <Ionicons
        name="create-outline"
        size={22}
        color="#000"
      />
    </TouchableOpacity>

  </View>

  <View style={styles.completeProfileBox}>

    <Text style={styles.completeText}>
      Your profile is incomplete
    </Text>

    <TouchableOpacity>
      <Text style={styles.completeNow}>
        Complete Now
      </Text>
    </TouchableOpacity>

  </View>

</View>


{menuItems.map(item => (

  <TouchableOpacity
    key={item.title}
    style={styles.menuCard}
   onPress={() => {
  if (item.screen) {
    navigation.navigate(item.screen);
  }
}}
  >

    <View style={styles.menuLeft}>

      <Image
      source={item.image}
      style={{
        width:20,
        height:20,
      }}
      resizeMode='contain'
      />


      <Text style={styles.menuTitle}>
        {item.title}
      </Text>

    </View>

    <Ionicons
      name="chevron-forward"
      size={20}
      color="#444"
    />

  </TouchableOpacity>

))}

</ScrollView>

</SafeAreaView>

   

  );

};

export default ProfileScreen;


const styles = StyleSheet.create({
  header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingTop: 16,
},

headerTitle: {
  fontSize: 22,
  fontWeight: '600',
  marginLeft: 12,
  color: '#000',
  paddingBottom: 12,
borderBottomWidth: 1,
borderBottomColor: '#F2F2F2',
},

profileCard: {
  backgroundColor: '#aab9aa',

  marginHorizontal: 16,
  marginTop: 20,

  borderRadius: 18,

  padding: 16,
},

profileTop: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

userName: {
  fontSize: 20,
  fontWeight: '700',
  color: '#100f0f',
},

userPhone: {
  fontSize: 14,
  color: '#131212',
  marginTop: 4,
},

completeProfileBox: {
  backgroundColor: 'rgba(255,255,255,0.15)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',

  marginTop: 16,

  borderRadius: 10,

  paddingHorizontal: 12,
  paddingVertical: 12,

  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

completeText: {
  fontSize: 12,
  color: '#666',
},

completeNow: {
  fontSize: 12,
  fontWeight: '700',
  color: '#555',
},

menuCard: {
  backgroundColor: '#FFF',

  marginHorizontal: 16,
  marginTop: 8,

  height: 60,

  borderRadius: 14,

  paddingHorizontal: 24,

  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  shadowColor: '#000',
shadowOffset: {
  width: 0,
  height: 2,
},
shadowOpacity: 0.06,
shadowRadius: 4,

elevation: 2,
},

menuLeft: {
  flexDirection: 'row',
  alignItems: 'center',
},

menuTitle: {
  fontSize: 15,
  color: '#000',
  marginLeft: 14,
},

})