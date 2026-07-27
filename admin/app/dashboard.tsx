// // 
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { router } from "expo-router";
// import AdminLayout from "../components/AdminLayout";

// export default function Dashboard() {

//   return (

//     <AdminLayout>

//       <View style={styles.container}>

//         <Text style={styles.title}>
//           Admin Dashboard
//         </Text>


//         <TouchableOpacity 
//           style={styles.card}
//           onPress={() => router.push("/products")}
//         >
//           <Text style={styles.cardText}>
//             📦 Products
//           </Text>
//         </TouchableOpacity>


//         <TouchableOpacity 
//           style={styles.card}
//           onPress={() => router.push("/products/add")}
//         >
//           <Text style={styles.cardText}>
//             ➕ Add Product
//           </Text>
//         </TouchableOpacity>


//         <TouchableOpacity style={styles.card}>
//           <Text style={styles.cardText}>
//             📂 Categories
//           </Text>
//         </TouchableOpacity>


//         <TouchableOpacity style={styles.card}>
//           <Text style={styles.cardText}>
//             🛒 Orders
//           </Text>
//         </TouchableOpacity>


//         <TouchableOpacity style={styles.card}>
//           <Text style={styles.cardText}>
//             🔄 Subscriptions
//           </Text>
//         </TouchableOpacity>


//         <TouchableOpacity style={styles.card}>
//           <Text style={styles.cardText}>
//             👥 Users
//           </Text>
//         </TouchableOpacity>


//       </View>

//     </AdminLayout>

//   );
// }



// const styles = StyleSheet.create({

//   container:{
//     flex:1,
//     backgroundColor:"#fff"
//   },

//   title:{
//     fontSize:28,
//     fontWeight:"bold",
//     textAlign:"center",
//     marginBottom:30
//   },

//   card:{
//     backgroundColor:"green",
//     padding:20,
//     borderRadius:10,
//     marginBottom:15
//   },

//   cardText:{
//     color:"#fff",
//     fontSize:18,
//     fontWeight:"bold",
//     textAlign:"center"
//   }

// });
import { View, Text, StyleSheet } from "react-native";
import AdminLayout from "../components/AdminLayout";

export default function Dashboard() {

  return (

    <AdminLayout>

      <View style={styles.container}>

        <Text style={styles.title}>
          Admin Dashboard
        </Text>

        <Text style={styles.text}>
          Select options from the sidebar
        </Text>

      </View>

    </AdminLayout>

  );
}


const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#fff",
    justifyContent:"center",
    alignItems:"center"
  },

  title:{
    fontSize:28,
    fontWeight:"bold"
  },

  text:{
    fontSize:16,
    marginTop:10
  }

});