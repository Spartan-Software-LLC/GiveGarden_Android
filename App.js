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
import * as Updates from 'expo-updates';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {
  
  useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 1000);
  }, []);

  const eventListener = (event) => {
    if (event.type === Updates.UpdateEventType.ERROR) {
      // Handle error
    } else if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
      // Handle no update available
    } else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
      // Handle update available
    }
  };
  Updates.useUpdateEvents(eventListener);
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

