/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useContext, useState, useRef, useEffect} from 'react';
import './ignoreWarnings';
import {registerRootComponent} from 'expo';
import 'react-native-gesture-handler';
import AppNav from './src/navigation/AppNav';
import {AuthProvider} from './src/context/AuthContext';
import {SlideProvider} from './src/context/SlideContext';
import {ImageProvider} from './src/context/ImageContext';
import * as SplashScreen from 'expo-splash-screen';
require('moment/locale/vi');


const App = () => {
  
  useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 1000);
  }, []);

  return (
    <>
      <AuthProvider>
        <SlideProvider>
          <ImageProvider>
          <AppNav />
          </ImageProvider>
        </SlideProvider>
      </AuthProvider>
    </>
  );
};

export default App;

registerRootComponent(App);

