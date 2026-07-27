import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";
import AdminLayout from "../components/AdminLayout";


export default function LoginScreen() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = () => {


    // Gmail validation
    const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;


    if (!gmailPattern.test(email)) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid Gmail address"
      );
      return;
    }


    // Password validation
    if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must contain minimum 6 characters"
      );
      return;
    }


    // Login success
    Alert.alert(
      "Success",
      "Login successful"
    );


    router.replace("/dashboard");

  };


  return (

    <View style={styles.container}>


      <Text style={styles.title}>
        ANUS FARM
      </Text>


      <Text style={styles.subtitle}>
        Admin Login
      </Text>



      <TextInput

        placeholder="Enter Gmail"

        style={styles.input}

        value={email}

        onChangeText={setEmail}

        keyboardType="email-address"

        autoCapitalize="none"

      />



      <TextInput

        placeholder="Enter Password"

        style={styles.input}

        value={password}

        onChangeText={setPassword}

        secureTextEntry

      />



      <TouchableOpacity

        style={styles.button}

        onPress={handleLogin}

      >

        <Text style={styles.buttonText}>
          LOGIN
        </Text>

      </TouchableOpacity>


    </View>

  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    justifyContent:"center",
    padding:25,
    backgroundColor:"#fff",
  },


  title:{
    fontSize:30,
    fontWeight:"bold",
    textAlign:"center",
    color:"green",
    marginBottom:10,
  },


  subtitle:{
    fontSize:22,
    textAlign:"center",
    marginBottom:40,
  },


  input:{
    borderWidth:1,
    borderColor:"#ccc",
    borderRadius:10,
    padding:14,
    marginBottom:20,
  },


  button:{
    backgroundColor:"green",
    padding:15,
    borderRadius:10,
  },


  buttonText:{
    color:"#fff",
    textAlign:"center",
    fontSize:18,
    fontWeight:"bold",
  },

});