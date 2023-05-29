import React, {createContext, useContext, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import ProgressScreen from '../screens/Home/ProgressScreen';
import Notifications from '../screens/Home/Notifications';
import Profile from '../screens/Home/Profile';
import DetailPostScreen from '../screens/Home/DetailPostScreen';
import DetailProgressScreen from '../screens/Home/DetailProgressScreen';
import CheckInPost from '../screens/Home/CheckInPost';
import DetailNotification from '../screens/Home/DetailNotification';
import {AntDesign, Ionicons, Feather, Entypo} from '@expo/vector-icons';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import {ImageContext} from '../context/ImageContext';
import {SlideContext} from '../context/SlideContext';
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

import Union from '../../assets/images/Union.svg';


function CustomerTabBarButton({children, onPress}) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          height: 50,
          borderRadius: 35,
        }}>
        <View style={{marginTop: 6}}>
          <Union width={120} height={40} color={'white'} />
        </View>

        <View
          style={{
            marginTop: -16,
            width: 50,
            height: 50,
            borderRadius: 35,
            paddingTop: 43,
            paddingLeft: 17.5,
            marginBottom: 40,
            backgroundColor: '#10C45C',
          }}>
          {children}
        </View>
      </TouchableOpacity>
    </>
  );
}

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="HomeScrseen"
        component={HomeScreen}
        options={{unmountOnBlur: true}}
      />
      <Stack.Screen
        name="PostDetails"
        component={DetailPostScreen}
        options={({route}) => ({
          dataItem: {
            id: route.params?.id,
            item: route.params?.item,
            like: route.params?.like,
            is_commented: route.params?.is_commented,
          },
          unmountOnBlur: true,
        })}
      />
    </Stack.Navigator>
  );
};

const ProgressStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
      <Stack.Screen
        name="ProgressDetails"
        component={DetailProgressScreen}
        options={({route}) => ({
          dataItem: {
            id: route.params?.id,
            item: route.params?.item,
            like: route.params?.like,
            is_commented: route.params?.is_commented,
          },
          unmountOnBlur: true,
        })}
      />
    </Stack.Navigator>
  );
};

const NotificationStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="NotificationList" component={Notifications} options={{
        unmountOnBlur: true
      }}/>
      <Stack.Screen
        name="Notification Detail"
        component={DetailNotification}
        options={({route}) => ({
          id: route.params?.id,
        })}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = ({navigation}) => {
  const dimensions = useWindowDimensions();
  const {slide, setSlide, groupName} = useContext(SlideContext);

  const {isLoggedIn} = useContext(AuthContext)
  const {setImageUri, setModalVisibleStatus} = useContext(ImageContext);
  const CheckIn = props => <CheckInPost slide={slide} {...props} />;
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'white',
          display: 'flex',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 5.46,
          elevation: 9,
        },
        tabBarInactiveTintColor: '#919EAB',
        tabBarActiveTintColor: '#10C45C',

        style: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: '#fff',
          borderRadius: 15,
          height: 90,
        },
      }}>
      <Tab.Screen
        name="Home"
        listeners={({navigation}) => ({
          tabPress: event => {
            setSlide('home');
            setModalVisibleStatus(false);
            setImageUri('');
            isLoggedIn()
          },
        })}
        component={HomeStack}
        options={({route}) => ({
          tabBarIcon: ({color, size}) => (
            <Feather name="home" size={size} color={color} />
          ),
          unmountOnBlur: true,
          headerTitleAlign: 'center',
          headerTitle: props => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                width: dimensions.width-40,
                // justifyContent:'space-between'
                // gap: dimensions.width /3.2
              }}>
              <TouchableOpacity onPress={()=>navigation.openDrawer()}>
                <Entypo name="menu" size={24} color="black" />
              </TouchableOpacity>
              <Image
                source={require('../../assets/images/give-graden.png')}
                style={{
                  width: 80,
                  height: 50,
                  marginBottom: 20,
                }}
                resizeMode="contain"
              />
              <Text style={{fontWeight:'bold'}}>{groupName}</Text>
              <View style={{width: 24, height:24}}></View>
            </View>
          ),

          headerTitleStyle: {textAlign: 'center', flexDirection: 'row'},
          navigationOptions: {
            header: {visible: false},
          },
        })}
      />
      <Tab.Screen
        name="Hình chuyển đổi"
        listeners={({navigation}) => ({
          tabPress: event => {
            setSlide('progress');
            setModalVisibleStatus(false);
            setImageUri('');
          },
        })}
        component={ProgressStack}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <AntDesign name="Trophy" size={size} color={color} />
          ),
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Check-in"
        component={CheckIn}
        options={{
          tabBarButton: props => <CustomerTabBarButton {...props} />,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="add"
              style={{
                borderRadius: 25,
                width: 50,
                height: 50,
                marginBottom: 30,
                color: 'white',
              }}
              size={35}
            />
          ),
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name="Thông báo"
        listeners={({navigation}) => ({
          tabPress: event => {
            setSlide('home');
          },
        })}
        component={NotificationStack}
        options={({route}) => ({
          // tabBarBadge: 3,
          // tabBarBadgeStyle: {
          //   backgroundColor: '#10C45C',
          //   color: 'white',
          // },
          tabBarIcon: ({color, size}) => (
            <Ionicons name="md-notifications-outline" size={24} color={color} />
          ),
          unmountOnBlur: true,
          navigationOptions: {
            header: {visible: false},
          },
          headerTitleAlign: 'center',
        })}
      />
      <Tab.Screen
        name="Thông tin cá nhân"
        listeners={({navigation}) => ({
          tabPress: event => {
            setSlide('home');
          },
        })}
        component={Profile}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="user" size={24} color={color} />
          ),
          unmountOnBlur: true,
          headerTitleAlign: 'center',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
