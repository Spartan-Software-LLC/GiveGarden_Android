import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Image} from 'expo-image';
import {Ionicons, MaterialIcons, Entypo} from '@expo/vector-icons';
import axios from 'axios';
import React, {useState, useContext, useEffect} from 'react';
import * as ImagePicker from 'expo-image-picker';
//Context
import {AuthContext} from '../../context/AuthContext';
//component
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';

const Profile = () => {
  MaterialIcons.loadFont();
  const {userInfo, isLoading, token, logout} = useContext(AuthContext);
  const [name, setName] = useState(userInfo?.name);
  const [email, setEmail] = useState(userInfo?.email);
  const [phone, setPhone] = useState(userInfo?.phone);
  const [image, setImage] = useState(userInfo?.avatar);
  const [err, setErrEmail] = useState(null);
  const [showImages, setImages] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async type => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImages(true);
      setImage(result.assets[0]);
    }
  };

  const submitPost = async () => {
    if (email.trim() === '') {
      setErrEmail('Email là bắt buộc');
      return false;
    } else if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      setErrEmail('Email không đúng định dạng');
      return false;
    } else {
      setErrEmail(null);
    }

    if (err === null) {
      let formData = new FormData();
      let file;
      showImages === true &&
        (file = {
          uri:
            Platform.OS === 'android'
              ? image?.uri
              : image?.uri?.replace('file://', ''),
          name:
            image?.fileName ||
            Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
          type: image?.type || 'image/jpeg',
        });
      formData.append('id', userInfo.id);
      showImages === true && formData.append('avatar', file);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);

      setLoading(true);
      await axios
        .post('https://api.givegarden.info/api/users/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
          },
        })
        .then(response => {
          Alert.alert('Give Garden', 'Update thành công', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
          setLoading(false);
        })
        .catch(err => {
          Alert.alert('Give Garden', 'Update thất bại', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
          setLoading(false);
        });
    }
  };
  if (isLoading === true && userInfo !== null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'small'} />
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 64}>
        <ScrollView
          style={{
            backgroundColor: '#f7f8fa',
            height: '100%',
          }}>
          {userInfo && (
            <View>
              {/* Card Infor */}
              <View style={styles.mainContent}>
                {/* View Screen Image  */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  {/* Image  */}
                  <ImageBackground
                    source={require('../../../assets/images/layout_infor.png')}
                    resizeMode="cover"
                    style={{
                      height: 220,
                      width: '100%',
                      justifyContent: 'center',
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      overflow: 'hidden',
                    }}>
                    <View
                      style={{
                        width: '60%',
                        height: '80%',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                      }}>
                      <TouchableOpacity
                        onPress={pickImage}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <MaterialIcons
                          style={{
                            position: 'absolute',
                            zIndex: 10,
                            opacity: 0.3,
                          }}
                          name="camera-alt"
                          size={36}
                          color="black"
                        />
                        {showImages === true ? (
                          <Image
                            style={{
                              height: 80,
                              width: 80,
                              borderRadius: 50,
                              backgroundColor: 'grey',
                            }}
                            source={{uri: `${image?.uri}`}}
                          />
                        ) : (
                          <Image
                            style={{
                              height: 80,
                              width: 80,
                              borderRadius: 50,
                              backgroundColor: 'grey',
                            }}
                            source={{
                              uri: userInfo?.avatar,
                            }}
                          />
                        )}
                      </TouchableOpacity>

                      <View
                        style={{
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10,
                            color: 'white',
                          }}>
                          {userInfo?.name ? userInfo.name : 'Chưa cập nhật'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            color: 'white',
                            paddingTop: 4,
                          }}>
                          {userInfo?.role ? userInfo.role : 'Chưa cập nhật'}
                        </Text>
                      </View>
                    </View>
                  </ImageBackground>
                </View>
                <Spacer height={20} />
                {/* Input info change  */}
                <View>
                  <View style={styles.ViewForm}>
                    <Text style={styles.NameInput}>Unique ID (*)</Text>
                    <TextInput
                      editable={false}
                      selectTextOnFocus={false}
                      style={styles.TextInput}
                      placeholder={
                        `${userInfo.id}`
                          ? `${userInfo.country_code}-00000${userInfo.id}`
                          : 'Chưa cập nhật'
                      }
                      placeholderTextColor="green"
                      keyboardType={`default`}
                      focusable={false}
                    />
                  </View>
                  <View style={styles.ViewForm}>
                    <Text style={styles.NameInput}>Họ và tên</Text>
                    <TextInput
                      style={styles.TextInput}
                      value={name}
                      onChangeText={text => setName(text)}
                      placeholderTextColor="grey"
                      keyboardType={`default`}
                      focusable={false}
                    />
                  </View>
                  <View style={styles.ViewForm}>
                    <Text style={styles.NameInput}>Số điện thoại</Text>
                    <TextInput
                      style={styles.TextInput}
                      value={phone}
                      onChangeText={text => setPhone(text)}
                      placeholderTextColor="grey"
                      keyboardType={`default`}
                      focusable={false}
                    />
                  </View>
                  <View style={styles.ViewForm}>
                    <Text style={styles.NameInput}>Email (*)</Text>
                    <TextInput
                      style={styles.TextInput}
                      value={email}
                      onChangeText={text => setEmail(text)}
                      placeholderTextColor="grey"
                      keyboardType={`default`}
                      focusable={false}
                    />
                    {err !== null && <Text style={{color: 'red'}}>{err}</Text>}
                  </View>
                </View>

                {/* Input create  */}
                <Spacer height={40} />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    onPress={() => logout()}
                    style={{
                      backgroundColor: '#10C45C',
                      borderRadius: 30,
                      paddingHorizontal: 24,
                      paddingVertical: 10,
                      marginLeft: 16,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: '600',
                      }}>
                      Đăng xuất
                    </Text>
                  </TouchableOpacity>
                  <View style={{marginRight: 16}}>
                    {loading == true ? (
                      <>
                        <ActivityIndicator size={'small'} />
                      </>
                    ) : (
                      <CustomButton label={'Lưu'} onPress={submitPost} />
                    )}
                  </View>
                </View>
                <Spacer height={40} />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
};

export default Profile;

const styles = StyleSheet.create({
  mainContent: {
    marginTop: 10,
    marginHorizontal: 12,
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

  ViewForm: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  NameInput: {
    marginBottom: 8,
    color: 'grey',
  },
  TextInput: {
    borderWidth: 1,
    padding: 12,
    paddingTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    textAlignVertical: 'center',
    borderColor: '#eeeeee',
    color: 'grey',
  },
});
