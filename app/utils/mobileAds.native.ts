// mobileAds.native.ts
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export const initMobileAds = () => {
    mobileAds()
        .setRequestConfiguration({
            maxAdContentRating: MaxAdContentRating.PG,
            tagForChildDirectedTreatment: false,
            tagForUnderAgeOfConsent: false
        }).then(() => {
            return mobileAds().initialize()
        }).then(() => {
            console.log("Admob Success")
        }).catch((error) => {
            console.log("Admob failed : ", error)
        });
};
