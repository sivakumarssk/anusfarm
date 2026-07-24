import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import {
  Ionicons,
} from '@expo/vector-icons';

const LocationUnavailableScreen = () => {

  const navigation = useNavigation<any>();

  return (

    <SafeAreaView style={styles.container}>

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
          Check Your Location
        </Text>

      </View>

      {/* Description */}

      <Text style={{
         textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 18,
      }}>
        We deliver fresh milk to our customers
      </Text>

      <Text style={styles.description}>
        in selected locations only.
      </Text>

      {/* Image */}

      <Image
        source={require('../../assets/images/location-unavailable.png')}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Title */}

      <Text style={{
        textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginTop:10
      }}>
        Delivery is not available
      </Text>

      <Text style={styles.title}>
        in this location
      </Text>

      {/* Sub Title */}

      <Text style={{
        textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 15,
      }}>
        Sorry! We currently do not deliver milk in this
      </Text>

      <Text style={styles.subTitle}>
        area. Please change your location.
      </Text>

      {/* Button */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >

        <Ionicons
          name="location-outline"
          size={18}
          color="#FFF"
        />

        <Text style={styles.buttonText}>
          Change Location
        </Text>

      </TouchableOpacity>

    </SafeAreaView>

  );
};

export default LocationUnavailableScreen;

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
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginRight: 24,
  },

  description: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 0,
  },

  image: {
    width: '100%',
    height: 360,
    marginTop: 25,
    borderRadius: 40,
  },

  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
    marginTop:0,
  },

  subTitle: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
    marginTop: 0,
  },

  button: {
    height: 54,
    backgroundColor: '#058F1A',
    borderRadius: 10,
    marginTop: 30,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

});