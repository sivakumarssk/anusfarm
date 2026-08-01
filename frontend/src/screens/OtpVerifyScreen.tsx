import React, {useEffect, useRef, useState} from 'react';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View,Text,TouchableOpacity,TextInput,StyleSheet,Alert,Keyboard,TouchableWithoutFeedback} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation,useRoute} from '@react-navigation/native';


const OtpVerifyScreen =()=>{
const navigation = useNavigation<any>();
const route = useRoute<any>();
const {phoneNumber} = route.params;
const [name,setName] = useState("");
const [otp,setOtp] = useState(['','','','','','']);
const [error,setError] = useState("");
const [timer,setTimer] = useState(30);
const [isResendVisible,setIsResendVisible] = useState(false);
const inputRefs = useRef<any>([]);

useEffect(()=>{
let interval:any;
if(timer>0){
interval=setInterval(()=>{
setTimer(prev=>prev-1);
},1000);
}else{
setIsResendVisible(true);
}
return()=>clearInterval(interval);
},[timer]);
const handleOtpChange=(text:string,index:number)=>{
if(!/^[0-9]?$/.test(text)){
return;
}

let updated=[...otp];
updated[index]=text;
setOtp(updated);
setError("");
if(text && index<5){
inputRefs.current[index+1]?.focus();
}
};
const handleVerify=async()=>{
Keyboard.dismiss();
const enteredOtp=otp.join("");
if(!name){
setError("Please enter your name");
return;
}
if(enteredOtp.length!==6){
setError("Please enter complete OTP");
return;
}
try{
  console.log("Calling API...");

const response = await fetch("http://192.168.0.112:5000/api/auth/verify-otp",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
phone:phoneNumber,
otp:enteredOtp
})
}
);
const data=await response.json();
console.log("Verify OTP:",data);
if(data.success){
await AsyncStorage.setItem("token",data.token);
await AsyncStorage.setItem("isLoggedIn","true");
Alert.alert("Success","OTP Verified Successfully");
navigation.navigate("Location");
}
else{
setError(data.message);
}
}
catch(error){
console.log(error);
Alert.alert("Error","Unable to verify OTP");
}
};

return(
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
<SafeAreaView style={styles.container}>
<View style={styles.mainContainer}>

<TouchableOpacity style={styles.backContainer}onPress={()=>navigation.goBack()}>
<Ionicons name="arrow-back"size={24}color="#000"/>
<Text style={styles.backText}>Verify Number</Text>
</TouchableOpacity>

<Text style={styles.heading}>Verify Your Number</Text>
<Text style={styles.subText}>Enter your details</Text>
<TextInput placeholder="Enter your name" value={name} onChangeText={setName} style={styles.nameInput}/>
<Text style={styles.mobileText}>+91 {phoneNumber}</Text>

<View style={styles.otpContainer}>
{otp.map((digit,index)=>(
<TextInput key={index} ref={(ref)=>{
inputRefs.current[index]=ref;
}}
style={styles.otpInput}
keyboardType="number-pad"
maxLength={1}
value={digit}
onChangeText={(text)=>
handleOtpChange(text,index)
}/>
))
}
</View>
{error?
<Text style={styles.errorText}>{error}</Text>:null
}

{isResendVisible?
<TouchableOpacity onPress={()=>{ 
  setTimer(30);
setIsResendVisible(false);
}}>
<Text style={styles.resendButtonText}>Resend OTP</Text>
</TouchableOpacity>:
<Text style={styles.resendText}>Resend OTP in 00:{timer<10?`0${timer}`:timer}</Text>
}

<TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
<Text style={styles.verifyText}>Verify</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
</TouchableWithoutFeedback>
);
};
const styles=StyleSheet.create({


container:{
flex:1,
backgroundColor:"#fff"
},


mainContainer:{
flex:1,
paddingHorizontal:30,
paddingTop:30
},


backContainer:{
flexDirection:"row",
alignItems:"center",
marginBottom:40
},


backText:{
fontSize:18,
marginLeft:10
},


heading:{
fontSize:28,
fontWeight:"700",
textAlign:"center",
marginBottom:10
},


subText:{
textAlign:"center",
color:"#777",
marginBottom:20
},


nameInput:{
height:50,
borderWidth:1,
borderColor:"#ddd",
borderRadius:10,
paddingHorizontal:15,
marginBottom:20
},


mobileText:{
textAlign:"center",
fontSize:16,
marginBottom:30
},


otpContainer:{
flexDirection:"row",
justifyContent:"space-between",
marginBottom:20
},


otpInput:{
width:48,
height:48,
borderWidth:1,
borderColor:"#ccc",
borderRadius:8,
textAlign:"center",
fontSize:22
},


errorText:{
color:"red",
textAlign:"center",
marginBottom:20
},


resendText:{
textAlign:"center",
color:"#777",
marginBottom:40
},


resendButtonText:{
textAlign:"center",
marginBottom:40,
fontWeight:"600"
},


verifyButton:{
height:58,
backgroundColor:"#000",
borderRadius:30,
justifyContent:"center",
alignItems:"center"
},


verifyText:{
color:"#fff",
fontSize:18,
fontWeight:"600"
}


});



export default OtpVerifyScreen;