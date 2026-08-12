import React, { useState } from "react";
import {View,Text,StyleSheet,TouchableOpacity,Image, ScrollView,ActivityIndicator,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {useNavigation,useRoute,useFocusEffect,} from "@react-navigation/native";
import { API_URL } from "../config/api";


const TimelineItem = ({ title,active,time,}: {title:string; active:boolean; time?:string;}) => {

return (

<View style={styles.timelineItem}>
<View style={styles.timelineLeft}>

<View style={active? styles.completedCircle: styles.pendingCircle}>
{active &&
<Ionicons name="checkmark" size={14} color="#fff"/>}
</View>
<View style={styles.timelineLine}/>
</View>

<View style={styles.timelineContent}>
<Text style={active? styles.completedText: styles.pendingText}>{title}</Text>
<Text style={styles.timelineTime}>{time || "Pending"}</Text>
</View>
</View>
);
};

const TrackOrderScreen =()=>{
const navigation = useNavigation<any>();
const route = useRoute<any>();
const {orderId}=route.params;
const [order,setOrder]=useState<any>(null);
const [loading,setLoading]=useState(true);


useFocusEffect(
React.useCallback(()=>{
fetchOrder();
},[orderId])
);

const fetchOrder=async()=>{
try{
setLoading(true);
const token =await AsyncStorage.getItem("token");
const response =await fetch(`${API_URL}/api/orders/${orderId}`,{
headers:{
Authorization:`Bearer ${token}`,
"Content-Type":"application/json"
}
}
);
const data =await response.json();
console.log("ORDER DATA",JSON.stringify(data,null,2));

if(data.success){
setOrder(data.order);
}

}
catch(error){
console.log(error);
}
finally{
setLoading(false);
}
};
if(loading){
return(

<SafeAreaView style={styles.container}>
<ActivityIndicator size="large" color="#0A8A2A"/>
</SafeAreaView>
);
}
const status =(order?.status || "Pending").toLowerCase().trim();
return(

<SafeAreaView style={styles.container}>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:40}}>

<View style={styles.header}>
<TouchableOpacity onPress={()=>navigation.goBack()}>
<Ionicons name="arrow-back" size={24}/>
</TouchableOpacity>
<Text style={styles.headerTitle}>Track Order</Text>
</View>

<View style={styles.statusCard}>
<View style={styles.badge}>
<Text style={styles.badgeText}>
{status==="pending"?"Order Confirmed":status.charAt(0).toUpperCase()+status.slice(1)}
</Text>
</View>




<Text style={styles.arrivalText}>
{status==="delivered"?"Order Delivered":status==="out for delivery"?"Out for Delivery":
status==="packed"?"Order Packed":"Arriving Soon"}
</Text>
</View>





<View style={styles.infoCard}>


<Text style={styles.sectionTitle}>
Order Information
</Text>



<View style={styles.row}>


<Text>
Order ID
</Text>


<Text>
#{order?.order_id}
</Text>


</View>



<View style={styles.row}>


<Text>
Payment
</Text>


<Text>
{
(order?.payment_method || "COD")
.toUpperCase()
}
</Text>


</View>




<View style={styles.row}>


<Text>
Ordered On
</Text>


<Text>
{
new Date(order?.created_at)
.toLocaleString()
}
</Text>


</View>



</View>





<View style={styles.addressCard}>


<Ionicons
name="location-outline"
size={22}
color="#777"
/>


<View style={{marginLeft:10}}>


<Text>
Delivery Address
</Text>


<Text>
{
order?.address ||
"Address not available"
}
</Text>


</View>



</View>





<Text style={styles.sectionTitle}>
ORDER STATUS
</Text>




<View style={styles.timelineContainer}>
<View style={styles.timelineContainer}>


<TimelineItem

title="Order Placed"

active={[
"pending",
"accepted",
"packed",
"out for delivery",
"delivered"
].includes(status)}

time={
order?.created_at
}

/>



<TimelineItem

title="Accepted"

active={[
"accepted",
"packed",
"out for delivery",
"delivered"
].includes(status)}

time={
[
"accepted",
"packed",
"out for delivery",
"delivered"
].includes(status)
?
"Accepted by store"
:
"Pending"
}

/>




<TimelineItem

title="Packed"

active={[
"packed",
"out for delivery",
"delivered"
].includes(status)}

time={
[
"packed",
"out for delivery",
"delivered"
].includes(status)
?
"Packed"
:
"Pending"
}

/>




<TimelineItem

title="Out for Delivery"

active={[
"out for delivery",
"delivered"
].includes(status)}

time={
[
"out for delivery",
"delivered"
].includes(status)
?
"Driver is on the way"
:
"Pending"
}

/>




<TimelineItem

title="Delivered"

active={
status==="delivered"
}

time={
status==="delivered"
?
"Delivered successfully"
:
"Pending"
}

/>


</View>

</View>
{/* PRODUCTS */}

<Text style={styles.sectionTitle}>
  Products
</Text>


<View style={styles.productCard}>


{
order?.products?.map(
(item:any,index:number)=>(

<View
key={index}
style={styles.productRow}
>


<Image
source={{
uri: encodeURI(
`${API_URL}/uploads/${item.image}`
)
}}
style={styles.productImage}
/>



<View style={{flex:1}}>


<Text style={styles.productName}>
{item.product_name}
</Text>



<Text style={styles.productText}>
Quantity : {item.quantity}
</Text>



<Text style={styles.priceText}>
₹{item.price}
</Text>



</View>


</View>

)

)

}


</View>





{/* ORDER SUMMARY */}


<Text style={styles.sectionTitle}>
Order Summary
</Text>



<View style={styles.summaryCard}>


<View style={styles.summaryRow}>


<Text>
Subtotal
</Text>


<Text>
₹{order?.total_amount}
</Text>


</View>



<View style={styles.dashedLine}/>



<View style={styles.summaryRow}>


<Text>
Delivery
</Text>


<Text style={{color:"#0A8A2A"}}>
Free
</Text>


</View>



<View style={styles.dashedLine}/>



<View style={styles.summaryRow}>


<Text style={{fontWeight:"700"}}>
Total Amount
</Text>


<Text style={{fontWeight:"700"}}>
₹{order?.total_amount}
</Text>


</View>



</View>


</ScrollView>


</SafeAreaView>


);

};


export default TrackOrderScreen;
const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F8F8",
paddingHorizontal:16,
},


header:{
flexDirection:"row",
alignItems:"center",
marginTop:10,
marginBottom:20,
},


headerTitle:{
fontSize:24,
fontWeight:"700",
marginLeft:12,
},



statusCard:{
backgroundColor:"#fff",
borderRadius:14,
padding:16,
marginBottom:15,
},



badge:{
backgroundColor:"#DDF5DD",
paddingHorizontal:12,
paddingVertical:6,
borderRadius:20,
alignSelf:"flex-start",
},


badgeText:{
color:"#0A8A2A",
fontWeight:"600",
},



arrivalText:{
fontSize:20,
fontWeight:"700",
marginTop:10,
},




infoCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:14,
marginBottom:15,
},



row:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:12,
},



addressCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:14,
flexDirection:"row",
marginBottom:20,
},




sectionTitle:{
fontSize:18,
fontWeight:"700",
marginBottom:15,
marginTop:10,
},




timelineContainer:{
marginBottom:20,
},



timelineItem:{
flexDirection:"row",
},



timelineLeft:{
width:25,
alignItems:"center",
},



completedCircle:{
width:22,
height:22,
borderRadius:11,
backgroundColor:"#0A8A2A",
justifyContent:"center",
alignItems:"center",
},



pendingCircle:{
width:22,
height:22,
borderRadius:11,
backgroundColor:"#D5D5D5",
},



timelineLine:{
width:2,
height:45,
backgroundColor:"#DDD",
},




timelineContent:{
marginLeft:15,
marginBottom:10,
},



completedText:{
fontSize:16,
fontWeight:"600",
},



pendingText:{
fontSize:16,
color:"#999",
},



timelineTime:{
fontSize:12,
color:"#888",
marginTop:3,
},





productCard:{
backgroundColor:"#fff",
padding:15,
borderRadius:14,
marginBottom:20,
},



productRow:{
flexDirection:"row",
alignItems:"center",
marginBottom:15,
},



productImage:{
width:70,
height:70,
borderRadius:10,
marginRight:12,
},



productName:{
fontSize:16,
fontWeight:"700",
},



productText:{
color:"#666",
marginTop:5,
},



priceText:{
color:"#0A8A2A",
fontWeight:"700",
marginTop:5,
},




summaryCard:{
backgroundColor:"#fff",
padding:16,
borderRadius:14,
marginBottom:30,
},



summaryRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
},



dashedLine:{
borderWidth:0.5,
borderStyle:"dashed",
borderColor:"#ccc",
marginVertical:12,
},


});