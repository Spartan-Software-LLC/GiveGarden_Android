import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';

import CustomDrawer from '../components/CustomDrawer';

import Ionicons from '@expo/vector-icons/Ionicons';

import TabNavigator from './TabNavigator';
import { View } from 'react-native';

const Drawer = createDrawerNavigator();

const AuthStack = () => {
  Ionicons.loadFont();
  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: 'black',
        drawerInactiveTintColor: 'black',
        drawerLabelStyle: {
          marginLeft: 50,
          fontSize: 15,
        },
      }}
      >
      <Drawer.Screen
        name="HomeScreen"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AuthStack;
