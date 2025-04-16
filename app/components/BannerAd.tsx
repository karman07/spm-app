// BannerAdComponent.js
import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitId = 'ca-app-pub-7069180478740738/3760839507'; // Replace with your real ad unit ID in production

export default function BannerAdComponent() {
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}
