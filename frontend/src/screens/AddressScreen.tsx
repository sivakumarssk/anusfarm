import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "../config/api";
import CustomAlert from "../components/CustomAlert";

interface Address {
  id: number;
  address_type: string;
  full_address: string;
  phone: string;
  latitude: string;
  longitude: string;
}

const AddressScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();

  // Receive instant-buy or subscription data
  const { items, type, fromSubscription } = route.params || {};

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  // CUSTOM ALERT STATE
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const showCustomAlert = (title: string, message = "") => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeCustomAlert = () => {
    setAlertVisible(false);
  };

  // FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        `${API_URL}/api/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.log("FETCH ADDRESSES ERROR:", error);
      showCustomAlert(
        "Error",
        "Unable to load addresses. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

 
// const handleContinue = () => {
//   if (!selectedAddress) {
//     showCustomAlert(
//       "Select Address",
//       "Please select an address before continuing."
//     );
//     return;
//   }

//   // Opened from Home: return to Home
//   // if (route.params?.fromHome === true) {
//   //   navigation.goBack();
//   //   return;
//   // }
//   if (route.params?.fromHome === true) {
//   navigation.goBack();

//   // Return the selected address to the previous screen
//   navigation.getParent()?.emit({
//     type: "addressSelected",
//     data: selectedAddress.full_address,
//   });

//   return;
// }

//   // Existing subscription flow
//   if (fromSubscription) {
//     navigation.navigate("SubscribePayment", {
//       address: selectedAddress,
//     });
//     return;
//   }

//   // Existing Instant Buy flow
//   navigation.navigate("InstantBuyPayment", {
//     address: selectedAddress,
//     items,
//     type,
//   });
// };

const handleContinue = async () => {
  if (!selectedAddress) {
    showCustomAlert(
      "Select Address",
      "Please select an address before continuing."
    );
    return;
  }

  

// if (route.params?.fromHome === true) {
//   await AsyncStorage.setItem(
//     "selectedAddress",
//     selectedAddress.full_address
//   );

//   route.params?.onSelectAddress?.(selectedAddress.full_address);
//   navigation.goBack();
//   return;
// }


if (route.params?.fromHome === true) {
  const token = await AsyncStorage.getItem("token");

  await axios.put(
    `${API_URL}/api/addresses/selected`,
    { addressId: selectedAddress.id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  await AsyncStorage.setItem(
    "selectedAddress",
    selectedAddress.full_address
  );

  route.params?.onSelectAddress?.(selectedAddress.full_address);
  navigation.goBack();
  return;
}




  if (fromSubscription) {
    navigation.navigate("SubscribePayment", {
      address: selectedAddress,
    });
    return;
  }

  navigation.navigate("InstantBuyPayment", {
    address: selectedAddress,
    items,
    type,
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Address</Text>
        </View>

        {/* LOADING */}
        {loading && (
          <Text style={styles.message}>Loading...</Text>
        )}

        {/* EMPTY STATE */}
        {addresses.length === 0 && !loading && (
          <Text style={styles.message}>
            No Address Found
          </Text>
        )}

        {/* ADDRESS LIST */}
        {addresses.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.addressCard,
              selectedAddress?.id === item.id &&
                styles.selectedAddressCard,
            ]}
            onPress={() => setSelectedAddress(item)}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <View style={styles.leftSection}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#0A8A2A"
                  />
                </View>

                <View style={styles.addressDetails}>
                  <Text style={styles.type}>
                    {item.address_type}
                  </Text>

                  <Text style={styles.address}>
                    {item.full_address}
                  </Text>

                  <Text style={styles.phone}>
                    {item.phone}
                  </Text>
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
        ))}

        {/* CONTINUE BUTTON */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            Continue
          </Text>
        </TouchableOpacity>

        {/* ADD NEW ADDRESS */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddAddress")}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            Add New Address
          </Text>
        </TouchableOpacity>
      </ScrollView>

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

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    marginLeft: 12,
    color: "#000",
  },

  addressCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  selectedAddressCard: {
    borderColor: "#0A8A2A",
    borderWidth: 2,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  addressDetails: {
    flex: 1,
  },

  type: {
    fontSize: 13,
    fontFamily: "Inter-SemiBold",
    color: "#000",
  },

  address: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
    fontFamily: "Inter-Regular",
  },

  phone: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },

  edit: {
    color: "#0A8A2A",
    fontFamily: "Inter-Medium",
  },

  addButton: {
    height: 52,
    backgroundColor: "#000",
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },

  message: {
    textAlign: "center",
    marginTop: 40,
    color: "#666",
    fontFamily: "Inter-Regular",
  },
});
