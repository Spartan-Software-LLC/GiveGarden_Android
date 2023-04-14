import {View, ActivityIndicator} from 'react-native';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import * as Device from 'expo-device';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import * as SplashScreen from 'expo-splash-screen';
import {AuthContext} from '../context/AuthContext';
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const AppNav = () => {
  const {
    isLoading,
    splashLoading,
    defaultToken,
    userInfo,
    isError,
    setIsError,
    token,
  } = useContext(AuthContext);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  
  useEffect(() => {
    // dang ky thong bao
    registerForPushNotificationsAsync().then(tokenRes => {
      setExpoPushToken(tokenRes);
    });

    // them noti listen
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
    // phan hoi listen
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
      });

    responseListener.current = Notifications.setBadgeCountAsync(
      notification?.length,
    );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.dismissAllNotificationsAsync();
    };
  }, [lastNotificationResponse]);

  useEffect(() => {
    
    const dataRes = async () => {
      await axios
        .post(
          'http://api.givegarden.info/api/user/device-token',
          {
            device_token: expoPushToken,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then(response)
        .catch(err);
    };
    dataRes();
  }, [token]);

  const hideAlert = () => {
    setIsError(!isError);
  };
  
  useEffect(() => {
    setTimeout(() => SplashScreen.hideAsync(), 1000);
  }, []);


  if (isError == true && token === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <AwesomeAlert
          show={isError}
          showProgress={false}
          title="GiveGraden"
          message="Tài khoản và mật khẩu không chính xác!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText="Xác nhận"
          confirmButtonColor="#DD6B55"
          onConfirmPressed={() => {
            hideAlert();
          }}
        />
      </View>
    );
  } else if (isLoading == true && splashLoading == true) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
  return (
    <NavigationContainer>
      {userInfo && token ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNav;
async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }


  return token;
}