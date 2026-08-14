import {  View,Text,TouchableOpacity,StyleSheet, ScrollView,} from "react-native";
import { SafeAreaView,} from "react-native-safe-area-context";
import { useNavigation,} from "@react-navigation/native";
import { Ionicons} from "@expo/vector-icons";
import React, { useCallback, useState} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {API_URL} from "../config/api";
import { useFocusEffect} from "@react-navigation/native";


interface Address {
  id:number;
  address_type:string;
  full_address:string;
  phone:string;
  latitude:string;
  longitude:string;
}

const AddressScreen = ({route}:any)=>{
const navigation = useNavigation<any>();

// receive instant buy data
// const { items, type} = route.params || {};
const { items, type, fromSubscription } = route.params || {};

const [addresses,setAddresses]=useState<Address[]>([]);
const [selectedAddress,setSelectedAddress]=useState<Address|null>(null);
const [loading,setLoading]=useState(false);

useFocusEffect(
useCallback(()=>{
fetchAddresses();
},[])

);


const fetchAddresses = async()=>{
try{
setLoading(true);

const token =await AsyncStorage.getItem("token");

const res =await axios.get(`${API_URL}/api/addresses`,{
headers:{
Authorization:`Bearer ${token}`
}
});
setAddresses(res.data.addresses);
}
catch(error){
console.log(error);
}
finally{
setLoading(false);
}
};
return (

<SafeAreaView style={styles.container}>

<ScrollView
showsVerticalScrollIndicator={false}
contentContainerStyle={{
paddingBottom:40
}}>
<View style={styles.header}>
<TouchableOpacity
onPress={()=>navigation.goBack()}>
<Ionicons
name="arrow-back"
size={24}
color="#000"/>

</TouchableOpacity>
<Text style={styles.headerTitle}>Address</Text>
</View>
{loading &&<Text style={styles.message}>Loading...</Text>}

{addresses.length===0 && !loading &&
<Text style={styles.message}>No Address Found</Text>}
{addresses.map(item=>(
<TouchableOpacity key={item.id}
style={[
styles.addressCard,
selectedAddress?.id===item.id &&
{
borderColor:"#0A8A2A",
borderWidth:2
}
]}
onPress={()=>setSelectedAddress(item)}>
<View style={styles.row}>
<View style={styles.leftSection}>
<View style={styles.iconCircle}>
<Ionicons
name="location-outline"
size={20}
color="#0A8A2A"/>
</View>

<View style={{flex:1}}>
<Text style={styles.type}>{item.address_type}</Text>
<Text style={styles.address}>{item.full_address}</Text>
<Text style={styles.phone}>{item.phone}</Text>
</View>

</View>
<TouchableOpacity
  onPress={() =>
    navigation.navigate("EditAddress", {
      address: item,
    })
  }
>
  <Text style={styles.edit}>Edit</Text>
</TouchableOpacity>
</View>
</TouchableOpacity>
))
}

<TouchableOpacity
  style={styles.addButton}
  onPress={() => {
    if (!selectedAddress) {
      alert("Please select address");
      return;
    }

    console.log("ADDRESS SELECTED:", selectedAddress);

    if (fromSubscription) {
      navigation.navigate("SubscribePayment", {
        address: selectedAddress,
      });
      return;
    }

    navigation.navigate("InstantBuyPayment", {
      address: selectedAddress,
      items: items,
      type: type,
    });
  }}
>
  <Text style={styles.addButtonText}>Continue</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.addButton}
onPress={()=>navigation.navigate("AddAddress")}>
<Text style={styles.addButtonText}>Add New Address</Text>
</TouchableOpacity>

</ScrollView>
</SafeAreaView>
);
};

export default AddressScreen;

const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:"#F8F8F8"
},
header:{
flexDirection:"row",
alignItems:"center",
paddingHorizontal:16,
paddingTop:12,
marginBottom:20
},
headerTitle:{
fontSize:18,
fontWeight:"600",
marginLeft:12,
color:"#000"
},
addressCard:{
backgroundColor:"#FFF",
marginHorizontal:16,
marginBottom:12,
borderRadius:16,
padding:16,
borderWidth:1,
borderColor:"#E5E5E5"
},
row:{
flexDirection:"row",
justifyContent:"space-between"
},

leftSection:{
flexDirection:"row",
flex:1
},
iconCircle:{
width:40,
height:40,
borderRadius:20,
backgroundColor:"#E8F5E9",
justifyContent:"center",
alignItems:"center",
marginRight:12
},
type:{
fontSize:16,
fontWeight:"600",
color:"#000"
},
address:{
fontSize:12,
color:"#666",
marginTop:5
},
phone:{
fontSize:12,
color:"#666",
marginTop:4
},
edit:{
color:"#0A8A2A"
},
addButton:{
height:52,
backgroundColor:"#000",
borderRadius:10,
marginHorizontal:16,
marginTop:20,
justifyContent:"center",
alignItems:"center"
},
addButtonText:{
color:"#FFF",
fontSize:16,
fontWeight:"600"
},
message:{
textAlign:"center",
marginTop:40,
color:"#666"
}
});



