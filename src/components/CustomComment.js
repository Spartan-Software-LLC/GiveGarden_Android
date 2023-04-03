import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import moment from 'moment';

const CustomComment = ({item}) => {
  const date = new Date(item.created_at);
  return (
    <View
      style={{
        borderRadius: 8,
        padding: 10,
        width: '100%',
        marginTop: 10,
        backgroundColor: '#F4F6F8',
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
        }}>
        {item.user_avatar && (
          <Image
            source={{
              uri: item?.user_avatar,
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 50,
            }}
          />
        )}
        <View style={{flex: 2, marginLeft: 10}}>
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>
              {item?.user_fullname}
            </Text>
            {item?.user_role == 'admin' && (
              <View
                style={{
                  backgroundColor: '#ff563029',
                  marginLeft: 4,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#B71d18',
                    paddingHorizontal: 4,
                    paddingTop: 1.5,
                  }}>
                  {item?.user_role}
                </Text>
              </View>
            )}
            {item?.user_role == 'supporter' && (
              <View
                style={{
                  backgroundColor: '#3366ff29',
                  marginLeft: 4,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#1939b7',
                    paddingHorizontal: 4,
                    paddingTop: 1.5,
                  }}>
                  {item?.user_role}
                </Text>
              </View>
            )}
            {item?.user_role == 'coach' && (
              <View
                style={{
                  backgroundColor: '#ffab0029',
                  marginLeft: 4,
                  borderRadius: 4,
                }}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: '#B76e00',
                    paddingHorizontal: 4,
                    paddingTop: 1.5,
                  }}>
                  {item?.user_role}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
            {/* <Ionicons name="time-outline" size={20} color="black" /> */}
            <Text
              style={{
                color: '#919EAB',
              }}>
              {moment(date).fromNow()}
            </Text>
          </View>
        </View>
      </View>
      <View style={{paddingVertical: 8}}>
        <Text style={{paddingHorizontal: 10, color: 'black', fontSize: 14}}>
          {item?.content}
        </Text>
      </View>
    </View>
  );
};

export default CustomComment;
