// BannerAd.native.tsx
import React from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adUnitId = 'ca-app-pub-7069180478740738/3760839507';

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
