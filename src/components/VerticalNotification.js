/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Image} from 'expo-image';
import React, {useState, useRef, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
const moment = require('moment');
import * as SplashScreen from 'expo-splash-screen';
// import moment from 'moment-with-locales-es6';

SplashScreen.preventAutoHideAsync();
Ionicons.loadFont();
MaterialIcons.loadFont();

const VerticalPostCard = ({item, appIsReady}) => {
  const date = new Date(item?.created_at);
  const navigation = useNavigation();
  require('moment/locale/vi');

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Notification Detail', {
          id: item?.post_id,
        })
      }>
      <View style={{backgroundColor: item.read == 1 ? 'white' : '#eeeeee'}}>
        <View style={Styles.notification}>
          <View style={Styles.HeaderLeftImageView}>
            <Image
              source={{uri: item?.avatar}}
              style={Styles.HeaderLeftImage}
            />
          </View>
          <View
            style={{
              marginHorizontal: 8,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              width: '85%'
            }}>
            <Text
              style={{
                fontSize: 14,
                paddingHorizontal:8
                // fontWeight: 'bold',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                {item?.user_name}{' '}
              </Text>
              <Text
                style={{
                  color: '#637381',
                  paddingRight:12,
                }}>
                {item?.content}
              </Text>
           
            </Text>
            <Text
              style={{
                color: '#637381',
                paddingLeft:8
              }}>
             {moment(date).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  // }
};

export default VerticalPostCard;

const Styles = StyleSheet.create({
  notification: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 4,
    padding: 12,
    borderRadius: 8,
  },
  HeaderLeftImageView: {
    width: 48,
    height: 48,
    borderRadius: 48 / 2,
  },
  HeaderLeftImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
});
