import React, { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomAlert from '../components/CustomAlert';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { API_URL } from '../config/api';

const OtpVerifyScreen = () => {

  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { phoneNumber } = route.params;

  const [name, setName] = useState('');
  const [otp, setOtp] = useState([
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResendVisible, setIsResendVisible] =
    useState(false);
const [alertVisible, setAlertVisible] = useState(false);
const [alertTitle, setAlertTitle] = useState('');
const [alertMessage, setAlertMessage] = useState('');
const [navigateAfterAlert, setNavigateAfterAlert] = useState(false);

const showCustomAlert = (
  title: string,
  message: string,
  navigate = false
) => {
  setAlertTitle(title);
  setAlertMessage(message);
  setNavigateAfterAlert(navigate);
  setAlertVisible(true);
};

const closeCustomAlert = () => {
  setAlertVisible(false);

  if (navigateAfterAlert) {
    setNavigateAfterAlert(false);
    navigation.navigate('Location');
  }
};
  const inputRefs = useRef<any>([]);

  useEffect(() => {

    let interval: any;

    if (timer > 0) {

      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);

    } else {

      setIsResendVisible(true);

    }

    return () => clearInterval(interval);

  }, [timer]);

  const handleOtpChange = (
    text: string,
    index: number
  ) => {

    if (!/^[0-9]?$/.test(text)) {
      return;
    }

    const updated = [...otp];

    updated[index] = text;

    setOtp(updated);
    setError('');

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {

    Keyboard.dismiss();

    const enteredOtp = otp.join('');

    if (!name) {
      setError('Please enter your name');
      return;
    }

    if (enteredOtp.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    try {

      console.log('Calling API...');

      const response = await fetch(
        `${API_URL}/api/auth/verify-otp`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: name,
            phone: phoneNumber,
            otp: enteredOtp,
          }),
        }
      );

      const data = await response.json();

      console.log('Verify OTP:', data);


// if (data.success) {
  
//  // Remove the previous user's saved location
// // Clear only cached data from the device.
// // The selected address is saved in the backend per user.
// await AsyncStorage.removeItem("selectedAddress");
// await AsyncStorage.removeItem("userLocation");
// await AsyncStorage.removeItem("userName");

// // Save the current user's login details
// await AsyncStorage.setItem("token", data.token);
// await AsyncStorage.setItem("userId", String(data.user.id));
// await AsyncStorage.setItem("isLoggedIn", "true");
// await AsyncStorage.setItem("userName", data.user?.name || name);
 
// const addressResponse = await fetch(
//   `${API_URL}/api/addresses`,
//   {
//     method: "GET",
//     headers: {
//       Authorization: `Bearer ${data.token}`,
//     },
//   }
// );

// const addressData = await addressResponse.json();

// console.log("SAVED ADDRESSES:", addressData);

// if (
//   !addressResponse.ok ||
//   !Array.isArray(addressData.addresses)
// ) {
//   setError("Unable to load saved addresses. Please try again.");
//   return;
// }

// if (addressData.addresses.length === 0) {
//   // No saved addresses: ask the user to add a location
//   navigation.reset({
//     index: 0,
//     routes: [{ name: "Location" }],
//   });
// } else {
//   // Addresses exist: Home will fetch the selected address
//   // from the backend, or use the first address if none is selected.
//   navigation.reset({
//     index: 0,
//     routes: [{ name: "GuestHome" }],
//   });
// }
// }
if (data.success){

const userId = String(data.user.id);

// Save login details
await AsyncStorage.setItem("token", data.token);
await AsyncStorage.setItem("userId", userId);
await AsyncStorage.setItem("isLoggedIn", "true");
await AsyncStorage.setItem("userName", data.user?.name || name);

// Check selected address for this user
const selectedResponse = await fetch(
  `${API_URL}/api/addresses/selected`,
  {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  }
);

const selectedData = await selectedResponse.json();

// Check normal location saved for this user
const locationResponse = await fetch(
  `${API_URL}/api/location`,
  {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  }
);

const locationData = await locationResponse.json();

// Check this user's saved addresses
const addressResponse = await fetch(
  `${API_URL}/api/addresses`,
  {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  }
);

const addressData = await addressResponse.json();

if (!addressResponse.ok || !Array.isArray(addressData.addresses)) {
  setError("Unable to load saved addresses. Please try again.");
  return;
}

const localLocation = await AsyncStorage.getItem(
  `userLocation_${userId}`
);

const hasSelectedAddress =
  selectedResponse.ok &&
  selectedData.success &&
  !!selectedData.address;

const hasNormalLocation =
  locationResponse.ok &&
  locationData.success &&
  !!(
    locationData.location?.address ||
    locationData.location?.full_address
  );

const hasSavedAddress = addressData.addresses.length > 0;

if (
  hasSelectedAddress ||
  hasNormalLocation ||
  hasSavedAddress ||
  localLocation
) {
  // Existing user: don't ask for location again
  navigation.reset({
    index: 0,
    routes: [{ name: "GuestHome" }],
  });
} else {
  // New user: ask for location
  navigation.reset({
    index: 0,
    routes: [{ name: "Location" }],
  });
}
}
      else {

        setError(data.message);

      }

    } catch (error) {

      console.log(error);

      showCustomAlert(
  'Error',
  'Unable to verify OTP'
);
    }
  };

  return (

    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
    >

      <SafeAreaView style={styles.container}>

        <View style={styles.mainContainer}>

          <TouchableOpacity
            style={styles.backContainer}
            onPress={() => navigation.goBack()}
          >

            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
            />

            <Text style={styles.backText}>
              Verify Number
            </Text>

          </TouchableOpacity>

          <Text style={styles.heading}>
            Verify Your Number
          </Text>

          <Text style={styles.subText}>
            Enter your details
          </Text>

          <TextInput
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            style={styles.nameInput}
            placeholderTextColor="#999"
          />

          <Text style={styles.mobileText}>
            +91 {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>

            {otp.map((digit, index) => (

              <TextInput
                key={index}

                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}

                style={styles.otpInput}

                keyboardType="number-pad"

                maxLength={1}

                value={digit}

                onChangeText={(text) =>
                  handleOtpChange(text, index)
                }

                onKeyPress={({ nativeEvent }) => {

                  if (
                    nativeEvent.key === 'Backspace'
                  ) {

                    if (
                      otp[index] === '' &&
                      index > 0
                    ) {

                      const updated = [...otp];

                      updated[index - 1] = '';

                      setOtp(updated);

                      inputRefs.current[
                        index - 1
                      ]?.focus();

                    }

                  }

                }}
              />

            ))}

          </View>

          {error ? (
            <Text style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          {isResendVisible ? (

            <TouchableOpacity
              onPress={() => {
                setTimer(30);
                setIsResendVisible(false);
              }}
            >

              <Text style={styles.resendButtonText}>
                Resend OTP
              </Text>

            </TouchableOpacity>

          ) : (

            <Text style={styles.resendText}>
              Resend OTP in 00:
              {timer < 10
                ? `0${timer}`
                : timer}
            </Text>

          )}

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
          >

            <Text style={styles.verifyText}>
              Verify
            </Text>

          </TouchableOpacity>

        </View>
<CustomAlert
  visible={alertVisible}
  title={alertTitle}
  message={alertMessage}
  buttonText="OK"
  onClose={closeCustomAlert}
/>
      </SafeAreaView>

    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },

  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },

  backText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    marginLeft: 10,
    color: '#000',
  },

  heading: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#000',
  },

  subText: {
    textAlign: 'center',
    // color: '#777',
    fontFamily: 'Inter-Regular',
    marginBottom: 30,
  },

  nameInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
  },

  mobileText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 30,
    color: '#000',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },

  resendText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 40,
    fontFamily: 'Inter-Regular',
  },

  resendButtonText: {
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },

  verifyButton: {
    height: 58,
    backgroundColor: '#000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  verifyText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },

});

export default OtpVerifyScreen;

