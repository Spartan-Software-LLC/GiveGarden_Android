import React, {useState, useContext} from 'react';
import {useNavigation} from '@react-navigation/native';
import {AuthContext} from '../../context/AuthContext';
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
  Alert,
  ActivityIndicator,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import SelectDropdown from 'react-native-select-dropdown';
import mime from 'mime';
//components
import Spacer from '../../components/Spacer';
import CustomButton from '../../components/CustomButton';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import axios from 'axios';
import {useTranslation} from 'react-i18next'

const HideKeyboard = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const types = ['Check In', 'Thông báo', 'Câu hỏi'];

export default function CreatePost() {
  const navigation = useNavigation();
  const [imageArr, setImage] = useState(null);
  const [type, setType] = useState(1);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const {token, isLoading, userInfo} = useContext(AuthContext);
  const {t} = useTranslation();

  const pickImage = async type => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      selectionLimit: 3,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };
  // const newImageUri = 'file:///' + imageUri.split('file:/').join('');
  const submitPost = async () => {
    setLoading(true);
    let formData = new FormData();
    const file = {
      uri:
        Platform.OS === 'android'
          ? imageArr?.uri
          : imageArr?.uri.replace('file://', ''),
      name:
        imageArr?.fileName ||
        Math.floor(Math.random() * Math.floor(999999999)) + '.jpg',
      type: mime.getType(imageArr?.uri),
    };
    {
      imageArr && formData.append('image_1', file);
    }
    if(imageArr){
      formData.append('image_length', 1);
    }else{
      formData.append('image_length', 0);

    }
    formData.append('is_public', 1);
    formData.append('type', type);
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
        if (response.status == 203) {
          Alert.alert('GIVE Garden', t('post_failed_1'), [
            {
              text: t('confirm'),
              style: 'cancel',
            },
          ])
        }
        else if (response.status == 202) {
          Alert.alert('GIVE Garden', t('post_failed_2'), [
            {
              text: t('confirm'),
              onPress: () => navigation.navigate('Home'),
              style: 'cancel',
            },
          ])
        }else{
          userInfo.role == 'member' && userInfo.group_id != 5
            ? Alert.alert('GIVE Garden', t('post_success_1'), [
                {
                  text: t('confirm'),
                  onPress: () => navigation.navigate('Home'),
                  style: 'cancel',
                },
              ])
            : userInfo.role == 'member' && userInfo.group_id == 5
            ? Alert.alert('GIVE Garden', t('post_success'), [
                {
                  text: t('confirm'),
                  onPress: () => navigation.navigate('Home'),
                  style: 'cancel',
                },
              ])
            : Alert.alert('GIVE Garden', t('post_success'), [
                {
                  text: t('confirm'),
                  onPress: () => navigation.navigate('Home'),
                  style: 'cancel',
                },
              ]);
        }
      })
      .catch(err => {
        setLoading(false);
        Alert.alert('GIVE Garden', t('post_failed'), [
          {
            text: t('confirm'),
            style: 'cancel',
          },
        ]);
      });
  };

  return (
    <HideKeyboard style={{flex: 1, height: '100%', backgroundColor: 'white'}}>
      <View style={{backgroundColor: '#f7f8fa', flex: 1, height: '100%'}}>
        <View style={styles.mainContent}>
          <Spacer height={10} />
          {/* Select image and option  */}
          <View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  backgroundColor: 'rgba(145, 158, 171, 0.08)',
                  borderRadius: 50,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  padding: 8,
                  width: 120,
                  height: 50,
                }}>
                <Ionicons
                  name="images"
                  size={24}
                  color="#10C45C"
                  style={{paddingTop: 4, paddingLeft: 4}}
                />
                <Text style={[styles.customText, {padding: 8}]}>Hình ảnh</Text>
              </TouchableOpacity>

              <SelectDropdown
                data={['Check In', t('anouncement'), t('question')]}
                buttonStyle={{
                  width: 150,
                  borderRadius: 50,
                  backgroundColor: 'rgba(145, 158, 171, 0.08)',
                }}
                dropdownStyle={{
                  borderRadius: 16,
                }}
                buttonTextStyle={styles.customText}
                defaultValue={types[0]}
                onSelect={(selectedItem, index) => {
                  setType(index + 1);
                }}
                renderDropdownIcon={isOpened => {
                  return (
                    <FontAwesome
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      color={'#637381'}
                      size={14}
                      style={{marginRight: 10}}
                    />
                  );
                }}
                dropdownIconPosition={'right'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>
          </View>
          <Spacer height={20} />
          {/* Input text  */}
          <TextInput
            style={styles.TextInput}
            placeholder={t('content')}
            keyboardType={`default`}
            focusable={false}
            multiline={true}
            numberOfLines={4}
            value={value}
            onChangeText={text => setValue(text)}
            secureTextEntry={false}
          />
          <Spacer height={20} />

          {imageArr && (
            <Image
              source={{uri: imageArr?.uri}}
              style={{
                alignSelf: 'center',
                width: '100%',
                height: 280,
                resizeMode: 'contain',
              }}
            />
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
              <CustomButton label={t('post')} onPress={submitPost} />
            )}
          </View>
          <Spacer height={20} />
        </View>
      </View>
    </HideKeyboard>
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
  },
});
