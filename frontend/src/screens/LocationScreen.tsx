import React, { useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage
from '@react-native-async-storage/async-storage';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Alert
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

const LocationScreen = () => {

 

  const getCurrentLocation = async () => {
    setLoading(true);

  try {

    // Check if location service is enabled

    const enabled =
      await Location.hasServicesEnabledAsync();

   if (!enabled) {

  Alert.alert(
    'Location Disabled',
    'Please enable location services'
  );

  return;
}

    // Ask permission

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {

      alert(
        'Location permission denied'
      );

      return;
    }

    // Get current location

    const location =
      await Location.getCurrentPositionAsync({
        accuracy:
          Location.Accuracy.High,
      });

      setLatitude(
  location.coords.latitude
);

setLongitude(
  location.coords.longitude
);

      const addressData =
  await Location.reverseGeocodeAsync({
    latitude:
      location.coords.latitude,

    longitude:
      location.coords.longitude,
  });

  if (addressData.length > 0) {

  const place = addressData[0];

  const fullAddress = [
    place.street,
    place.district,
    place.city,
  ]
    .filter(Boolean)
    .join(', ');

  setAddress(fullAddress);
}


  console.log(addressData);

    console.log(
      'Latitude:',
      location.coords.latitude
    );

    console.log(
      'Longitude:',
      location.coords.longitude
    );
   setLoading(false);

  } catch (error) {
    setLoading(false);

    console.log(error);

  }

};

const serviceableAreas = [
  'Bolarum',
  'Kompally',
  'Nizampet',
];

const handleConfirmLocation = async () => {

  if (!address.trim()) {

    Alert.alert(
      'Location Required',
      'Please select a location first'
    );

    return;
  }

  try {

    await AsyncStorage.setItem(
      'userLocation',

      JSON.stringify({
        address,
        latitude,
        longitude,
      })
    );

    Alert.alert(
      'Success',
      'Location Saved Successfully'
    );

    const data =
 await AsyncStorage.getItem(
   'userLocation'
 );

console.log(data);

  const isDeliverable =
  serviceableAreas.some(area =>
    address.includes(area)
  );

if (isDeliverable) {

  navigation.navigate('HomeScreen');

} else {

  navigation.navigate(
    'LocationUnavailable'
  );

}

  } catch (error) {

    console.log(error);

    Alert.alert(
      'Error',
      'Unable to save location'
    );

  }

};


  const navigation = useNavigation<any>();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const [latitude, setLatitude] =
  useState<number | null>(null);

const [longitude, setLongitude] =
  useState<number | null>(null);

  return (

    <TouchableWithoutFeedback
   onPress={() => Keyboard.dismiss()}
    >

    <SafeAreaView style={styles.container}>
        <Pressable
      style={{ flex: 1 }}
     onPress={() => Keyboard.dismiss()}
    >

      {/* Header */}

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

        <Text style={styles.headerTitle}>
          Select Your Location
        </Text>

      </View>

      {/* Description */}

      <Text style={styles.description}>
        Enter your delivery location to check
      </Text>

      <Text style={styles.description}>
        availability and setup your milk delivery.
      </Text>

      {/* Search Box */}

      <View style={styles.searchContainer}>

        <Ionicons
          name="location-outline"
          size={20}
          color="#1A9A3F"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your area, street and landmark"
          placeholderTextColor="#999"
          value={address}
          onChangeText={setAddress}
        />

        <Ionicons
          name="locate"
          size={20}
          color="#1A9A3F"
        />

      </View>

      {/* Map */}

      <Image
        source={require('../../assets/images/location1.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Current Location Card */}

  <TouchableOpacity
  style={styles.locationCard}
  onPress={getCurrentLocation}
  disabled={loading}
>

        <View style={styles.leftSection}>

          <View style={styles.iconCircle}>

            <Ionicons
              name="location"
              size={18}
              color="#1A9A3F"
            />

          </View>

          <View>

            <Text style={styles.locationTitle}>
  {
    loading
      ? 'Fetching location...'
      : 'Use my current location'
  }
</Text>

            <Text style={styles.locationSubtitle}>
              Detect your location automatically
            </Text>

          </View>

        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#000"
        />

      </TouchableOpacity>

      {/* Button */}

<TouchableOpacity
  style={[
    styles.button,
    !address && styles.disabledButton,
  ]}
  onPress={handleConfirmLocation}
  disabled={!address}
>

        <Text style={styles.buttonText}>
          Confirm Location
        </Text>

      </TouchableOpacity>
      </Pressable>

    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },

header: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 45,
  marginBottom: 10,
},

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 24,
  },

 description: {
  textAlign: 'center',
  color: '#777',
  fontSize: 14,
  lineHeight: 18,
},
  searchContainer: {
    marginTop: 25,
    backgroundColor: '#FFF',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  input: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 13,
  },

  mapImage: {
    width: '100%',
    height: 320,
    borderRadius: 40,
    marginTop: 14,
  },

  locationCard: {
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E9F8ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  locationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },

  locationSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
  },

  button: {
    marginTop: 50,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#0A8F2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
  opacity: 0.5,
},

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

});