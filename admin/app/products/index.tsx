import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import AdminLayout from "../../components/AdminLayout";

export default function Products() {

  return (
    <AdminLayout>
    <View style={styles.container}>

      <Text style={styles.title}>
        Products
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/products/add")}
      >
        <Text style={styles.text}>
          Add Product
        </Text>
      </TouchableOpacity>

    </View>
    </AdminLayout>
  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },

  title:{
    fontSize:30,
    fontWeight:"bold",
    marginBottom:30
  },

  button:{
    backgroundColor:"green",
    padding:15,
    borderRadius:10
  },

  text:{
    color:"white",
    fontSize:18
  }

});