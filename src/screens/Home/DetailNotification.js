import React, {useState, useRef, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Alert,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Image} from 'expo-image';
import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome,
} from '@expo/vector-icons';
import ImageModal from 'react-native-image-modal';
import ActionSheet from 'react-native-actionsheet';
import axios from 'axios';
import moment from 'moment';
//context
import {AuthContext} from '../../context/AuthContext';
//component
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';

Ionicons.loadFont();
MaterialIcons.loadFont();

let optionArray = ['Sai nội dung', 'Không phù hợp', 'Ý khác', 'Đóng'];
const DetailNotification = ({route, navigation}) => {
  const {id} = route.params;
  let actionSheet = useRef();
  const dimensions = useWindowDimensions();
  const {userInfo, token} = useContext(AuthContext);
  const [data, setData] = React.useState();
  const [value, setValue] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showApprove, setSHowApprove] = React.useState(false);

  const [imageuri, setImageUri] = React.useState('');
  const [modalVisibleStatus, setModalVisibleStatus] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const res = await axios.get(
        `https://api.givegarden.info/api/post/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (res.status == 200) {
        setData(res?.data);
      } else {
        console.error('Error getting');
      }
    };
    fetchData();
    setLoading(false);
  }, []);

  const showActionSheet = () => {
    actionSheet.current.show();
  };

  const onClickSheet = async text => {
    if (text == 'Ý khác') {
      setShowDelete(true);
      setSHowApprove(false);
    } else if (text == 'Đóng') {
      setShowDelete(false);
    } else {
      await axios
        .post(
          'https://api.givegarden.info/api/post/decline',
          {
            id: id,
            note: text,
          },
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then(res => {
          setData();
          setShowDelete(false);
          if (res.status == 200) {
            Alert.alert('Give Garden', 'Duyệt bài thành công', [
              {
                text: 'Cancel',
                onPress: () => navigation.push('NotificationList'),
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(err => console.log('err', err));
    }
  };

  const submitPost = async () => {
    if (value === '') {
      Alert.alert('Give Garden', 'Nhập lý do', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]);
    } else {
      await axios
        .post(
          'https://api.givegarden.info/api/post/decline',
          {
            id: id,
            note: value,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        )
        .then(res => {
          if (res.status == 200) {
            setData('');
            setShowDelete(false);
            Alert.alert('Give Garden', 'Hủy bài thành công', [
              {
                text: 'Cancel',
                onPress: () => navigation.navigate('Notifications'),
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(err => console.log('err', err));
    }
  };

  const showApporve = () => {
    setShowDelete(false);
    setSHowApprove(true);
  };

  const submitPostApprove = async () => {
    await axios
      .post(
        'https://api.givegarden.info/api/post/approve',
        {
          id: id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      )
      .then(res => {
        if (res.status == 200) {
          Alert.alert('Give Garden', 'Duyệt bài thành công', [
            {
              text: 'Cancel',
              onPress: () => navigation.navigate('Home'),
              style: 'cancel',
            },
          ]);
        }
      })
      .catch(err => console.log('err', err));
  };

  const ShowModalFunction = (visible, ImageURL) => {
    setModalVisibleStatus(visible);
    setImageUri(ImageURL);
  };

  const hideShow = () => {
    setModalVisibleStatus(false);
    setImageUri('');
  };

  const date = new Date(data?.created_at ? data?.created_at : []);
 
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 80}>
      <View style={Styles.container}>
        {typeof data == 'object' && data?.content == '' ? (
          <View style={{justifyContent: 'center'}}>
            <Text style={{textAlign: 'center', paddingTop: 20}}>
              Không có dữ liệu
            </Text>
          </View>
        ) : (
          <>
            {modalVisibleStatus == false ? (
              <View>
                <View style={{marginTop: 10}}>
                  {loading == false && (
                    <View style={Styles.CardStyle}>
                      {/* Header  */}
                      <View
                        style={{
                          marginTop: 10,
                          alignItems: 'center',
                          flexDirection: 'row',
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
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={{
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
                              source={{
                                uri: data?.user?.avatar,
                              }}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 40,
                              }}
                            />
                          </View>
                          <View style={{marginLeft: 15}}>
                            <Text
                              style={{
                                fontSize: 16,
                                color: 'black',
                                fontWeight: '500',
                              }}>
                              {data?.user?.name}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
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
                        {data?.status == 'declined' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#e06666',
                              borderRadius: 6,
                              maxWidth: 180,
                            }}>
                            <Text
                              style={{
                                padding: 6,
                                color: 'white',
                              }}>
                              {data?.note}
                            </Text>
                          </View>
                        ) : data?.status == 'approved' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              backgroundColor: '#10C45C',
                              borderRadius: 6,
                            }}>
                            <Text
                              style={{
                                padding: 6,
                                color: 'white',
                              }}>
                              Đã được duyệt
                            </Text>
                          </View>
                        ) : (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <TouchableHighlight
                              style={{marginRight: 12}}
                              onPress={showApporve}>
                              <AntDesign
                                name="checkcircle"
                                size={24}
                                color="#10C45C"
                              />
                            </TouchableHighlight>
                            <TouchableHighlight onPress={showActionSheet}>
                              <AntDesign
                                name="closecircle"
                                size={24}
                                color="#D0D9E1"
                              />
                            </TouchableHighlight>
                          </View>
                        )}
                        {data?.status == 'approved'}
                      </View>

                      {/* Content */}
                      <View style={{marginVertical: 10}}>
                        <Text style={Styles.PostTitle}>{data?.content}</Text>
                        {data?.images?.length > 1 ? (
                          <View style={Styles.ImageView}>
                            <FlatList
                              data={data?.images}
                              renderItem={({item, index}) => {
                                return (
                                  <TouchableOpacity
                                    onPress={() =>
                                      ShowModalFunction(true, item)
                                    }
                                    key={index}
                                    style={Styles.imageContainerStyle}>
                                    <ImageModal
                                      resizeMode="contain"
                                      style={{
                                        width: (dimensions.width - 30) / 3,
                                        height: 280,
                                      }}
                                      source={{
                                        uri: item,
                                      }}
                                    />
                                  </TouchableOpacity>
                                );
                              }}
                              //Setting the number of column
                              numColumns={3}
                              keyExtractor={(item, index) => index.toString()}
                            />
                          </View>
                        ) : data?.images?.length == 0 ? (
                          <></>
                        ) : (
                          <ImageModal
                            resizeMode="contain"
                            style={{
                              width: dimensions.width - 42,
                              height: 220,
                            }}
                            source={{
                              uri: data?.images[0],
                            }}
                          />
                        )}
                        <Spacer height={20} />
                      </View>

                      <ActionSheet
                        ref={actionSheet}
                        // Title of the Bottom Sheet
                        title={'What do you do ?'}
                        // Options Array to show in bottom sheet
                        options={optionArray}
                        // Define cancel button index in the option array
                        // This will take the cancel option in bottom
                        // and will highlight it
                        cancelButtonIndex={4}
                        // Highlight any specific option
                        onPress={index => {
                          // Clicking on the option will give you alert
                          onClickSheet(optionArray[index]);
                        }}
                      />
                    </View>
                  )}
                </View>
                {showDelete && (
                  <View style={Styles.CardStyle}>
                    <Spacer height={20} />
                    <TextInput
                      style={Styles.TextInput}
                      placeholder={`Lý do hủy bài viết! (*)`}
                      keyboardType={`default`}
                      focusable={false}
                      multiline={true}
                      numberOfLines={4}
                      value={value}
                      onChangeText={text => setValue(text)}
                      secureTextEntry={false}
                    />
                    <Spacer height={20} />

                    <View
                      style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                      }}>
                      <CustomButton label="Lưu" onPress={submitPost} />
                    </View>
                    <Spacer height={20} />
                  </View>
                )}

                {showApprove && (
                  <View
                    style={{
                      display: 'flex',
                      alignSelf: 'flex-end',
                      marginRight: 12,
                    }}>
                    <CustomButton
                      label="Xác nhận duyệt bài"
                      onPress={submitPostApprove}
                    />
                  </View>
                )}
              </View>
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: '#f7f8fa',
                    flex: 1,
                    marginTop: 30,
                    paddingHorizontal: 20,
                  }}>
                  <View
                    style={{
                      height: 30,
                      display: 'flex',
                      marginTop: 10,
                      alignItems: 'flex-end',
                    }}>
                    <TouchableOpacity onPress={hideShow}>
                      <FontAwesome name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                  <Image
                    style={Styles.imageShow}
                    source={{
                      uri: imageuri,
                    }}
                  />
                </View>
              </>
            )}
          </>
        )}
        <Spacer height={20} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default DetailNotification;

const Styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#f7f8fa',
  },

  CardStyle: {
    paddingHorizontal: 12,
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
  PostImage: {
    height: '100%',
    width: '100%',
  },
  imageShow: {
    height: '80%',
    contentFit: 'contain',
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
    fontSize: 16,
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
    height: 100,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    textAlignVertical: 'center',
    borderColor: 'rgba(145, 158, 171, 0.32)',
  },
});
