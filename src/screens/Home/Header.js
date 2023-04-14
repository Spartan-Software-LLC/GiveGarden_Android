/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Image} from 'expo-image';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext';

const Afternoon = require('../../../assets/images/afternoon.png');
const Avatar = require('../../../assets/images/avatar_default.jpg');

const Header = () => {
  const [topGroup, setTopGroup] = React.useState();
  const {userInfo, token} = useContext(AuthContext);

  React.useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.post(
          'http://api.givegarden.info/api/groups/index',
          {
            id: userInfo?.group_id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

        if (response.status == 200) {
          setTopGroup(response.data);
        }
      } catch (err) {
      }
    };
    fetchPost();
  }, []);
  return (
    <>
        
    </>
  );
};

export default Header;
const Styles = StyleSheet.create({
  CardStyle: {
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 10,
    backgroundColor: 'white',
    shadowColor: '#919EAB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 12,
  },
  titleTop: {
    color: '#212B36',
    fontSize: 12,
    fontWeight: 'bold',
    paddingTop: 16,
    textAlign: 'center',
  },
  dataTop: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  dataRank: {
    width: 17,
    height: 17,
    borderRadius: 40,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 100,
    top: -4,
    left: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
