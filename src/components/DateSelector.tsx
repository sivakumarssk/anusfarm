import React, {
  useMemo,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

type Props = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

const DateSelector = ({
  selectedDate,
  onSelectDate,
}: Props) => {

  const dates = useMemo(() => {

  const today = new Date();

  const currentYear =
    today.getFullYear();

  const currentMonth =
    today.getMonth();

  const currentDay =
    today.getDate();

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  return Array.from(
    {
      length:
        daysInMonth -
        currentDay +
        1,
    },
    (_, index) => {

      const day =
        currentDay + index;

      const date = new Date(
        currentYear,
        currentMonth,
        day
      );

      return {
        id: index,
        day,
        fullDate: date,
      };

    }
  );

}, []);


  return (

    <View style={styles.wrapper}>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={
        false
      }
      contentContainerStyle={
        styles.container
      }
    >

      {dates.map((item) => (

        <TouchableOpacity
          key={item.id}
          style={[
            styles.dateBox,

            selectedDate.getDate() === item.day &&
            styles.selectedDateBox,
          ]}
 onPress={() =>
  onSelectDate(item.fullDate)
}
        >

          <Text
            style={[

              styles.dateText,

              selectedDate.getDate() === item.day &&
              styles.selectedDateText,

            ]}
          >
            {item.day}
          </Text>

        </TouchableOpacity>

      ))}

    </ScrollView>
    </View>

  );

};

export default DateSelector;

const styles = StyleSheet.create({

 container: {
  alignItems: 'center',
  paddingHorizontal:16
},

  dateBox: {
    width: 40,
    height: 40,

    borderWidth: 1,
    borderColor: '#333',

    borderRadius: 8,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,

    backgroundColor: '#FFF',
  },

  selectedDateBox: {
    backgroundColor: '#000',
    borderColor: '#000',
  },

  dateText: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
  },

  selectedDateText: {
    color: '#FFF',
  },
  wrapper: {
  height: 55,
},

});