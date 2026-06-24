import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PanResponder,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import styles from '../styles';
import { onboardingData } from '../../data/onboardingData';

const OnboardingScreen = () => {

  const navigation = useNavigation<any>();

  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeAnim = useRef(
    new Animated.Value(1)
  ).current;

  /* ---------------- ANIMATION ---------------- */

  const animateContent = (
    callback: () => void
  ) => {

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {

      callback();

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

    });

  };

  /* ---------------- NEXT SLIDE ---------------- */

  const nextSlide = () => {

    animateContent(() => {

      setCurrentIndex((prevIndex) =>

        prevIndex === onboardingData.length - 1
          ? 0
          : prevIndex + 1

      );

    });

  };

  /* ---------------- PREV SLIDE ---------------- */

  const prevSlide = () => {

    animateContent(() => {

      setCurrentIndex((prevIndex) =>

        prevIndex === 0
          ? onboardingData.length - 1
          : prevIndex - 1

      );

    });

  };

  /* ---------------- AUTO SLIDE ---------------- */

  useEffect(() => {

    const interval = setInterval(() => {

      nextSlide();

    }, 5000);

    return () => clearInterval(interval);

  }, [currentIndex]);

  /* ---------------- SWIPE ---------------- */

  const panResponder = PanResponder.create({

    onMoveShouldSetPanResponder: () => true,

    onPanResponderRelease: (_, gestureState) => {

      if (gestureState.dx > 50) {
        prevSlide();
      }

      if (gestureState.dx < -50) {
        nextSlide();
      }

    },

  });

  const handleBrowse = async () => {

  await AsyncStorage.setItem(
    'isLoggedIn',
    'false'
  );

  navigation.navigate('GuestHome');

};

  const currentItem = onboardingData[currentIndex];

  return (

    <SafeAreaView style={styles.container}>

      <View
        style={styles.cardContainer}
        {...panResponder.panHandlers}
      >

        {/* ---------------- TOP LOGO ---------------- */}

        <View style={styles.logoContainer}>

          <View style={styles.lineContainer}>

            <LinearGradient
              colors={['#000000', '#D9D9D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.longLine}
            />

            <LinearGradient
              colors={['#000000', '#D9D9D9']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shortLine}
            />

          </View>

           <View>
    <Image
      source={require('../../../assets/images/birds.png')}
      style={styles.birds}
      resizeMode="contain"
    />

          <Text style={styles.logoText}>
            Taste the Purity
          </Text>

      </View>

        </View>

        {/* ---------------- CENTER CONTENT ---------------- */}

        <Animated.View
          style={{
            opacity: fadeAnim,
            flex: 1,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <Image
            source={currentItem.image}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>
  {currentItem.title}
</Text>

<Text style={styles.subtitle}>
  {currentItem.subtitle}
</Text>

        </Animated.View>

        {/* ---------------- BOTTOM SECTION ---------------- */}

        <View style={styles.bottomContainer}>

          {/* PAGINATION */}

          <View style={styles.paginationContainer}>

            {[0, 1, 2, 3].map((_, index) => (

              <View
                key={index}
                style={
                  currentIndex === index
                    ? styles.activeDot
                    : styles.dot
                }
              />

            ))}

          </View>

          {/* BUTTON */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
          >

            <Text style={styles.buttonText}>
              Get Started
            </Text>

          </TouchableOpacity>

          {/* BROWSE */}

         <TouchableOpacity
 onPress={handleBrowse}
>

  <Text style={styles.browseText}>
    Just Browse
  </Text>

</TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>

  );

};

export default OnboardingScreen;