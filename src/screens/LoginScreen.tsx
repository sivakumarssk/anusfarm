import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
 
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const LoginScreen = () => {

  const navigation = useNavigation<any>();

  const [phoneNumber, setPhoneNumber] = useState('');

  const [error, setError] = useState('');

  const handleSendOtp = () => {

    Keyboard.dismiss();

    if (phoneNumber.length !== 10) {

      setError('Enter valid mobile number');

      return;

    }

    setError('');

    navigation.navigate('OtpVerify', {
      phoneNumber,
    });

  };

  return (
<View style={{ flex: 1, backgroundColor: '#fff' }}>
    <TouchableWithoutFeedback
      onPress={()=>Keyboard.dismiss()}
    >

      <KeyboardAvoidingView
        style={{ flex: 1,
          backgroundColor: '#fff',
         }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >

        <SafeAreaView style={styles.container}>

          <View style={styles.loginContainer}>

            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.loginLogo}
              resizeMode="contain"
            />

            <Text style={styles.welcomeText}>
              Welcome to Anu's Farm
            </Text>

            <Text style={styles.mobileLabel}>
              Mobile Number
            </Text>

            <View style={styles.inputContainer}>

              <Text style={styles.countryCode}>
                +91
              </Text>

              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => {

                  const numericText =
                    text.replace(/[^0-9]/g, '');

                  setPhoneNumber(numericText);

                  setError('');

                }}
                maxLength={10}
              />

            </View>

            {
              error ? (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              ) : null
            }

            <TouchableOpacity
              style={styles.otpButton}
              onPress={handleSendOtp}
            >

              <Text style={styles.otpButtonText}>
                Send OTP →
              </Text>

            </TouchableOpacity>

            <Text style={styles.termsText}>
              By continuing, you agree to our
              <Text style={styles.greenText}>
                {' '}Terms of Service{' '}
              </Text>
              &
              <Text style={styles.greenText}>
                {' '}Privacy Policy
              </Text>
            </Text>

          </View>

        </SafeAreaView>

      </KeyboardAvoidingView>

    </TouchableWithoutFeedback>
    </View>

  );
};

export default LoginScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  loginContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: height * 0.06,
  },

  loginLogo: {
    width: 190,
    height: 210,
    marginBottom: 15,
  },

  welcomeText: {
    fontSize: 38,
    fontWeight: '700',
    color: '#3A2418',
    textAlign: 'center',
    marginBottom: 40,
  },

  mobileLabel: {
    width: '100%',
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },

  inputContainer: {
    width: '100%',
    height: 58,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 10,
  },

  countryCode: {
    fontSize: 16,
    color: '#000',
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  errorText: {
    width: '100%',
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
  },

  otpButton: {
    width: '100%',
    height: 58,
    backgroundColor: '#000',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },

  otpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  termsText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  greenText: {
    color: '#1E7D4D',
    fontWeight: '500',
  },

});