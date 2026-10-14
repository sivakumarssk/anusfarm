import React, {
  useEffect,
  useState,
} from "react";

import { useNavigation } from "@react-navigation/native";

import {
  View,
  Text,
  Image,
} from "react-native";

export default function SplashScreen() {

  const navigation = useNavigation<any>();

  /* ---------------- SHOW GIF / IMAGE ---------------- */

  const [showGif, setShowGif] = useState(true);

  useEffect(() => {

    /* GIF → IMAGE */

    const gifTimer = setTimeout(() => {

      setShowGif(false);

    }, 3800);

    /* IMAGE → ONBOARDING */

    const navigationTimer = setTimeout(() => {

      navigation.replace("Onboarding");

    }, 4800);

    return () => {

      clearTimeout(gifTimer);

      clearTimeout(navigationTimer);

    };

  }, []);

  return (

    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >

      {
        showGif ? (

          /* ---------------- GIF ---------------- */

          <Image
            source={require('../../assets/images/splash.gif')}
            style={{
              width: 320,
              height: 320,
            }}
            resizeMode="contain"
          />

        ) : (

          /* ---------------- FINAL IMAGE ---------------- */

          <Image
            source={require('../../assets/images/frame3.png')}
            style={{
              width: 180,
              height: 180,
              marginBottom: 10,
            }}
            resizeMode="contain"
          />

        )
      }

      <Text
        style={{
  fontSize: 25,
  fontFamily: 'Inter-Bold',
  color: '#3A2418',
  marginTop: -20,
}}
      >
        Pure Buffalo Milk
      </Text>

    </View>

  );

}