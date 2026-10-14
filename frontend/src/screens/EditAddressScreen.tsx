// import React, { useState } from "react";

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
// } from "react-native";

// import {
//   SafeAreaView,
// } from "react-native-safe-area-context";

// import {
//   useNavigation,
//   useRoute,
// } from "@react-navigation/native";

// import axios from "axios";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { API_URL } from "../config/api";


// const EditAddressScreen = () => {

//   const navigation = useNavigation<any>();

//   const route = useRoute<any>();


//   // Address received from AddressScreen
//   const { address } = route.params;


//   // ================================
//   // FORM STATE
//   // ================================

//   const [type, setType] = useState(
//     address.address_type || ""
//   );

//   const [fullAddress, setFullAddress] = useState(
//     address.full_address || ""
//   );

//   const [phone, setPhone] = useState(
//     address.phone || ""
//   );

//   const [loading, setLoading] = useState(false);


//   // ================================
//   // UPDATE ADDRESS
//   // ================================

//   const handleUpdate = async () => {

//     if (!fullAddress.trim()) {

//       Alert.alert(
//         "Error",
//         "Please enter address"
//       );

//       return;
//     }
// if (fullAddress.trim().length < 15) {
//   Alert.alert(
//     "Incomplete Address",
//     "Please enter your complete address.\n\nExample: H.No, Street/Area, Kodad, Telangana, Pincode"
//   );
//   return;
// }

//     if (!phone.trim()) {

//       Alert.alert(
//         "Error",
//         "Please enter phone number"
//       );

//       return;
//     }


//     try {

//       setLoading(true);


//       const token =
//         await AsyncStorage.getItem("token");


//       console.log(
//         "EDIT ADDRESS ID:",
//         address.id
//       );

//       console.log(
//         "EDIT ADDRESS DATA:",
//         {
//           type,
//           address: fullAddress,
//           phone,
//           latitude: address.latitude,
//           longitude: address.longitude,
//         }
//       );


//       const response = await axios.put(

//         `${API_URL}/api/addresses/${address.id}`,

//         {
//           type: type,

//           address: fullAddress,

//           phone: phone,

//           latitude: address.latitude,

//           longitude: address.longitude,
//         },

//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }

//       );


//       console.log(
//         "UPDATE ADDRESS RESPONSE:",
//         response.data
//       );


//       if (response.data?.success) {

//         Alert.alert(
//           "Success",
//           "Address updated successfully",
//           [
//             {
//               text: "OK",

//               onPress: () => {

//                 navigation.goBack();

//               },
//             },
//           ]
//         );

//       }

//     } catch (error: any) {

//       console.log(
//         "UPDATE ADDRESS ERROR:",
//         error?.response?.data ||
//         error?.message ||
//         error
//       );


//       Alert.alert(
//         "Error",
//         error?.response?.data?.message ||
//         "Failed to update address"
//       );

//     } finally {

//       setLoading(false);

//     }

//   };


//   // ================================
//   // UI
//   // ================================

//   return (

//     <SafeAreaView
//       style={styles.container}
//     >

//       {/* HEADER */}

//       <View style={styles.header}>

//         <TouchableOpacity
//           onPress={() =>
//             navigation.goBack()
//           }
//         >

//           <Text style={styles.back}>
//             ←
//           </Text>

//         </TouchableOpacity>


//         <Text style={styles.title}>
//           Edit Address
//         </Text>

//       </View>


//       {/* FORM */}

//       <View style={styles.form}>


//         {/* ADDRESS TYPE */}

//         <Text style={styles.label}>
//           Address Type
//         </Text>

//         <TextInput
//           style={styles.input}
//           value={type}
//           onChangeText={setType}
//           placeholder="Home / Office"
//         />


//         {/* ADDRESS */}

//         <Text style={styles.label}>
//           Full Address
//         </Text>

//         <TextInput
//           style={[
//             styles.input,
//             styles.addressInput,
//           ]}
//           value={fullAddress}
//           onChangeText={setFullAddress}
//           placeholder="Enter full address"
//           multiline
//         />


//         {/* PHONE */}

//         <Text style={styles.label}>
//           Phone
//         </Text>

//         <TextInput
//           style={styles.input}
//           value={phone}
//           onChangeText={setPhone}
//           placeholder="Enter phone number"
//           keyboardType="phone-pad"
//         />


//         {/* UPDATE */}

//         <TouchableOpacity
//           style={styles.saveButton}
//           onPress={handleUpdate}
//           disabled={loading}
//         >

//           <Text style={styles.saveText}>

//             {loading
//               ? "Updating..."
//               : "Update Address"}

//           </Text>

//         </TouchableOpacity>


//       </View>

//     </SafeAreaView>

//   );

// };


// export default EditAddressScreen;


// // ======================================================
// // STYLES
// // ======================================================

// const styles = StyleSheet.create({

//   container: {
//     flex: 1,
//     backgroundColor: "#F8F8F8",
//   },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     marginBottom: 20,
//   },

//   back: {
//   fontSize: 28,
//   color: "#000",
//   fontFamily: "Inter-Regular",
// },

//   title: {
//   fontSize: 15,
//   fontFamily: "Inter-SemiBold",
//   marginLeft: 15,
//   color: "#000",
// },

//   form: {
//     paddingHorizontal: 16,
//   },

//   label: {
//   fontSize: 14,
//   fontFamily: "Inter-SemiBold",
//   color: "#000",
//   marginTop: 15,
//   marginBottom: 7,
// },

//  input: {
//   backgroundColor: "#FFF",
//   borderWidth: 1,
//   borderColor: "#DDD",
//   borderRadius: 10,
//   paddingHorizontal: 14,
//   height: 50,
//   fontSize: 13,
//   fontFamily: "Inter-Regular",
// },

//   addressInput: {
//     height: 100,
//     textAlignVertical: "top",
//     paddingTop: 12,
//   },

//   saveButton: {
//     height: 52,
//     backgroundColor: "#000",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 30,
//   },

//   saveText: {
//   color: "#FFF",
//   fontSize: 15,
//   fontFamily: "Inter-SemiBold",
// },

// });

import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";

const EditAddressScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Address received from AddressScreen
  const { address } = route.params;

  // FORM STATE
  const [type, setType] = useState(
    address.address_type || ""
  );

  const [fullAddress, setFullAddress] = useState(
    address.full_address || ""
  );

  const [phone, setPhone] = useState(
    address.phone || ""
  );

  const [loading, setLoading] = useState(false);

  // CUSTOM ALERT STATE
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertAction, setAlertAction] = useState<"none" | "back">("none");

  const showCustomAlert = (
    title: string,
    message = "",
    action: "none" | "back" = "none"
  ) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertAction(action);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    const action = alertAction;

    setAlertVisible(false);
    setAlertAction("none");

    if (action === "back") {
      navigation.goBack();
    }
  };

  // UPDATE ADDRESS
  const handleUpdate = async () => {
    if (!fullAddress.trim()) {
      showCustomAlert("Error", "Please enter address");
      return;
    }

    if (fullAddress.trim().length < 15) {
      showCustomAlert(
        "Incomplete Address",
        "Please enter your complete address.\n\nExample: H.No, Street/Area, Kodad, Telangana, Pincode"
      );
      return;
    }

    if (!phone.trim()) {
      showCustomAlert("Error", "Please enter phone number");
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      console.log("EDIT ADDRESS ID:", address.id);

      console.log("EDIT ADDRESS DATA:", {
        type,
        address: fullAddress,
        phone,
        latitude: address.latitude,
        longitude: address.longitude,
      });

      const response = await axios.put(
        `${API_URL}/api/addresses/${address.id}`,
        {
          type: type,
          address: fullAddress,
          phone: phone,
          latitude: address.latitude,
          longitude: address.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "UPDATE ADDRESS RESPONSE:",
        response.data
      );

      if (response.data?.success) {
        showCustomAlert(
          "Success",
          "Address updated successfully",
          "back"
        );
      } else {
        showCustomAlert(
          "Error",
          response.data?.message || "Failed to update address"
        );
      }
    } catch (error: any) {
      console.log(
        "UPDATE ADDRESS ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      showCustomAlert(
        "Error",
        error?.response?.data?.message ||
          "Failed to update address"
      );
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Edit Address</Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        {/* ADDRESS TYPE */}
        <Text style={styles.label}>Address Type</Text>

        <TextInput
          style={styles.input}
          value={type}
          onChangeText={setType}
          placeholder="Home / Office"
          placeholderTextColor="#999"
        />

        {/* ADDRESS */}
        <Text style={styles.label}>Full Address</Text>

        <TextInput
          style={[styles.input, styles.addressInput]}
          value={fullAddress}
          onChangeText={setFullAddress}
          placeholder="Enter full address"
          placeholderTextColor="#999"
          multiline
        />

        {/* PHONE */}
        <Text style={styles.label}>Phone</Text>

        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        {/* UPDATE BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleUpdate}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>
            {loading ? "Updating..." : "Update Address"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* CUSTOM ALERT */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeCustomAlert}
      />
    </SafeAreaView>
  );
};

export default EditAddressScreen;

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
  },

  back: {
    fontSize: 28,
    color: "#000",
    fontFamily: "Inter-SemiBold",
  },

  title: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    marginLeft: 15,
    color: "#000",
  },

  form: {
    paddingHorizontal: 16,
  },

  label: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
    color: "#000",
    marginTop: 15,
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#000",
  },

  addressInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },

  saveButton: {
    height: 52,
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveText: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
  },
});