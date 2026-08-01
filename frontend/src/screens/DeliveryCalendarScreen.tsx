import React, {useEffect, useState} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import {
  Calendar,
} from "react-native-calendars";

import AsyncStorage from
"@react-native-async-storage/async-storage";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import {
  Ionicons,
} from "@expo/vector-icons";


const BASE_URL =
"http://192.168.0.112:5000/api";


export default function DeliveryCalendarScreen(){

const navigation =
useNavigation<any>();

const route =
useRoute<any>();


const {id} = route.params;


const [loading,setLoading] =
useState(true);


const [calendarData,setCalendarData] =
useState<any>(null);



useEffect(()=>{

getCalendar();

},[]);



const getCalendar = async()=>{

try{

const token =
await AsyncStorage.getItem("token");


const res =
await fetch(

`${BASE_URL}/subscriptions/${id}/calendar`,

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);


const json =
await res.json();


if(json.success){

setCalendarData(
json.calendar
);

}


}
catch(error){

console.log(error);

}

setLoading(false);

};




if(loading){

return(

<View style={styles.loader}>

<ActivityIndicator
size="large"
/>

</View>

);

}



const markedDates:any = {};



// Next delivery blue

if(calendarData?.next_delivery_date){

markedDates[
calendarData.next_delivery_date
]=
{

selected:true,

selectedColor:"#2196F3",

marked:true,

dotColor:"#2196F3"

};

}



// Pause dates orange

if(
calendarData?.pause_from &&
calendarData?.pause_to
){

const start =
new Date(
calendarData.pause_from
);

const end =
new Date(
calendarData.pause_to
);


while(start <= end){

const date =
start
.toISOString()
.split("T")[0];


markedDates[date]=
{

selected:true,

selectedColor:"#FF9800"

};


start.setDate(
start.getDate()+1
);

}

}



// Daily delivery example

// if(
// calendarData?.frequency==="Daily"
// ){

// let date =
// new Date(
// calendarData.start_date
// );


// for(let i=0;i<30;i++){

// const day =
// date
// .toISOString()
// .split("T")[0];


// if(
// day !==
// calendarData.next_delivery_date
// ){

// markedDates[day]=
// {

// marked:true,

// dotColor:"#4CAF50"

// };

// }


// date.setDate(
// date.getDate()+1
// );


// }

// }
if(calendarData?.deliveries){

calendarData.deliveries.forEach(
(item:any)=>{


let color="#4CAF50";


if(item.status==="Delivered"){
color="#4CAF50";
}


if(item.status==="Paused"){
color="#FF9800";
}


if(item.status==="Cancelled"){
color="#F44336";
}



markedDates[item.delivery_date]={

marked:true,

dotColor:color

};


});


}


return(

<SafeAreaView
style={styles.container}
>


<View style={styles.header}>


<TouchableOpacity
onPress={()=>navigation.goBack()}
>

<Ionicons
name="arrow-back"
size={24}
/>

</TouchableOpacity>


<Text style={styles.title}>

Delivery Calendar

</Text>


</View>




<Calendar

markedDates={
markedDates
}

theme={{

todayTextColor:"#4CAF50",

arrowColor:"#4CAF50",

}}

/>





<View style={styles.card}>


<Text style={styles.heading}>

Subscription Details

</Text>



<View style={styles.row}>

<Text>
Frequency
</Text>

<Text style={styles.bold}>
{calendarData?.frequency}
</Text>

</View>



<View style={styles.row}>

<Text>
Next Delivery
</Text>

<Text style={styles.bold}>
{calendarData?.next_delivery_date}
</Text>

</View>



<View style={styles.row}>

<Text>
Status
</Text>


<Text
style={{
fontWeight:"700",
color:
calendarData?.status==="Active"
?
"green"
:
"orange"
}}
>

{calendarData?.status}

</Text>


</View>


</View>





<View style={styles.legend}>


<View style={styles.legendItem}>

<View
style={[
styles.dot,
{
backgroundColor:"#4CAF50"
}
]}
/>

<Text>
Delivery
</Text>


</View>



<View style={styles.legendItem}>

<View
style={[
styles.dot,
{
backgroundColor:"#FF9800"
}
]}
/>

<Text>
Paused
</Text>


</View>




<View style={styles.legendItem}>

<View
style={[
styles.dot,
{
backgroundColor:"#2196F3"
}
]}
/>

<Text>
Next Delivery
</Text>


</View>



</View>



</SafeAreaView>

);


}



const styles =
StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F7F7F7"
},


loader:{
flex:1,
justifyContent:"center",
alignItems:"center"
},


header:{
flexDirection:"row",
alignItems:"center",
padding:16
},


title:{
fontSize:22,
fontWeight:"700",
marginLeft:12
},


card:{
backgroundColor:"#fff",
margin:16,
padding:16,
borderRadius:15
},


heading:{
fontSize:18,
fontWeight:"700",
marginBottom:15
},


row:{
flexDirection:"row",
justifyContent:"space-between",
marginVertical:8
},


bold:{
fontWeight:"700"
},


legend:{
flexDirection:"row",
justifyContent:"space-around",
marginTop:20
},


legendItem:{
flexDirection:"row",
alignItems:"center"
},


dot:{
width:12,
height:12,
borderRadius:6,
marginRight:6
}


});