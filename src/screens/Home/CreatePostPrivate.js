import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
//components
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {Ionicons, FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';

const HideKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
const titleImage = ['Ảnh đằng trước', 'Ảnh bên hông', 'Ảnh đằng sau'];

export default function CreatePostPrivate() {
  const {token, userInfo} = useContext(AuthContext);
  const navigation = useNavigation();

  const [value, setValue] = useState('');
  const [images, setImages] = useState([['1'], ['1'], ['1']]);
  const [counts, setCount] = useState([0, 0, 0]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisibleStatus, setModalVisibleStatus] = useState(false);

  const pickImage = async index => {
    setModalVisibleStatus(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 1,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      let tmp = [...images];
      tmp[index] = result.assets ? result.assets : result.canceled;
      setImages(tmp);
      let count = [...counts];
      count[index] = 1;
      setCount(count);
    }
    setModalVisibleStatus(false);
  };

  const isBelowThreshold = currentValue => currentValue == 1;
  let checkImage = counts.every(isBelowThreshold);

  const submitPost = async () => {
    if (checkImage == false || value == '') {
      Alert.alert(
        'Give Garden',
        'Vui lòng chọn 3 ảnh và điền đẩy đủ nội dung',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );
    } else {
      setLoading(true);
      let formData = new FormData();
      images.forEach((image, index) => {
        formData.append(`image_${index + 1}`, {
          uri:
            Platform.OS === 'android'
              ? image[0]?.uri
              : image[0]?.uri?.replace('file://', ''),
          name:
            image[0]?.fileName ||
            Math.floor(Math.random() * Math.floor(999999999)) + '.png',
          type: image[0]?.type || 'image/jpeg',
        });
      });
      formData.append('image_length', images.length);
      formData.append('is_public', 0);
      formData.append('type', 0);
      formData.append('content', value);
      formData.append('group_id', userInfo.group_id);
      await axios
        .post('http://api.givegarden.info/api/posts/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token,
          },
        })
        .then(response => {
          setLoading(false);
          response.status === 200 &&
            Alert.alert('Give Garden', 'Đăng bài thành công', [
              {
                text: 'Cancel',
                onPress: () => navigation.navigate('Progress'),
                style: 'cancel',
              },
            ]);
        })
        .catch(err => {
          setLoading(false);
          Alert.alert('Give Garden', 'Đăng bài thất bại', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
        });
    }
  };

  return (
    <>
      <HideKeyboard style={{flex: 1, height: '100%'}}>
        <ScrollView
          style={{backgroundColor: '#f7f8fa', flex: 1, height: '100%'}}>
          <View style={styles.mainContent}>
            <Spacer height={20} />
            {/* Input text  */}
            <TextInput
              style={styles.TextInput}
              placeholder={`Nội dung bài viết bạn muốn đăng...`}
              keyboardType={`default`}
              focusable={false}
              multiline={true}
              numberOfLines={4}
              value={value}
              onChangeText={text => setValue(text)}
              secureTextEntry={false}
            />
            <Spacer height={20} />

            {!isLoading && images.length > 0 && (
              <>
                <FlatList
                  data={images}
                  renderItem={({item, index}) => (
                    <View style={styles.imageContainerStyle}>
                      <TouchableOpacity
                        disabled={modalVisibleStatus}
                        key={item.id}
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: 'rgba(145, 158, 171, 0.32)',
                          borderRadius: 4,
                        }}
                        onPress={() => {
                          pickImage(index);
                        }}>
                        <MaterialIcons
                          style={{
                            position: 'absolute',
                            zIndex: 10,
                            opacity: 0.1,
                          }}
                          name="camera-alt"
                          size={36}
                          color="black"
                        />
                        <Image
                          style={styles.imageStyle}
                          source={{
                            uri: item[0].uri,
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
            )}

            {!isLoading && titleImage.length > 0 && (
              <>
                <FlatList
                  data={titleImage}
                  renderItem={({item}) => (
                    <View style={styles.titleContainerStyle}>
                      <Text style={{textAlign: 'center'}}>{item}</Text>
                    </View>
                  )}
                  //Setting the number of column
                  numColumns={3}
                  keyExtractor={(item, index) => index.toString()}
                />
              </>
            )}

            <Spacer height={20} />
            {/* Button Submit  */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              {loading == true ? (
                <ActivityIndicator size={'small'} />
              ) : (
                <CustomButton label={'Đăng bài'} onPress={submitPost} />
              )}
            </View>
            <Spacer height={20} />
          </View>
        </ScrollView>
      </HideKeyboard>
    </>
  );
}

const styles = StyleSheet.create({
  mainContent: {
    marginHorizontal: 10,
    marginTop: 10,
    paddingHorizontal: 20,
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
  InfoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#919EAB, 0.32',
  },
  InfoView: {
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
  },
  mainInfoView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    paddingHorizontal: 15,
  },
  Header: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  city: {
    fontSize: 13,
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
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemImage: {
    backgroundColor: '#2F455C',
    height: 150,
    width: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  customText: {
    color: '#637381',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 12,
  },
  image: {
    width: 110,
    height: 110,
    marginRight: 10,
  },
  customSlide: {
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  customImage: {
    width: '100%',
    height: 250,
    // resizeMode: 'contain',
  },

  imageContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  titleContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    margin: 1,
  },
  imageStyle: {
    height: 200,
    width: '100%',
  },
  fullImageStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '98%',
    resizeMode: 'contain',
  },
  imageShow: {
    height: '80%',
    resizeMode: 'contain',
  },
});
