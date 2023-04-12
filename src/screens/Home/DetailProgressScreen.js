/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  Alert,
  useWindowDimensions,
  YellowBox,
} from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import ImageModal from 'react-native-image-modal';
import {Image} from 'expo-image';
import React, {useState, useRef, useContext, useEffect} from 'react';
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
  Entypo,
} from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';

import Spacer from '../../components/Spacer';
import CustomComment from '../../components/CustomComment';
import {AuthContext} from '../../context/AuthContext';
import socket from '../../utils/socket';
import axios from 'axios';

Ionicons.loadFont();
MaterialIcons.loadFont();

let optionArray = ['Xóa', 'Báo cáo', 'Bỏ Qua'];
YellowBox.ignoreWarnings(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`']);
const DetailPostScreen = ({route, navigation}) => {

  const height = useHeaderHeight();
  const dimensions = useWindowDimensions();
  const {token, userInfo} = useContext(AuthContext);
  const {id, item, like} = route.params;
  const [data, setData] = useState(item);
  const [liked, setLiked] = useState(like);
  const [value, setValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `http://api.givegarden.info/api/post/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res.status == 200) {
        setData(res.data);
      } else {
        console.error('Error getting');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = data.reactions?.some(d => d?.user_id == userInfo?.id);
    setLiked(filterData);
  }, [data]);

  useEffect(() => {
    const listen = data => {
      if (data) {
        setData(data.post);
      }
    };
    socket.on(`givegarden_database_community-feed-${id}:update-post`, listen);
    return () => {
      socket.off(
        `givegarden_database_community-feed-${id}:update-post`,
        listen,
      );
    };
  }, [socket]);

  let actionSheet = useRef();

  const showActionSheet = () => {
    actionSheet.current.show();
  };
  const onClickSheet = async index => {
    if (index == 1) {
      await axios
        .delete(`http://api.givegarden.info/api/post/${data.id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
        .then(res => {
          if (res.status == 200) {
            Alert.alert('GIVE Garden', 'Xóa bài viết thành công', [
              {
                text: 'Xác nhận',
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(err => {
          Alert.alert('GIVE Garden', 'Không thể xóa bài viết', [
            {
              text: 'Xác nhận',
              style: 'cancel',
            },
          ]);
        });
    }else if(index == 2){
      Alert.alert('GIVE Garden', 'Đã gửi đánh giá cho admin', [
        {
          text: 'Xác nhận',
          style: 'cancel',
        },
      ]);
    }
  };

  const onSubmitComment = async () => {
    if (value == '') {
      Alert.alert('GIVE Garden', 'Please enter a comment', [
        {
          text: 'Xác nhận',
          style: 'cancel',
        },
      ]);
    } else {
      const res = await axios.post(
        'http://api.givegarden.info/api/posts/comment',
        {
          post_id: data.id,
          content: value,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res) {
        setValue('');
      }
    }
  };

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

  const date = new Date(data?.created_at);
  return (
    <View style={Styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={height}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
        enabled>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          <View style={Styles.CardStyle}>
            <View style={{ marginTop: 10}}>
              {/* Header  */}
              <View
                style={{
                  width: '100%',
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
                    <View
                      style={{
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
                      }}>
                      <View
                        style={{
                          width: 17,
                          height: 17,
                          borderRadius: 50,
                          backgroundColor: '#10C45C',
                        }}>
                        <Text
                          style={{
                            padding: 3,
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 'bold',
                          }}>
                          {data?.user?.level}
                        </Text>
                      </View>
                    </View>
                    <Image
                      source={{uri: `${data?.user?.avatar}`}}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 40,
                      }}
                    />
                  </View>
                  <View style={{flex: 2, marginLeft: 15}}>
                    <View style={{display: 'flex', flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: 'black',
                          fontWeight: '500',
                        }}>
                        {data?.user?.name}
                      </Text>
                      {data?.user?.role == 'admin' && (
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
                            {data?.user?.role}
                          </Text>
                        </View>
                      )}
                      {data?.user?.role == 'supporter' && (
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
                            {data?.user?.role}
                          </Text>
                        </View>
                      )}
                      {data?.user?.role == 'coach' && (
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
                            {data?.user?.role}
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
                        {moment(date).fromNow()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Header Right  */}
                <TouchableHighlight onPress={showActionSheet}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="black"
                    />
                  </View>
                </TouchableHighlight>
              </View>

              {/* Content */}
              <View style={{marginTop: 10}}>
                <Text style={Styles.PostTitle}>{data?.content}</Text>

                {data?.images?.length == 3 && (
                  <View style={Styles.ImageView}>
                    <>
                      <FlatList
                        data={data?.images}
                        renderItem={({item}) => (
                          <View style={Styles.imageContainerStyle}>
                            <TouchableOpacity
                              key={item.id}
                              style={{flex: 1,height: 280,}}
                              // onPress={()=> ShowModalFunction(true, item)}
                            >
                              <ImageModal
                                resizeMode="contain"
                                style={{
                                  width: (dimensions.width - 20) /3 ,
                                  height: 280,
                                }}
                                source={{
                                  uri: item,
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                        //Setting the number of column
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                      />
                    </>
                  </View>
                )}
              </View>

              {/* Infor  actions*/}
              <View
                style={{
                  height: 40,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  color: 'white',
                  borderBottomColor: 'rgba(145, 158, 171, 0.4)',
                  borderBottomWidth: 1,
                  paddingHorizontal: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={Styles.styleInfor}>
                    {data?.reactions?.length == 0
                      ? ''
                      : `${data?.reactions?.length} likes`}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={Styles.styleInfor}>
                    {data?.comments?.length == 0
                      ? ''
                      : `${data?.comments?.length} bình luận`}
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
                  onPress={() => onSubmitLike()}>
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

                    <Text style={Styles.actionStyle}>Thích</Text>
                  </View>
                </TouchableOpacity>
                {/* Comments  */}
                <TouchableOpacity
                  style={{
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      fontWeight: '500',
                    }}>
                    <FontAwesome name="comment-o" size={18} color="#637381" />

                    <Text style={Styles.actionStyle}>Bình luận</Text>
                  </View>
                </TouchableOpacity>
                {/* Chia sẻ  */}
                <TouchableOpacity
                  // onPress={postOnFacebook}
                  style={{
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <AntDesign name="sharealt" size={18} color="#637381" />

                    <Text style={Styles.actionStyle}>Chia sẻ</Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Comments  */}
              <View
                style={{
                  color: 'white',
                  borderTopColor: 'rgba(145, 158, 171, 0.4)',
                  borderTopWidth: 1,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    {userInfo.avatar && (
                      <Image
                        source={{
                          uri: userInfo.avatar,
                        }}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 40,
                        }}
                      />
                    )}
                    <View style={{flex: 2, marginLeft: 10}}>
                      <TextInput
                        style={Styles.InputField}
                        onChangeText={text => setValue(text)}
                        value={value}
                        placeholder="Viết bình luận..."
                        keyboardType="default"
                        placeholderTextColor={'gray'}
                        returnKeyType="done"
                        multiline={true}
                        blurOnSubmit={true}
                        onBlur={() => {
                          Keyboard.dismiss();
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      style={Styles.InputSend}
                      onPress={onSubmitComment}>
                      <Ionicons
                        name="send"
                        size={24}
                        justifyContent="center"
                        color="#10C45C"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <ScrollView style={{marginTop: 10}}>
                  {data?.comments?.map((item, index) => (
                    <CustomComment key={index} item={item} />
                  ))}
                </ScrollView>

                <Spacer height={10} />
              </View>

              <ActionSheet
                ref={actionSheet}
                // title={'What do you do ?'}
                options={optionArray}
                cancelButtonIndex={2}
                onPress={index => {
                  onClickSheet(index+1);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default DetailPostScreen;

const Styles = StyleSheet.create({
  container: {flex: 1, width: '100%', height: '100%'},
  scrollView: {
    backgroundColor: '#f7f8fa',
  },
  CardStyle: {
    marginTop: 10,
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
  PostTitle: {
    paddingHorizontal: 12,
    fontSize: 15,
  },
  ImageView: {
    height: 280,
    width: '100%',
    marginTop: 4,
  },
  imageContainerStyle: {
    flex: 1,
    margin: 1,
    marginTop: 8,
  },
  imageStyle: {
    height: 280,
    width: '100%',
    contentFit: 'cover',
  },
  imageShow: {
    height: '80%',
    resizeMode: 'contain',
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
    padding: 10,
    borderRadius: 5,
    paddingHorizontal: 15,
    textAlignVertical: 'center',
    borderColor: '#bcbcbc',
    placeholderTextColor: 'grey',
  },
});
