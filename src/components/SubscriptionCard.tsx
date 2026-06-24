import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const SubscriptionCard = () => {

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const handlePreviousDate = () => {

    const previousDate =
      new Date(selectedDate);

    previousDate.setDate(
      previousDate.getDate() - 1
    );

    setSelectedDate(previousDate);

  };

  const handleNextDate = () => {

    const nextDate =
      new Date(selectedDate);

    nextDate.setDate(
      nextDate.getDate() + 1
    );

    setSelectedDate(nextDate);

  };

  const formattedDate =
  selectedDate.toLocaleDateString(
    'en-GB',
    {
      day: 'numeric',
      month: 'short',
    }
  );

const formattedTime =
  new Date().toLocaleTimeString(
    'en-IN',
    {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }
  );

  return (

    <View style={styles.wrapper}>

      {/* LEFT ARROW */}

      <TouchableOpacity
        style={[
          styles.arrowButton,
          styles.leftArrow,
        ]}
        onPress={handlePreviousDate}
      >

        <Text style={styles.arrowText}>
          ‹
        </Text>

      </TouchableOpacity>

      {/* CARD */}

      <View style={styles.container}>

        {/* HEADER */}

        <View style={styles.headerContainer}>

       <Text style={styles.headerText}>
  Orders for {formattedDate}
  {' '}
  (Update by {formattedTime})
</Text>

        </View>

        {/* DELIVERY TEXT */}

        <View style={styles.deliveryContainer}>

          <Text style={styles.deliveryText}>
            No Scheduled deliveries
          </Text>

        </View>

        {/* BUTTONS */}

        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={styles.button}
          >

            <Text style={styles.buttonText}>
              Pause Orders
            </Text>

          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.button}
          >

            <Text style={styles.buttonText}>
              Add Items
            </Text>

          </TouchableOpacity>

        </View>

      </View>

      {/* RIGHT ARROW */}

      <TouchableOpacity
        style={[
          styles.arrowButton,
          styles.rightArrow,
        ]}
        onPress={handleNextDate}
      >

        <Text style={styles.arrowText}>
          ›
        </Text>

      </TouchableOpacity>

    </View>

  );

};

export default SubscriptionCard;

const styles = StyleSheet.create({

  wrapper: {
    marginTop: 12,
    position: 'relative',
    justifyContent: 'center',
  },

  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },

  headerContainer: {
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: 'center',
  },

  headerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    lineHeight: 18,
  },

  deliveryContainer: {
    paddingBottom: 12,
    alignItems: 'center',
  },

  deliveryText: {
    fontSize: 12,
    color: '#B0B0B0',
    fontWeight: '400',
  },

 buttonRow: {
  flexDirection: 'row',
  borderTopWidth: 1.2,
  borderTopColor: '#D0D0D0',
  height: 48,
},

  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

divider: {
  width: 1,
  backgroundColor: '#D0D0D0',
},

  buttonText: {
  fontSize: 14,
  color: '#222',
  fontWeight: '500',
},

  arrowButton: {
    position: 'absolute',
    top: '38%',
    zIndex: 100,
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  leftArrow: {
    left: -10,
  },

  rightArrow: {
    right: -10,
  },

  arrowText: {
    fontSize: 18,
    color: '#555',
    marginTop: -2,
  },

});