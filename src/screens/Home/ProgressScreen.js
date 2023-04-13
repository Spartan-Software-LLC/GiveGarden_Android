/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';

import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown';
import {AuthContext} from '../../context/AuthContext';

import VerticalProgressCard from '../../components/VerticalProgressCard';

const ProgessScreen = () => {
  const {userInfo, token, loading} = useContext(AuthContext);
  const dimensions = useWindowDimensions();

  const [posts, setPosts] = useState([]);
  const [postSelect, setPostSelect] = useState();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [loadingData, setLoading] = useState(false);
  const selectRef = useRef('');
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  React.useEffect(() => {
    fetchPost();
  }, [userInfo, refreshing]);
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://api.givegarden.info/api/post/progress',
        {
          user_id: userInfo.id,
          group_id: userInfo.group_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        },
      );
      if (response.status == 200) {
        setPosts(response.data.posts);
        setPostSelect(response.data.posts);
        setUsers(response.data.users);
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      console.log('progress', err);
    }
  };

  React.useEffect(() => {
    if (loading == true) {
      setPosts([]);
      setPostSelect();
    }
  }, [loading]);

  const handleSelect = id => {
    setShow(true);
    const data = posts?.filter(item => item?.user_id == id);
    setPostSelect(data);
    if (data.length > 0) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleShow = () => {
    fetchPost()
    setShow(false);
    setError(false);
    selectRef.current.reset();
    setPostSelect(posts);
  };

  const actionDelte = async (index, id) => {
    if (index == 1) {
      await axios
        .delete(`http://api.givegarden.info/api/post/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        })
        .then(res => {
          if (res && res.status == 200) {
            Alert.alert('GIVE Garden', 'Xóa bài viết thành công', [
              {
                text: 'Đồng ý',
                style: 'cancel',
              },
            ]);
            const result = postSelect.filter(post => post.id !== id);
            setPostSelect(result);
          }
        })
        .catch(err => {
          Alert.alert('GIVE Garden', 'Không thể xóa bài viết', [
            {
              text: 'Đồng ý',
              style: 'cancel',
            },
          ]);
        });
    }
  };

  return (
    <View style={Styles.container}>
      {posts.length <= 0 && loadingData == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'small'} />
        </View>
      ) : (
        <>
          {userInfo.role != 'member' && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <SelectDropdown
                ref={selectRef}
                data={users}
                buttonStyle={{
                  marginTop: 10,
                  marginHorizontal: 10,
                  width: 200,
                  borderRadius: 30,
                  backgroundColor: 'rgba(145, 158, 171, 0.08)',
                }}
                dropdownStyle={{
                  borderRadius: 12,
                }}
                defaultButtonText={'Chọn người dùng'}
                buttonTextStyle={Styles.customText}
                defaultValue={users[0]?.name}
                onSelect={(selectedItem, index) => {
                  handleSelect(selectedItem?.id);
                }}
                dropdownIconPosition={'right'}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem.name;
                }}
                rowTextForSelection={(item, index) => {
                  return item.name;
                }}
              />

              {show && (
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    marginHorizontal: 10,
                    width: 120,
                    borderRadius: 30,
                    backgroundColor: 'rgba(145, 158, 171, 0.4)',
                  }}
                  onPress={handleShow}>
                  <Text style={[Styles.customButton, Styles.customText]}>
                    Xóa chọn
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {error == true || posts?.length <= 0 ? (
              <ScrollView
                style={{height: '100%', width: '100%'}}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={'#01A191'}
                    title={'Loading...'}
                    titleColor={'#01A191'}
                    colors={['#01A191', '#41CFBD']}
                    progressBackgroundColor={'#FFFFFF'}
                  />
                }>
                <View
                  style={{
                    height: dimensions.height - 120,
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {/* <View style={{ backgroundColor: 'grey',
                    borderRadius: 8}}> */}
                  <Text
                    style={{
                      color: '#637381',
                      paddingHorizontal: 10,
                      fontSize: 16,
                    }}>
                    Không có bài post cho member
                  </Text>
                  {/* </View> */}
                </View>
              </ScrollView>
            ) : (
              // <Text
              //   style={{
              //     color: '#637381',
              //     paddingHorizontal: 10,
              //     fontSize: 16,
              //   }}>
              //   Không có bài post cho member
              // </Text>
              <View>
                <FlatList
                  data={postSelect}
                  style={{marginTop: 10}}
                  keyExtractor={item => `${item.id}`}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item, index}) => (
                    <VerticalProgressCard
                      item={item}
                      actionDelte={actionDelte}
                    />
                  )}
                />
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ProgessScreen;

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f7f8fa',
  },
  customText: {
    color: '#637381',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  imageShow: {
    height: '80%',
    resizeMode: 'contain',
  },
});
