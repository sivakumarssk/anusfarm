import React from 'react';

import {
  View,
  Text,
  StyleSheet,
TouchableOpacity,
Image,
 ScrollView,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  useNavigation,
} from '@react-navigation/native';

const TrackOrderScreen = () => {

    const navigation = useNavigation<any>();

  return (

    <SafeAreaView style={styles.container}>

        <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{
      paddingBottom: 40,
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
    Track Order
  </Text>

</View>

<View style={styles.statusCard}>

  <View style={styles.badge}>

    <Text style={styles.badgeText}>
      Order Confirmed
    </Text>

  </View>

  <Text style={styles.arrivalText}>
    Arriving in 30 mins
  </Text>

</View>

<View style={styles.partnerCard}>

  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >

    <Image
      source={require('../../assets/icons/cart.png')}
      style={styles.partnerImage}
    />

    <View>

      <Text style={styles.partnerName}>
        Nani
      </Text>

      <Text style={styles.partnerRating}>
        ★ 4.9 (2k+ orders)
      </Text>

    </View>

  </View>

  <TouchableOpacity
    style={styles.callButton}
  >

    <Ionicons
      name="call"
      size={20}
      color="#FFF"
    />

  </TouchableOpacity>

</View>

<View style={styles.addressRow}>

  <Ionicons
    name="location-outline"
    size={22}
    color="#777"
    style={{
        marginTop:10,
    }}
  />

  <View
    style={{
      marginLeft: 6,
    }}
  >

    <Text>
      Delivery Address
    </Text>

    <Text>
      143 Colony,
      Azad Nagar,
      Kodad
    </Text>

  </View>

</View>


<Text style={styles.sectionTitle}>
  ORDER STATUS
</Text>

<View style={styles.timelineContainer}>

 <View style={styles.timelineItem}>

 <View style={styles.timelineLeft}>

  <View style={styles.completedCircle}>
    <Ionicons
      name="checkmark"
      size={14}
      color="#FFF"
    />
  </View>

  <View style={styles.timelineLine} />

</View>

<View style={styles.timelineContent}>
    <Text style={styles.completedText}>
      Order Confirmed
    </Text>

    <Text style={styles.timelineTime}>
      4:30 PM
    </Text>
  </View>

</View>
</View>



  <View style={styles.timelineItem}>

  <View style={styles.timelineLeft}>

    <View style={styles.activeCircle} />

    <View style={styles.timelineLine} />

  </View>

  <View style={styles.timelineContent}>
    <Text style={styles.activeText}>
      Freshly Packed
    </Text>

    <Text style={styles.timelineTime}>
      4:45 PM
    </Text>
  </View>

</View>


  <View style={styles.timelineItem}>

  <View style={styles.timelineLeft}>

    <View style={styles.pendingCircle} />

    <View style={styles.timelineLine} />

  </View>

  <View style={styles.timelineContent}>
    <Text style={styles.pendingText}>
      Out for Delivery
    </Text>

    <Text style={styles.timelineTime}>
      Pending
    </Text>
  </View>

</View>



  <View style={styles.timelineItem}>

  <View style={styles.timelineLeft}>

    <View style={styles.pendingCircle} />

  </View>

  <View style={styles.timelineContent}>
    <Text style={styles.pendingText}>
      Arrived
    </Text>

    <Text style={styles.timelineTime}>
      Pending
    </Text>
  </View>

</View>

<Text style={styles.summaryTitle}>
  Order Summary
</Text>

<View style={styles.summaryCard}>

  <View style={styles.summaryRow}>
    <Text>
      Subtotal (4 items)
    </Text>
    <Text>
      ₹973
    </Text>
  </View>

  <View style={styles.dashedLine} />

  <View style={styles.summaryRow}>
    <Text>
      Delivery
    </Text>
    <Text
      style={{
        color: '#0A8A2A',
      }}
    >
      Free
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
      ₹973
    </Text>
  </View>

</View>
</ScrollView>


    </SafeAreaView>

  );

};

export default TrackOrderScreen;

const styles = StyleSheet.create({

  container: {
  flex: 1,
  backgroundColor: '#F8F8F8',
  paddingHorizontal: 16,
},

timelineContainer: {
  marginTop: 12,
},

timelineItem: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

timelineContent: {
  marginLeft: 14,
},

completedCircle: {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: '#0A8A2A',
  justifyContent: 'center',
  alignItems: 'center',
},

activeCircle: {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: '#245AA8',
},

pendingCircle: {
  width: 22,
  height: 22,
  borderRadius: 11,
  backgroundColor: '#D4D4D4',
},

verticalLine: {
  width: 2,
  height: 34,
  backgroundColor: '#D4D4D4',
  marginLeft: 10,
},

completedText: {
  fontSize: 16,
  color: '#000',
},

activeText: {
  fontSize: 16,
  color: '#245AA8',
},

pendingText: {
  fontSize: 16,
  color: '#999',
},

timelineTime: {
  fontSize: 12,
  color: '#888',
  marginTop: 2,
},

summaryTitle: {
  fontSize: 20,
  fontWeight: '600',
  marginTop: 24,
  marginBottom: 12,
},

summaryCard: {
  backgroundColor: '#FFF',
  borderRadius: 14,
  padding: 16,
  borderWidth: 1,
  borderColor: '#E5E5E5',
},

summaryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

dashedLine: {
  borderStyle: 'dashed',
  borderWidth: 0.5,
  borderColor: '#D6D6D6',
  marginVertical: 12,
},

header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  marginBottom: 20,
},

headerTitle: {
  fontSize: 24,
  fontWeight: '600',
  marginLeft: 12,
},

statusCard: {
  backgroundColor: '#FFF',
  borderRadius: 12,
  padding: 14,
  borderWidth: 1,
  borderColor: '#E8E8E8',
  marginBottom: 12,
},

badge: {
  backgroundColor: '#DDF5DD',
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 12,
  alignSelf: 'flex-start',
},

badgeText: {
  color: '#0A8A2A',
  fontSize: 12,
  fontWeight: '500',
},

arrivalText: {
  fontSize: 18,
  fontWeight: '600',
  marginTop: 8,
},

partnerCard: {
  backgroundColor: '#FFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E8E8E8',
  padding: 14,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
},

partnerImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 12,
},

partnerName: {
  fontSize: 18,
  fontWeight: '600',
},

partnerRating: {
  color: '#0A8A2A',
  fontSize: 13,
  marginTop: 2,
},

callButton: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: '#000',
  justifyContent: 'center',
  alignItems: 'center',
},

addressRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 20,
},

sectionTitle: {
  fontSize: 18,
  fontWeight: '700',
  marginBottom: 16,
},

timelineLeft: {
  alignItems: 'center',
  width: 22,
},

timelineLine: {
  width: 2,
  height: 42,
  backgroundColor: '#D4D4D4',
},


});