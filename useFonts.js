import * as Font from 'expo-font';

const useFonts = async () => {
  await Font.loadAsync({
    PublicSans_Bold: require('./assets/fonts/PublicSans-Bold.ttf'),
    PublicSans_Medium: require('./assets/fonts/PublicSans-Medium.ttf'),
    PublicSans_SemiBold: require('./assets/fonts/PublicSans-SemiBold.ttf'),
    PublicSans_Thin: require('./assets/fonts/PublicSans-Thin.ttf'),
  });
};

export default useFonts;
