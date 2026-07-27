import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image
} from "react-native";

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AdminLayout from "../../components/AdminLayout";


export default function AddProduct() {


  const [name,setName] = useState("");
  const [price,setPrice] = useState("");
  const [description,setDescription] = useState("");
  const [category_id,setCategoryId] = useState("1");
  const [stock, setStock] = useState("");
  const [image,setImage] = useState<any>(null);
   const [showStock, setShowStock] = useState(false);


  // Select Image

  const pickImage = async()=>{

    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,

        quality:1,

      });


    if(!result.canceled){

      setImage(
        result.assets[0]
      );

    }

  };





  // Add Product API

  const addProduct = async()=>{


    try{


      const formData = new FormData();



      formData.append(
        "name",
        name
      );


      formData.append(
        "price",
        price
      );


      formData.append(
        "category_id",
        category_id
      );


      formData.append(
        "stock",
        stock
      );


      formData.append(
        "description",
        description
      );



      if(image){

        formData.append(
          "image",
          {
            uri:image.uri,
            name:image.fileName || "product.jpg",
            type:"image/jpeg"
          } as any
        );

      }



      const response =
        await fetch(
          "http://192.168.0.112:5000/api/products",
          {
            method:"POST",

            body:formData,

          }
        );



      const data =
        await response.json();



      console.log(data);



      if(data.success){

        alert(
          "Product Added Successfully"
        );


        setName("");
        setPrice("");
        setStock("");
        setDescription("");
        setImage(null);

      }
      else{

        alert(data.message);

      }


    }
    catch(error){

      console.log(error);

      alert(
        "Something went wrong"
      );

    }


  };





  return (

      <AdminLayout>
        
    <View style={styles.container}>


      <Text style={styles.title}>
        Add Product
      </Text>



      <TextInput
        placeholder="Product Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />



      <TextInput
        placeholder="Price"
        keyboardType="numeric"
        style={styles.input}
        value={price}
        onChangeText={setPrice}
      />



      <TextInput
        placeholder="Category ID"
        keyboardType="numeric"
        style={styles.input}
        value={category_id}
        onChangeText={setCategoryId}
      />



      <TextInput
        placeholder="Stock"
        keyboardType="numeric"
        style={styles.input}
        value={stock}
        onChangeText={setStock}
      />



      <TextInput
        placeholder="Description"
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />




      <TouchableOpacity
        style={styles.imageButton}
        onPress={pickImage}
      >

        <Text>
          Select Image
        </Text>

      </TouchableOpacity>




      {
        image &&

        <Image
          source={{
            uri:image.uri
          }}
          style={styles.preview}
        />

      }





      <TouchableOpacity
        style={styles.button}
        onPress={addProduct}
      >

        <Text style={styles.buttonText}>
          Add Product
        </Text>

      </TouchableOpacity>

   <TouchableOpacity
  style={styles.stockButton}
  onPress={() => setShowStock(!showStock)}
>
  <Text style={styles.buttonText}>
    View Stock
  </Text>
</TouchableOpacity>
  
   {showStock && (
  <View style={styles.stockContainer}>
    <Text style={styles.stockTitle}>📦 Stock Details</Text>

    <Text>🥛 Milk Packet - 100 Left</Text>
    <Text>🥣 Curd - 50 Left</Text>
    <Text>🧈 Ghee - 20 Left</Text>
  </View>
)}

    </View>
    </AdminLayout>

  );

}



const styles = StyleSheet.create({


  container:{
    flex:1,
    padding:20,
    justifyContent:"center"
  },


  title:{
    fontSize:28,
    fontWeight:"bold",
    marginBottom:30,
    textAlign:"center"
  },


  input:{
    borderWidth:1,
    borderColor:"#ccc",
    padding:12,
    borderRadius:8,
    marginBottom:15
  },


  imageButton:{
    padding:15,
    backgroundColor:"#ddd",
    borderRadius:8,
    alignItems:"center",
    marginBottom:15
  },


  preview:{
    width:120,
    height:120,
    borderRadius:10,
    marginBottom:15
  },


  button:{
    backgroundColor:"green",
    padding:15,
    borderRadius:8
  },


  buttonText:{
    color:"white",
    textAlign:"center",
    fontSize:18
  },
stockButton: {
  backgroundColor: "#2196F3",
  padding: 15,
  borderRadius: 8,
  marginTop: 15,
},
stockContainer: {
  marginTop: 20,
  padding: 15,
  backgroundColor: "#f5f5f5",
  borderRadius: 8,
},

stockTitle: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 10,
},

});