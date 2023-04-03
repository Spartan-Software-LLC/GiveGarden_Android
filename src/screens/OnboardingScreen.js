/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';

const HideKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
function OnboardingScreen({navigation}) {
  return (
    <>
      <HideKeyboard>
        <ImageBackground
          source={require('../../assets/images/OnboardingScreen.png')}
          resizeMode="cover"
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 140,
              }}>
              <Image
                style={{width: 224, height: 150}}
                source={require('../../assets/images/give-graden.png')}
              />
            </View>
            <View
              style={{
                marginBottom:40,
              }}>
              <Text
                style={{
                  fontSize: 37,
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                {/* Transforming Lives */}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#10C45C',
                padding: 16,
                width: '90%',
                borderRadius: 30,
                marginBottom: 120,
              }}
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Tham gia cộng đồng
              </Text>
              {/* <MaterialIcons name="arrow-forward-ios" size={22} color="#fff" /> */}
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </HideKeyboard>
    </>
  );
}

export default OnboardingScreen;
