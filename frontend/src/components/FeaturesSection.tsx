import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

const FeatureSection = () => {

  return (

    <View style={styles.container}>

      {/* Farm Fresh */}

      <View style={styles.featureItem}>

        <Image
          source={require('../../assets/icons/farmFresh.png')}
          style={styles.icon}
          resizeMode="contain"
        />

        <View>

          <Text style={styles.title}>
            Farm Fresh
          </Text>

          <Text style={styles.subtitle}>
            Sourced directly
          </Text>

          <Text style={styles.subtitle}>
            from farms.
          </Text>

        </View>

      </View>

      {/* 100% Pure */}

      <View style={styles.featureItem}>

        <Image
          source={require('../../assets/icons/pure.png')}
          style={styles.icon}
          resizeMode="contain"
        />

        <View>

          <Text style={styles.title}>
            100% Pure
          </Text>

          <Text style={styles.subtitle}>
            No added
          </Text>

          <Text style={styles.subtitle}>
            preservatives
          </Text>

        </View>

      </View>

      {/* Quality Assured */}

      <View style={styles.featureItem}>

        <Image
          source={require('../../assets/icons/Quality-assured.png')}
          style={styles.icon}
          resizeMode="contain"
        />

        <View>

          <Text style={styles.title}>
            Quality Assured
          </Text>

          <Text style={styles.subtitle}>
            Highest quality
          </Text>

          <Text style={styles.subtitle}>
            standards
          </Text>

        </View>

      </View>

    </View>

  );

};

export default FeatureSection;

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#E8E8E8',
    borderRadius: 18,
    marginTop: 10,
    marginLeft:10,
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  featureItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 18,
    height: 18,
    marginRight: 6,
    marginLeft:2
  },

  title: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
  },

  subtitle: {
    fontSize: 7,
    color: '#666',
    lineHeight: 10,
  },

});