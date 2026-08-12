import React, {useState} from 'react';
import {View,Text,TouchableOpacity,StyleSheet,ScrollView,Image,TextInput} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from '../config/api';

type UserProfile = {id:number;name:string; phone:string;};

const ProfileScreen = () => {
const navigation = useNavigation<any>();
const [profile,setProfile] = useState<UserProfile | null>(null);
const [showNameInput,setShowNameInput] = useState(false);
const [name,setName] = useState("");

// GET PROFILE
useFocusEffect(
useCallback(()=>{
getProfile();
},[])
);
const getProfile = async()=>{
try{
const token = await AsyncStorage.getItem("token");
if(!token){
console.log("TOKEN NOT FOUND");
return;
}
const response = await fetch(`${API_URL}/api/users/profile`,{
method:"GET",
headers:{
Authorization:`Bearer ${token}`
}
}
);
  const data = await response.json();
console.log("PROFILE:",data);
  if(data.success){
  console.log("USER DATA:",data.user);
 setProfile(data.user);
  setName(data.user.name || "");
}
}catch(error){
console.log("PROFILE ERROR:",error);
}
};
// UPDATE NAME
const saveName = async()=>{
try{
 const token = await AsyncStorage.getItem("token");
 if(!token){
 return;
}
const response = await fetch(`${API_URL}/api/users/update-profile`,{
method:"PUT",
headers:{"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
name:name
})
}
);
const data = await response.json();
console.log("UPDATE:",data);
  if(data.success){
  setProfile(data.user);

  await AsyncStorage.setItem(
  "userName",data.user.name);

   setShowNameInput(false);
   
   navigation.navigate("Home");
}
}catch(error){
console.log(error);
}
};

const menuItems = [
{
title:'My Subscriptions',
screen:'MySubscriptions',
image:require("../../assets/icons/MySubscription.png")
},

{
title:'Delivery Address',
screen:'Address',
image:require("../../assets/icons/location.png")
},

{
title:'Pause Deliveries',
screen:'PausedDeliveries',
image:require("../../assets/icons/PauseDeliveries.png")
},

{
title:'Order History',
screen:'OrderHistory',
image:require("../../assets/icons/OrderHistory.png")
},

{
title:'Transaction History',
screen:'TransactionHistory',
image:require("../../assets/icons/TransactionHistory.png")
},

{
title:'Policies',
image:require("../../assets/icons/Policies.png")
},

{
title:"FAQ's",
image:require("../../assets/icons/FAQ.png")
},

{
title:'About Us',
image:require("../../assets/icons/AboutUs.png")
},

{
title:'Contact Us',
image:require("../../assets/icons/ContactUs.png")
},
];
return (
<SafeAreaView style={{flex:1}}>

<ScrollView showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:100}}>

<View style={styles.header}>
<TouchableOpacity onPress={()=>navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color="#000"/>
</TouchableOpacity>
<Text style={styles.headerTitle}>My Account</Text>
</View>

<View style={styles.profileCard}>
<View style={styles.profileTop}>
<View>
{
profile?.name ? (
<Text style={styles.userName}>{profile.name}</Text>
):(
<TouchableOpacity onPress={()=>setShowNameInput(true)}>
<Text style={styles.userName}>Enter Name</Text>
</TouchableOpacity>
)
}
<Text style={styles.userPhone}>+91 {profile?.phone}</Text>
</View>

<TouchableOpacity onPress={()=>{
setName(profile?.name || "");
setShowNameInput(true);}}>
<Ionicons
name="create-outline"
size={22}
color="#000"/>
</TouchableOpacity>
</View>

{!profile?.name && (
<View style={styles.completeProfileBox}>
<Text style={styles.completeText}>Your profile is incomplete</Text>
<TouchableOpacity onPress={()=>setShowNameInput(true)}>
<Text style={styles.completeNow}>Complete Now</Text>
</TouchableOpacity>
</View>
)
}
</View>

{showNameInput && (
<View style={styles.nameBox}>
<TextInput placeholder="Enter your name" value={name} onChangeText={setName} style={styles.nameInput}/>
<TouchableOpacity style={styles.saveButton} onPress={saveName}>
<Text style={styles.saveText}>Save Name</Text>
</TouchableOpacity>
</View>
)
}

{menuItems.map(item=>(
<TouchableOpacity key={item.title} style={styles.menuCard}
onPress={()=>{if(item.screen){
navigation.navigate(item.screen);
}
}}>
<View style={styles.menuLeft}>
<Image source={item.image}
style={{width:20,height:20}}/>
<Text style={styles.menuTitle}>{item.title}</Text>
</View>
<Ionicons
name="chevron-forward"
size={20}
color="#444"/>
</TouchableOpacity>
))
}
</ScrollView>
</SafeAreaView>
);
};
export default ProfileScreen;

const styles = StyleSheet.create({
header:{
flexDirection:'row',
alignItems:'center',
paddingHorizontal:16,
paddingTop:16
},
headerTitle:{
fontSize:22,
fontWeight:'600',
marginLeft:12,
color:'#000'
},
profileCard:{
backgroundColor:'#aab9aa',
marginHorizontal:16,
marginTop:20,
borderRadius:18,
padding:16
},
profileTop:{
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center'
},
userName:{
fontSize:20,
fontWeight:'700',
color:'#100f0f'
},
userPhone:{
fontSize:14,
color:'#131212',
marginTop:4
},
completeProfileBox:{
backgroundColor:'rgba(255,255,255,0.15)',
borderWidth:1,
borderColor:'rgba(255,255,255,0.3)',
marginTop:16,
borderRadius:10,
padding:12,
flexDirection:'row',
justifyContent:'space-between'
},
completeText:{
fontSize:12,
color:'#666'
},
completeNow:{
fontSize:12,
fontWeight:'700',
color:'#555'
},
nameBox:{
marginHorizontal:16,
marginTop:10
},
nameInput:{
borderWidth:1,
borderColor:'#ccc',
borderRadius:10,
padding:12,
backgroundColor:'#fff'
},
saveButton:{
backgroundColor:'#000',
padding:12,
borderRadius:10,
marginTop:10
},
saveText:{
color:'#fff',
textAlign:'center',
fontWeight:'600'
},
menuCard:{
backgroundColor:'#FFF',
marginHorizontal:16,
marginTop:8,
height:60,
borderRadius:14,
paddingHorizontal:24,
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center',
elevation:2
},
menuLeft:{
flexDirection:'row',
alignItems:'center'
},
menuTitle:{
fontSize:15,
color:'#000',
marginLeft:14
}
});