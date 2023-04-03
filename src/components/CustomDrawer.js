/* eslint-disable react-native/no-inline-styles */
import React, {useContext,useEffect} from 'react';
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
import {
  Ionicons,
  Feather,
} from '@expo/vector-icons';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import moment from 'moment';

Ionicons.loadFont();
const CustomDrawer = props => {
  const {logout, userInfo, isLoggedIn, token, setLoading} = useContext(AuthContext);

  const actionData = async (group_id) => {
    await axios.post("http://api.givegarden.info/api/user/change-group", {
      user_id: userInfo.id,
      group_id: group_id
    } ,{
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }).then(response => {
      setLoading(true);
      isLoggedIn();
      setLoading(false);
    })
    .catch(error => console.log('error',error))
  }
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/images/layout_infor.png')}
          style={{padding: 20}}>
          <Image
            source={{
              uri: userInfo?.avatar
            }}
            style={{height: 80, width: 80, borderRadius: 40, marginTop: 30, marginBottom:10}}
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
                    onPress={()=>actionData(item.id)}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Feather name="home" size={24} color={'#919EAB'} />
                      <Text
                        style={{
                          fontSize: 16,
                          marginLeft: 5,
                          color: '#919EAB',
                        }}>
                        {item?.title} | {moment(item?.open_at).format('L')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            
          )}
          
        </View>
      </ScrollView>
      <View style={{padding: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity
          onPress={() => {
            logout();
          }}
          style={{paddingVertical: 15}}>
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
