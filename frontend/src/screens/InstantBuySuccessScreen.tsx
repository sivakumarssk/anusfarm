import React from 'react';
import {useRoute} from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView,} from 'react-native';
import {SafeAreaView,} from 'react-native-safe-area-context';
import {useNavigation,} from '@react-navigation/native';
import { Ionicons }from '@expo/vector-icons';

const InstantBuySuccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

const {orderId,total,subtotal,itemCount,paymentMethod}=route.params || {};
const paymentNames: Record<string, string> = {
  upi: "UPI",
  card: "Debit / Credit Card",
  netbanking: "Net Banking",
  wallet: "Wallet",
  cod: "Cash on Delivery",
};
  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}

        <View style={styles.header}>

          <TouchableOpacity onPress={() =>
              navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000"/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Instant Buy
          </Text>

        </View>

        {/* Success Banner */}

        <View style={styles.successBox}>

          <Text style={styles.successTitle}>
            Order placed successfully!
          </Text>

          <Text style={styles.successSubTitle}>
            Your order will be delivered by 6:00 AM
          </Text>

        </View>

        {/* Order Id */}

        <View style={styles.orderCard}>

          <Text style={styles.orderLabel}>
            Order Id
          </Text>
<Text style={styles.orderId}>
 #{orderId}
</Text>

        </View>

        {/* Order Summary */}

        <Text style={styles.sectionTitle}>
          Order Summary
        </Text>

        <View style={styles.summaryCard}>

          <View style={styles.summaryRow}>
           <Text style={{ fontFamily: 'Inter-Regular' }}>
  Subtotal ({itemCount} items)
</Text>

<Text style={{ fontFamily: 'Inter-Regular' }}>
  ₹{subtotal}
</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.summaryRow}>
           <Text style={{ fontFamily: 'Inter-Regular' }}>
  Delivery
</Text>
            <Text
  style={{
    color:'#0A8A2A',
    fontFamily:'Inter-Medium',
  }}
>
  Free
</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.summaryRow}>
           <Text
  style={{
    fontFamily:'Inter-Bold',
  }}
>
  Total Amount
</Text>

<Text
  style={{
    fontFamily:'Inter-Bold',
  }}
>
  ₹{total}
</Text>
          </View>

        </View>

        {/* Payment Summary */}

        <Text style={styles.sectionTitle}>
          Payment Summary
        </Text>

        <View style={styles.summaryCard}>

          <View style={styles.summaryRow}>
           <Text style={{ fontFamily:'Inter-Regular' }}>
  Total Amount
</Text>

<Text style={{ fontFamily:'Inter-Regular' }}>
  ₹{total}
</Text>
          </View>

          <View style={styles.dashedLine} />

          <View style={styles.summaryRow}>
          <Text style={{ fontFamily:'Inter-Regular' }}>
  Paid Via
</Text>

         <Text
  style={{
    color: "#0A8A2A",
    fontFamily: "Inter-SemiBold",
  }}
>
  {paymentNames[paymentMethod] || paymentMethod}
</Text>
          </View>

        </View>

        <TouchableOpacity
          style={styles.trackButton}
         onPress={()=>{
 navigation.navigate(
   "TrackOrder",
   {
     orderId: orderId
   }
 )
}}
        >
          <Text style={styles.trackText}>
            Track Order
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );
};

export default InstantBuySuccessScreen;

const styles = StyleSheet.create({

container:{
  flex:1,
  backgroundColor:'#F8F8F8',
},

header:{
  flexDirection:'row',
  alignItems:'center',
  paddingHorizontal:16,
  paddingTop:16,
},

headerTitle:{
  fontSize:15,
  fontFamily:'Inter-SemiBold',
  marginLeft:12,
},

successBox:{
  backgroundColor:'#DFF1DE',

  marginHorizontal:16,
  marginTop:20,

  borderRadius:10,

  padding:14,
},

successTitle:{
  color:'#179A2E',
  fontSize:12,
  fontFamily:'Inter-Bold',
},

successSubTitle:{
  color:'#777',
  marginTop:4,
  fontFamily:'Inter-Regular',
  fontSize:9,
},

orderCard:{
  backgroundColor:'#FFF',

  marginHorizontal:16,
  marginTop:14,

  borderRadius:12,

  padding:14,

  borderWidth:1,
  borderColor:'#E8E8E8',
},

orderLabel:{
  color:'#777',
  fontSize:10,
  fontFamily:'Inter-Regular',
},

orderId:{
  marginTop:4,
  fontSize:12,
  fontFamily:'Inter-Bold',
},

sectionTitle:{
  marginHorizontal:16,
  marginTop:16,
  marginBottom:10,
  fontSize:13,
  fontFamily:'Inter-SemiBold',
},

summaryCard:{
  backgroundColor:'#FFF',

  marginHorizontal:16,

  borderRadius:12,

  padding:14,

  borderWidth:1,
  borderColor:'#E8E8E8',
},

summaryRow:{
  flexDirection:'row',
  justifyContent:'space-between',
},

dashedLine:{
  borderStyle:'dashed',
  borderWidth:0.5,
  borderColor:'#D5D5D5',
  marginVertical:12,
},

trackButton:{
  height:52,

  backgroundColor:'#000',

  borderRadius:8,

  justifyContent:'center',
  alignItems:'center',

  marginHorizontal:16,
  marginTop:120,
  marginBottom:30,
},

trackText:{
  color:'#FFF',
  fontSize:16,
  fontFamily:'Inter-SemiBold',
},

});