import React from 'react';
import {
  View,
  Text,
  Image,
} from 'react-native';

import styles from '../../screens/styles';

interface Props {
  item: {
    title: string;
    subtitle: string;
    image: any;
  };
}

const OnboardingCard = ({ item }: Props) => {
  return (
    <View style={styles.cardContainer}>

      <Text style={styles.logoText}>
        Taste the Purity
      </Text>

      <Image
        source={item.image}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.title}>
        {item.title}
      </Text>

      <View style={styles.paginationContainer}>
        <View style={styles.activeDot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <View style={styles.button}>
        <Text style={styles.buttonText}>
          Get Started
        </Text>
      </View>

      <Text style={styles.browseText}>
        Just Browse
      </Text>

    </View>
  );
};

export default OnboardingCard;