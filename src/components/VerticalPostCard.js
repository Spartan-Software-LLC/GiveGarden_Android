/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Share,
  Alert,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import {Image} from 'expo-image';
import Hyperlink from 'react-native-hyperlink'
import {useTranslation} from 'react-i18next'

import React, {useState, useRef, useEffect, useContext, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Entypo,
} from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import {AuthContext} from '../context/AuthContext';
import CacheImage from './CacheImage';
import socket from '../utils/socket';
import axios from 'axios';

Ionicons.loadFont();
MaterialIcons.loadFont();
let optionArray = ['Xóa', 'Báo cáo', 'Bỏ Qua'];

const VerticalPostCard = ({item, actionDelte}) => {
  const [dataPost, setDataPost] = useState(item);
  const {token, userInfo} = useContext(AuthContext);

  const [liked, setLiked] = useState(dataPost?.liked);
  const [likedLocal, setLikedLocal] = useState(dataPost?.reactions);
  const [commentsLocal, setCommentsLocal] = useState(dataPost?.comments);

  // const {height, width} = useWindowDimensions();

  let actionSheet = useRef();
  const showActionSheet = () => {
    actionSheet.current.show();
  };

  useEffect(() => {
    const listen = data => {
      if (data) {
        setLiked(data.post.liked);
        setLikedLocal(data.post.reactions);
        setCommentsLocal(data.post.comments);
      }
    };
    socket.on(
      `givegarden_database_community-feed-${dataPost.id}:update-post`,
      listen,
    );
    return () => {
      socket.off(
        `givegarden_database_community-feed-${dataPost.id}:update-post`,
        listen,
      );
    };
  }, [socket]);

  const onSubmitLike = async () => {
    const res = await axios.post(
      'http://api.givegarden.info/api/posts/reaction',
      {
        post_id: item.id,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
    );
    if (res.status === 200) {
      // setLiked(!liked)
    }
  };
  const postOnFacebook = async () => {
    try {
      const result = await Share.share({
        url: `${dataPost.images[0]}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const date = new Date(dataPost?.created_at);
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const navigation = useNavigation();

  const onClickSheet = async index => {
    if (index == 1) {
      if (dataPost?.type == 1) {
        if (userInfo.group_id != 5) {
          Alert.alert(
            'GIVE Garden',
            t('delete_alert_1'),
            [
              {
                text: t('skip'),
                style: 'cancel',
              },
              {text: t('agree'), onPress: () => actionDelte(1, dataPost?.id)},
            ],
          );
        } else {
          Alert.alert('GIVE Garden',  t('delete_alert_2'), [
            {
              text: t('skip'),
              style: 'cancel',
            },
            {text: t('agree'), onPress: () => actionDelte(1, dataPost?.id)},
          ]);
        }
      } else {
        Alert.alert('GIVE Garden', 'Bạn có chắc muốn xoá bài viết này?', [
          {
            text: t('skip'),
            style: 'cancel',
          },
          {text: t('agree'), onPress: () => actionDelte(1, dataPost?.id)},
        ]);
      }
    } else if (index == 2) {
      Alert.alert('GIVE Garden', 'Đã gửi đánh giá cho Admin GIVE Garden', [
        {
          text: t('agree'),
          style: 'cancel',
        },
      ]);
    }
  };

  const deviceWidth = Dimensions.get('window').width;

  const heightApp =
    ((dataPost?.size?.height / 10) * deviceWidth) /
    (dataPost?.size?.width / 10);
  const {t} = useTranslation();

  return (
    <View style={Styles.CardStyle}>
      <View style={{flexDirection: 'column', marginTop: 10}}>
        {/* Header  */}
        <TouchableOpacity
          onPress={() =>
            navigation.push('PostDetails', {
              id: dataPost.id,
              item: dataPost,
              like: liked,
            })
          }
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            paddingHorizontal: 12,
          }}>
          {/* Header Left  */}
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
            }}>
            <View
              style={{
                position: 'relative',
              }}>
              {dataPost?.user?.role == 'member' ? (
                <View style={Styles.headerLeftImage}>
                  <View style={Styles.headerLeftCount}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 'bold',
                      }}>
                      {dataPost?.user?.level}
                    </Text>
                  </View>
                </View>
              ) : (
                ''
              )}
              {/* <CacheImage
                uri={dataPost?.user?.avatar}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                }}
                
              /> */}
              <Image
                source={{uri: `${dataPost?.user?.avatar}`}}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 40,
                }}
                // placeholder={blurhash}
                // transition={1000}
              />
            </View>
            <View style={{flex: 2, marginLeft: 13}}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Text style={{fontSize: 16, color: 'black', fontWeight: '500'}}>
                  {dataPost?.user?.name}
                </Text>
                {dataPost?.user?.role == 'admin' && (
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
                      {dataPost?.user?.role}
                    </Text>
                  </View>
                )}
                {dataPost?.user?.role == 'supporter' && (
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
                      {dataPost?.user?.role}
                    </Text>
                  </View>
                )}
                {dataPost?.user?.role == 'coach' && (
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
                      {dataPost?.user?.role}
                    </Text>
                  </View>
                )}
              </View>
              {/* 
                    </View> */}

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: '#919EAB',
                  }}>
                  {dataPost?.type == 1
                    ? 'Check In'
                    : dataPost?.type == 2
                    ?  t('anouncement')
                    : t('question')}
                  : {moment(date).fromNow()}
                </Text>
              </View>
            </View>
          </View>
          {/* Header Right  */}
          <TouchableHighlight onPress={showActionSheet}>
            <View style={Styles.headerRightAction}>
              <Entypo name="dots-three-vertical" size={24} color="black" />
            </View>
          </TouchableHighlight>
        </TouchableOpacity>

        {/* Content */}
        <View style={{marginTop: 10}}>
          <Hyperlink onPress={ (url, text) => Linking.openURL(url) }
            linkStyle={ { color: '#2980b9'} }>
            <Text selectable style={Styles.PostTitle}>{dataPost?.content}</Text>
          </Hyperlink>
          {dataPost?.images == null || dataPost?.images[0] == null ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.push('PostDetails', {
                  id: dataPost.id,
                  item: dataPost,
                  like: liked,
                })
              }
              style={Styles.ImageView}>
             
              <CacheImage
                uri={dataPost?.images[0]}
                style={{
                  height: heightApp,
                  width: deviceWidth - 20,
                }}
                
              />
            
            </TouchableOpacity>
          )}
        </View>

        {/* Infor  actions*/}
        <View style={Styles.inforTitle}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={Styles.styleInfor}>
              {likedLocal && likedLocal.length == 0
                ? ''
                : `${likedLocal.length} ${t('like')}`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={Styles.styleInfor}>
              {commentsLocal?.length == 0
                ? ''
                : `${commentsLocal.length} ${t('comment')}`}
            </Text>
          </View>
        </View>

        {/* Footer actions*/}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 50,
            paddingHorizontal: 12,
          }}>
          {/* Likes  */}
          <TouchableOpacity
            style={{
              justifyContent: 'center',
            }}
            onPress={onSubmitLike}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {liked ? (
                <AntDesign name="like1" size={18} color="blue" />
              ) : (
                <AntDesign name="like2" size={18} color="#637381" />
              )}

              <Text style={Styles.actionStyle}>{t('like')}</Text>
            </View>
          </TouchableOpacity>
          {/* Comments  */}
          <TouchableOpacity
            style={{
              justifyContent: 'center',
            }}
            onPress={() =>
              navigation.navigate('PostDetails', {
                id: dataPost.id,
                item: dataPost,
                like: liked,
                is_commented: true,
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                fontWeight: '500',
              }}>
              <FontAwesome name="comment-o" size={18} color="#637381" />

              <Text style={Styles.actionStyle}>{t('comment')}</Text>
            </View>
          </TouchableOpacity>
          {/* Chia sẻ  */}
          <TouchableOpacity
            onPress={postOnFacebook}
            style={{
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <AntDesign name="sharealt" size={18} color="#637381" />

              <Text style={Styles.actionStyle}>{t('share')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ActionSheet
          ref={actionSheet}
          // title={'Thao tác ?'}
          options={[t('delete'), t('report'), t('skip')]}
          cancelButtonIndex={2}
          onPress={index => {
            onClickSheet(index + 1);
          }}
        />
      </View>
    </View>
  );
};

export default memo(VerticalPostCard);

const Styles = StyleSheet.create({
  CardStyle: {
    // paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 10,
    borderBottomColor: 'grey',
    backgroundColor: 'white',
    marginBottom: 20,
    shadowColor: '#919EAB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 12,
  },

  //header
  headerLeftImage: {
    width: 20,
    height: 20,
    borderRadius: 40,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 100,
    top: -4,
    left: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeftCount: {
    width: 17,
    height: 17,
    borderRadius: 50,
    backgroundColor: '#10C45C',
    justifyContent: 'center',
  },

  headerRightAction: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //infor action
  inforTitle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'white',
    borderBottomColor: 'rgba(145, 158, 171, 0.4)',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  // title
  PostTitle: {
    fontSize: 15,
    paddingHorizontal: 12,
  },
  ImageView: {
    // maxHeight: 400,
    width: '100%',
    marginTop: 10,
  },
  PostImage: {
    flex: 1,
    alignSelf: 'stretch',
    // width: width,
    // height: height,
    // minHeight: 300,
  },
  additionalTextInput: {
    flexDirection: 'row',
    borderRadius: 10,
    minHeight: 50,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    borderColor: '#e0dada',
  },
  styleInfor: {
    fontSize: 14,
    paddingLeft: 4,
    color: '#212B36',
  },
  actionStyle: {
    fontSize: 14,
    paddingLeft: 4,
    color: '#212B36',
  },
  InputField: {
    borderColor: '#eeeeee',
    borderWidth: 1,
    paddingTop: 10,
    paddingLeft: 10,
    width: '98%',
    borderRadius: 8,
    height: 40,
  },
  InputSend: {
    backgroundColor: '#F6F7F8',
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  TextInput: {
    width: '100%',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    textAlignVertical: 'center',
    borderColor: '#f3f6f4',
    placeholderTextColor: 'grey',
    fontSize: 14,
  },
});
