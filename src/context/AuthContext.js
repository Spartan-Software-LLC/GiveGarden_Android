import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
export const AuthContext = createContext();
import {BASE_URL} from '../../config';

export const AuthProvider = ({children}) => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [Error, setError] = useState(false);
  const [token, setToken] = useState('');

  const login = (email, otp) => {
    setIsLoading(true);
    axios
      .post(
        `${BASE_URL}/verify-otp`,
        {
          email,
          otp,
        },
        {
          headers: {'Content-Type': 'application/json'},
        },
      )
      .then(res => {
        if (res.data && res.data.status_code == 200) {
          setIsError(false);
          setUserInfo(res.data.user);
          setToken(res?.data?.access_token);
          AsyncStorage.setItem('AccessToken', res?.data?.access_token);
          
        } else {
          setIsError(true);
          console.log('login fail')
        }

        setIsLoading(false);
      })
      .catch(e => {
        console.log(`login error ${e}`);
        setError(true);
        setIsLoading(false);
      });
  };

  const logout = () => {
    setUserInfo(null);
    setToken(null);
    AsyncStorage.removeItem('AccessToken');
  };

  const isLoggedIn = async () => {
    try {
      const access_token = await AsyncStorage.getItem('AccessToken');
      if (access_token) {
        const data = await axios.get(`${BASE_URL}/user`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + access_token,
          },
        });
        setUserInfo(data.data);
        setToken(access_token);
      }else {
        console.log('Access token not available')
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    setSplashLoading(true);
    isLoggedIn();
    setSplashLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        splashLoading,
        login,
        logout,
        isError,
        setIsError,
        token,
        isLoggedIn,
        Error,setError,
        setSplashLoading,
        setLoading,
        loading
      }}>
      {children}
    </AuthContext.Provider>
  );
};
