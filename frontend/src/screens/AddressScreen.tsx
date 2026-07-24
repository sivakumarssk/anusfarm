import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useNavigation,
} from '@react-navigation/native';

import { Ionicons }
from '@expo/vector-icons';

const addresses = [
  {
    id: 1,
    type: 'Home',
    address:
      '1-49/6, Old National Highway 9, Opposite Ranga Theatre, Azad Nagar, Kodad - 508206.',
    phone: '+91 6985741230',
  },
  {
    id: 2,
    type: 'Work',
    address:
      '1-49/6, Old National Highway 9, Opposite Ranga Theatre, Azad Nagar, Kodad - 508206.',
    phone: '+91 6985741230',
  },
  {
    id: 3,
    type: 'Other',
    address:
      '1-49/6, Old National Highway 9, Opposite Ranga Theatre, Azad Nagar, Kodad - 508206.',
    phone: '+91 6985741230',
  },
];

const AddressScreen = () => {

  const navigation =
    useNavigation<any>();

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        {/* Header */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#000"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Address
          </Text>

        </View>

        {/* Address Cards */}

        {addresses.map(item => (

          <View
            key={item.id}
            style={styles.addressCard}
          >

            <View style={styles.row}>

              <View style={styles.leftSection}>

                <View
                  style={styles.iconCircle}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color="#0A8A2A"
                  />
                </View>

                <View style={{ flex: 1 }}>

                  <Text style={styles.type}>
                    {item.type}
                  </Text>

                  <Text style={styles.address}>
                    {item.address}
                  </Text>

                  <Text style={styles.phone}>
                    {item.phone}
                  </Text>

                </View>

              </View>

              <TouchableOpacity>

                <Text style={styles.edit}>
                  Edit
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        ))}

        {/* Add Address */}

        <TouchableOpacity
          style={styles.addButton}
        >

          <Text style={styles.addButtonText}>
            Add New Address
          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>

  );
};

export default AddressScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12,
  },

  addressCard: {
    backgroundColor: '#FFFFFF',

    marginHorizontal: 16,
    marginBottom: 12,

    borderRadius: 16,

    padding: 16,

    borderWidth: 1,
    borderColor: '#E5E5E5',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,

    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  leftSection: {
    flexDirection: 'row',
    flex: 1,
  },

  iconCircle: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: '#E8F5E9',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 6,
  },

  address: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },

  phone: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },

  edit: {
    fontSize: 14,
    color: '#0A8A2A',
    fontWeight: '500',
  },

  addButton: {
    height: 52,

    backgroundColor: '#000',

    borderRadius: 10,

    marginHorizontal: 16,
    marginTop: 220,
    marginBottom: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

});