/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from 'react-native';
import {Ionicons, Feather} from '@expo/vector-icons';
import {AuthContext} from '../context/AuthContext';
import {SlideContext} from '../context/SlideContext';
import axios from 'axios';
import moment from 'moment';
var pkg = require('../../package.json');

Ionicons.loadFont();
const CustomDrawer = props => {
  const {logout, userInfo, isLoggedIn, token, setLoading} =
    useContext(AuthContext);
    const {setGroupName, setGroupChange} = useContext(SlideContext);

  const actionData = async group_id => {
    
    await axios
      .post(
        'http://api.givegarden.info/api/user/change-group',
        {
          user_id: userInfo.id,
          group_id: group_id,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(response => {
        setGroupName(response.data.group_name);
        setGroupChange(group_id)
        isLoggedIn();
        setLoading(true);
        props.navigation.closeDrawer();
      })
      .catch(error => {
        setLoading(false);
      });
  };
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/images/layout_infor.png')}
          style={{padding: 20}}>
          <Image
            source={{
              uri: userInfo?.avatar,
            }}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginTop: 30,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
            }}>
            {userInfo && userInfo.name ? userInfo.name : 'Chưa cập nhật'}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
            }}>
            {userInfo?.role ? userInfo.role : 'Chưa cập nhật'}
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          {/* action group  */}
          {userInfo?.group_arr && (
            <FlatList
              data={userInfo?.group_arr}
              keyExtractor={(_, index) => index}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => actionData(item.id)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Feather name="home" size={24} color={'#919EAB'} />
                      <Text
                        adjustsFontSizeToFit={true}
                        numberOfLines={1}
                        style={{
                          position: 'absolute',
                          bottom:9,
                          fontSize: 16,
                          paddingLeft: 30,
                          fontWeight: 'bold',
                          color: '#919EAB',
                        }}>
                        {item?.title}
                      </Text>
                      <Text 
                      style={{
                        position: 'absolute',
                        top:14,
                        left:25,
                        // top: 90,
                        // left: 20,
                        fontSize: 13,
                        marginLeft: 5,
                        paddingRight: 44,
                        color: '#919EAB',
                      }}
                      >
                        {(item?.open_at)? moment(item?.open_at).format('MM/DD/YYYY'): '' } {(item?.expired_at)? "- "+moment(item?.expired_at).format('MM/DD/YYYY'):''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
      <View style={{
        borderTopWidth: 1, 
        borderTopColor: '#ccc',
        // flex: 1,
        paddingBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
      }}>
        <View style={{paddingLeft: 15, width: '50%'}}>
          <TouchableOpacity
            onPress={() => {
              logout();
            }}
            style={{paddingVertical: 10}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="exit-outline" size={24} color={'#919EAB'} />
              <Text
                style={{
                  fontSize: 15,
                  marginLeft: 5,
                  color: '#919EAB',
                }}>
                Đăng xuất
              </Text>
              
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{ paddingLeft:15, paddingTop: 15,paddingRight: 15, width: '50%', alignContent: "flex-start"}}
        >
          <Text
            style={{
              fontSize: 14,
              marginLeft: 5,
              color: '#919EAB',
              textAlign: 'right'
            }}>
            Phiên bản 1.2.9
          </Text>
        </View>
      </View>
      
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerItem: {
    marginTop: -2,
    width: '100%',
    height: 50,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  drawerItemText: {
    fontSize: 14,
    color: 'grey',
    fontWeight: 'bold',
  },
  divider: {
    marginTop: 10,
    width: '90%',
  },
});
