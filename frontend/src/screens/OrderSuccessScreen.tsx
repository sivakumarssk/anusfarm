import React from "react";
import {
View,
Text,
TouchableOpacity,
StyleSheet
} from "react-native";

import {useRoute,useNavigation} from "@react-navigation/native";


export default function OrderSuccessScreen(){

const route:any = useRoute();

const navigation:any = useNavigation();


const {
orderId,
total,
paymentMethod
}=route.params;


return(

<View style={styles.container}>


<Text style={styles.success}>
✓ Order Placed Successfully
</Text>


<Text style={styles.orderId}>
Order ID : #{orderId}
</Text>



<View style={styles.card}>


<Text style={styles.title}>
Order Summary
</Text>


<Text>
Total Amount : ₹{total}
</Text>


</View>



<View style={styles.card}>


<Text style={styles.title}>
Payment Summary
</Text>


<Text>
Payment Method : {paymentMethod}
</Text>


<Text>
Status : Paid
</Text>


</View>



<TouchableOpacity

style={styles.track}

onPress={()=>


navigation.navigate(
"TrackOrder",
{
orderId:orderId
}

)

}

>


<Text style={styles.trackText}>
Track Order
</Text>


</TouchableOpacity>



</View>

)

}



const styles=StyleSheet.create({

container:{
flex:1,
padding:20,
backgroundColor:"#fff"
},


success:{
fontSize:22,
fontWeight:"bold",
textAlign:"center",
marginTop:50
},


orderId:{
fontSize:16,
textAlign:"center",
marginVertical:20
},


card:{
backgroundColor:"#f5f5f5",
padding:20,
borderRadius:12,
marginTop:15
},


title:{
fontSize:18,
fontWeight:"bold",
marginBottom:10
},


track:{
backgroundColor:"black",
padding:15,
borderRadius:10,
marginTop:40
},


trackText:{
color:"#fff",
textAlign:"center",
fontWeight:"bold"
}


});