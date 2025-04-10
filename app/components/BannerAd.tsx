import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';

const { width } = Dimensions.get('window');

const NativeAdComponent: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load the ad here and set 'loaded' to true when done
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    width: width - 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10,
  },
  headline: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
    marginVertical: 10,
    borderRadius: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#666',
  },
});

export default NativeAdComponent;


