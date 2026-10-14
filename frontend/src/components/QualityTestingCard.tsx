import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

const QualityTestingCard = () => {

  return (

    <View style={styles.container}>

      <View style={styles.headerRow}>

        <Ionicons
          name="checkmark-circle"
          size={16}
          color="#15803D"
        />

        <Text style={styles.heading}>
          Safe. Tested. Trusted.
        </Text>

      </View>

      <Text style={styles.description}>
        Every batch is tested. Every packet is pure. That's
      </Text>

      <Text style={styles.description}>
        how much we care.
      </Text>

      <Text style={styles.linkText}>
        Learn more about our quality & testing.
      </Text>

    </View>

  );

};

export default QualityTestingCard;

// const styles = StyleSheet.create({

//   container: {
//     backgroundColor: '#DDF5E4',
//     borderRadius: 12,
//     padding: 20,
//     marginTop: 14,
//     marginBottom: 0,
//   },

//   headerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },

//   heading: {
//     marginLeft: 6,
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     color: '#000',
//   },

//   description: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#4B5563',
//     lineHeight: 18,
//   },

//   linkText: {
//     marginTop: 12,
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#000',
//     textDecorationLine: 'underline',
//   },

// });

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0FAF3",
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#D9EEDC",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
  },

  heading: {
    marginLeft: 7,
    fontSize: 15,
    fontFamily: "Inter-SemiBold",
    color: "#111",
  },

  description: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#555",
    lineHeight: 18,
  },

  linkText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: "Inter-SemiBold",
    color: "#2E7D32",
    textDecorationLine: "underline",
  },
});