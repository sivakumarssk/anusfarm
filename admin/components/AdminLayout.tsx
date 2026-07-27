import { View, StyleSheet } from "react-native";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


export default function AdminLayout({children}:any){

return(

<View style={styles.container}>

<Sidebar/>

<View style={styles.main}>

<Navbar/>

<View style={styles.content}>
{children}
</View>

</View>

</View>

)

}


const styles = StyleSheet.create({

container:{
flex:1,
flexDirection:"row"
},

main:{
flex:1
},

content:{
flex:1,
padding:20
}

});