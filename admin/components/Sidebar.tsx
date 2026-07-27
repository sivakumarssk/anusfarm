import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Sidebar(){

return(
<View style={styles.sidebar}>

<Text style={styles.logo}>
AnusFarm
</Text>


<TouchableOpacity onPress={()=>router.push("/dashboard")}>
<Text style={styles.menu}>
🏠 Dashboard
</Text>
</TouchableOpacity>


<TouchableOpacity onPress={()=>router.push("/products")}>
<Text style={styles.menu}>
📦 Products
</Text>
</TouchableOpacity>

<TouchableOpacity onPress={()=>router.push("/categories")}>
<Text style={styles.menu}>
📂 Categories
</Text>
</TouchableOpacity>


<TouchableOpacity onPress={()=>router.push("/orders")}>
<Text style={styles.menu}>
🛒 Orders
</Text>
</TouchableOpacity>


<TouchableOpacity onPress={()=>router.push("/subscriptions")}>
<Text style={styles.menu}>
🔄 Subscriptions
</Text>
</TouchableOpacity>


<TouchableOpacity onPress={()=>router.push("/users")}>
<Text style={styles.menu}>
👥 Users
</Text>
</TouchableOpacity>


</View>
)

}


const styles = StyleSheet.create({

sidebar:{
width:180,
backgroundColor:"#eee",
padding:20
},

logo:{
fontSize:32,
fontWeight:"bold",
marginBottom:30
},

menu:{
fontSize:20,
marginVertical:15
}

});