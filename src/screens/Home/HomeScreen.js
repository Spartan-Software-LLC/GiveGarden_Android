/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  StyleSheet,
  FlatList,
  View,
  Text,
  ActivityIndicator,
  ImageBackground,
  Alert,
  useWindowDimensions 
} from 'react-native';
import moment from 'moment';
import {Image} from 'expo-image';
import {ScrollView} from 'react-native-virtualized-view';
import axios from 'axios';
import VerticalPostCard from '../../components/VerticalPostCard';
import {AuthContext} from '../../context/AuthContext';

const Afternoon = require('../../../assets/images/frame.png');
const Avatar = require('../../../assets/images/avatar_default.jpg');

const HomeScreen = () => {
  const {userInfo, token, loading} = useContext(AuthContext);
  const dimensions = useWindowDimensions();
  const [data, setData] = React.useState([]);
  const [topGroup, setTopGroup] = React.useState();
  const [isLoadingU, setLoadingU] = React.useState(false);
  const [loadingPost, setLoadingPost] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [count_page, setCountPage] = React.useState(1);
  const [last_page, setLastPage] = React.useState(100);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setCountPage(1);
    setTimeout(() => {
      fetchPostDataRefeshing()
      setRefreshing(false);
    }, 1000);
  }, []);

  React.useEffect(() => {
    const fetchTopGroup = async () => {
      try {
        const response = await axios.post(
          'http://api.givegarden.info/api/groups/index',
          {
            id: userInfo?.group_id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

        if (response.status == 200) {
          setTopGroup(response.data);
        }
      } catch (err) {
        console.log('homescreen1', err);
      }
    };
    fetchTopGroup();
  }, [userInfo,loading]);

  React.useEffect(() => {
    fetchPostData();
  }, [userInfo,loading]);

  const fetchPostDataRefeshing = async () => {
    try {
        setLoadingPost(true);
        const response = await axios.post(
          'http://api.givegarden.info/api/posts/community?page=' + count_page,
          {
            group_id: userInfo?.group_id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

        if (response?.status == 200) {
          setData(response.data.data);
          setCountPage(count_page + 1);
          setLastPage(response.data.last_page);
          setLoadingPost(false);
        } else {
          console.log('fetchPostDataRefeshing');
          setLoadingPost(false);
        }
      
    } catch (err) {
      console.error('fetchPostDataRefeshing', err);
    }
  };

  React.useEffect(() => {
    if (loading == true) {
      setData([]);
      setCountPage(1);
      setLastPage(100);
    }
  }, [loading]);

  const fetchPostData = async () => {
    try {
      if (last_page < count_page) {
        setLoadingU(true);
      } else {
        setLoadingPost(true);
        const response = await axios.post(
          'http://api.givegarden.info/api/posts/community?page=' + count_page,
          {
            group_id: userInfo?.group_id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token,
            },
          },
        );

        if (response?.status == 200) {
          setData([...data, ...response.data.data]);
          setCountPage(count_page + 1);
          setLastPage(response.data.last_page);
          setLoadingPost(false);
        } else {
          console.log('err');
          setLoadingPost(false);
        }
      }
    } catch (err) {
      console.error('homescreen', err);
    }
  };

  const renderFooterComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {isLoadingU == true ? (
          <View style={{backgroundColor: 'grey', borderRadius: 4}}>
            <Text
              style={{
                paddingHorizontal: 6,
                paddingVertical: 4,
                color: 'white',
              }}>
              Loading
            </Text>
          </View>
        ) : (
          <ActivityIndicator size={'small'} />
        )}
      </View>
    );
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
          if (res.status == 200) {
            Alert.alert('Give Garden', 'Xóa bài viết thành công', [
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]);
            const result = data.filter(post => post.id !== id);
            setData(result);
          }
        })
        .catch(err => {
          Alert.alert('Give Garden', 'Không thể xóa bài viết', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]);
        });
    }
  };

  const renderItem =({item, index}) => (
    <VerticalPostCard
      containerStyle={{
        marginLeft: 24,
        marginRight: 24,
      }}
      imageStyle={{
        marginTop: 35,
        height: 150,
        width: 150,
      }}
      item={item}
      key={index}
      actionDelte={actionDelte}
      onPress={() => console.log('VerticalPostCard')}
    />
  );

  return (
    <>
      {data.length <= 0 && loadingPost == true ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f7f8fa',
          }}>
          <ActivityIndicator size={'small'} />
        </View>
      ) : data.length <= 0 && loadingPost == false ? (
        <ScrollView
          style={{height: '100%'}}
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
              justifyContent:'center',
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
              Không có bài post
            </Text>
            {/* </View> */}
          </View>
        </ScrollView>
      ) : (
        <View style={Styles.container}>
          <ScrollView
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
            <View>
              <FlatList
                data={data}
                removeClippedSubviews={true}
                ListHeaderComponent={
                  <View>
                    {/* View image  */}
                    <ImageBackground
                      source={Afternoon}
                      style={{
                        width: '100%',
                        height: 110,
                      }}
                    />

                    <Text
                      style={{
                        position: 'absolute',
                        top: 16,
                        left: 20,
                        fontWeight: 'bold',
                        fontSize: 30,
                        color: 'white',
                      }}>
                      {topGroup?.title}
                    </Text>
                    <Text
                      style={{
                        position: 'absolute',
                        top: 50,
                        left: 20,
                        fontWeight: 'bold',
                        fontSize: 16,
                        color: 'white',
                      }}>
                      {moment(topGroup?.open_at).format('L')}
                    </Text>
                    {/* Bảng xếp hạng */}
                    <View style={{position: 'relative', marginTop: -30}}>
                      <View style={Styles.CardStyle}>
                        <Text style={Styles.titleTop}>
                          BẢNG XẾP HẠNG NGƯỜI DÙNG CỦA THÁNG
                        </Text>

                        {/* top rank user */}
                        <View style={Styles.dataTop}>
                          {topGroup &&
                            topGroup?.top_user?.map((item, index) => (
                              <View
                                key={index}
                                style={{
                                  flexDirection: 'row',
                                  flex: 1,
                                  marginHorizontal: 4,
                                }}>
                                <View
                                  style={{
                                    position: 'relative',
                                  }}>
                                  <View style={Styles.dataRank}>
                                    <View
                                      style={{
                                        width: 15,
                                        height: 15,
                                        borderRadius: 50,
                                        backgroundColor: '#10C45C',
                                        justifyContent: 'center',
                                      }}>
                                      <Text
                                        style={{
                                          textAlign: 'center',
                                          color: 'white',
                                          fontSize: 7,
                                          fontWeight: 'bold',
                                        }}>
                                        {item.level}
                                      </Text>
                                    </View>
                                  </View>
                                  {item.avatar ? (
                                    <Image
                                      source={{uri: `${item.avatar}`}}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 40,
                                      }}
                                    />
                                  ) : (
                                    <Image
                                      source={Avatar}
                                      style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 40,
                                      }}
                                    />
                                  )}
                                </View>
                                <View
                                  style={{
                                    flex: 2,
                                    marginLeft: 8,
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      fontSize: 10,
                                      color: '#212B36',
                                      fontWeight: 'bold',
                                    }}>
                                    {item.name}
                                  </Text>
                                </View>
                              </View>
                            ))}
                        </View>
                      </View>
                    </View>
                  </View>
                }
                initialNumToRender={data.length} // Reduce initial render amount
                maxToRenderPerBatch={100}
                scrollEnabled={false}
                updateCellsBatchingPeriod={100}
                onEndReached={fetchPostData}
                onEndReachedThreshold={1}
                keyExtractor={(item, index) => index}
                renderItem={renderItem}
                ListFooterComponent={renderFooterComponent}
                
              />
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default HomeScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f7f8fa',
  },
  CardStyle: {
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
  titleTop: {
    color: '#212B36',
    fontSize: 12,
    fontWeight: 'bold',
    paddingTop: 16,
    textAlign: 'center',
  },
  dataTop: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  dataRank: {
    width: 17,
    height: 17,
    borderRadius: 40,
    backgroundColor: 'white',
    position: 'absolute',
    zIndex: 100,
    top: -4,
    left: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});