
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Navbar() {
  return (

    <View>

      <View style={styles.navbar}>

        <Text style={styles.title}>
          AnusFarm Admin
        </Text>


        <TouchableOpacity
  onPress={() => router.push("/products/add")}
>
  <Text style={styles.addButton}>
    ➕ Add Product
  </Text>
</TouchableOpacity>

      </View>


    </View>

  );
}



const styles = StyleSheet.create({

navbar:{
height:60,
backgroundColor:"#fff",
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
paddingHorizontal:20,
elevation:5
},


title:{
fontSize:20,
fontWeight:"bold"
},

addButton: {
  backgroundColor: "green",
  color: "white",
  paddingHorizontal: 15,
  paddingVertical: 8,
  borderRadius: 5,
  fontWeight: "bold",
},



});