import React, { useEffect, useRef, useState, } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View,Text,TouchableOpacity,TextInput,StyleSheet,Alert,Keyboard,TouchableWithoutFeedback,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation,useRoute,} from '@react-navigation/native';

const OtpVerifyScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['','','','','','',]);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const inputRefs = useRef<any>([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendVisible(true);
    }
    return () => clearInterval(interval);
  }, [timer]);
  /* ---------------- RESEND OTP ---------------- */
  const handleResendOtp = () => {
    setTimer(30);
    setIsResendVisible(false);
  };

  /* ---------------- OTP INPUT ---------------- */
  const handleOtpChange = (
    text: string,
    index: number
  ) => {
    if (!/^[0-9]?$/.test(text)) {
      return;
    }
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);
    setError('');
    /* MOVE FORWARD */
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    /* MOVE BACKWARD */
  };

  /* ---------------- VERIFY ---------------- */
  const handleVerify = async () => {
  Keyboard.dismiss();
  const enteredOtp = otp.join("");
  if (enteredOtp.length !== 6) {
    setError("Please enter complete OTP");
    return;
  }
  try {
    const response = await fetch(
     "http://192.168.0.112:5000/api/auth/verify-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          otp: enteredOtp,
        }),
      }
    );
    const data = await response.json();
    console.log("Verify OTP:", data);
    if (data.success) {
      // Save JWT token
      await AsyncStorage.setItem(
        "token",
        data.token
      );
      // Save login status
      await AsyncStorage.setItem(
        "isLoggedIn",
        "true"
      );
      Alert.alert(
        "Success",
        "OTP Verified Successfully"
      );
      navigation.navigate("Location");
    } else {
      setError(data.message);
    }
  } catch (error) {
    console.log("Verify OTP Error:", error);
    Alert.alert(
      "Error",
      "Unable to verify OTP"
    );
  }
};
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}>

      <SafeAreaView style={styles.container}>
        <View style={styles.mainContainer}>

          {/* BACK */}
          <TouchableOpacity
            style={styles.backContainer}
            onPress={() => navigation.goBack()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
              style={{
                marginLeft: 10
              }} />
            <Text style={styles.backText}>
              Verify Number
            </Text>
          </TouchableOpacity>
          {/* HEADING */}
          <Text style={styles.heading}>
            Verify Your Number
          </Text>
          <Text style={styles.subText}>
            Enter the 6-digit code sent to
          </Text>
          <Text style={styles.mobileText}>
            +91 {phoneNumber}
          </Text>

          {/* OTP */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) =>
                  handleOtpChange(text, index)
                }
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === 'Backspace' &&
                    otp[index] === '' &&
                    index > 0
                  ) {
                    inputRefs.current[index - 1]?.focus();
                  }
                }}/>
            ))}
          </View>
          {/* ERROR */}
          {
            error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null
          }
          {/* RESEND */}
          {
            isResendVisible ? (
              <TouchableOpacity
                onPress={handleResendOtp}>
                <Text style={styles.resendButtonText}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.resendText}>
                Resend OTP in 00:
                {timer < 10 ? `0${timer}` : timer}
              </Text>
            )
          }
          {/* VERIFY BUTTON */}
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}>
            <Text style={styles.verifyText}>
              Verify
            </Text>
          </TouchableOpacity>
          {/* EDIT */}

          <TouchableOpacity
            onPress={() => navigation.goBack()}>
            <Text style={styles.editText}>
              Edit phone number
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default OtpVerifyScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 30,
  },

  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 55,
    marginLeft: -26,
  },

  arrow: {
    fontSize: 34,
    color: '#000',
    fontWeight: '700',
    marginRight: 4,
    marginTop: -10,
  },

  backText: {
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
    marginLeft: 10
  },

  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3A2418',
    marginBottom: 12,
    textAlign: 'center',
  },

  subText: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginBottom: 8,
  },

  mobileText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 45,
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
    borderColor: '#D9D9D9',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 22,
    color: '#000',
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },

  resendText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 45,
    fontSize: 15,
  },

  resendButtonText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 45,
  },

  verifyButton: {
    width: '100%',
    height: 58,
    backgroundColor: '#000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  verifyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  editText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },

});