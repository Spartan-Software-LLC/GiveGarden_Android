import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import VerticalNotification from '../../components/VerticalNotification';
import {AuthContext} from '../../context/AuthContext';
import axios from 'axios';

const Notification = () => {
  const {userInfo, token} = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const asyncData = async () => {
      setLoading(true);
      const resData = await axios.get(
        'https://api.givegarden.info/api/notifications',
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      );

      if (resData.status == 200) {
        setData(resData.data);
        setLoading(false);
      }
    };
    asyncData();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: '#f7f8fa',
      }}>
      {data.length <= 0 && loading == true && (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={'small'} style={{paddingTop: 10}} />
        </View>
      )}
      {data.length <= 0 && loading == false ? (
        <View
          style={{
            flex: 1,
            height: '100%',
            backgroundColor: '#f7f8fa',
          }}>
          <Text style={{textAlign: 'center', paddingTop: 20}}>
            Không có thông báo mới
          </Text>
        </View>
      ) : (
        <View style={Styles.mainContent}>
          <FlatList
            style={{borderRadius: 16}}
            data={data}
            listKey={(item, index) => `_key${index.toString()}`}
            keyExtractor={(item, index) => `_key${index.toString()}`}
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <VerticalNotification
                item={item}
                onPress={() => console.log('VerticalNotification')}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Notification;
const Styles = StyleSheet.create({
  mainContent: {
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
  card: {
    borderRadius: 6,
    width: '100%',
    marginVertical: 10,
    marginBottom: 20,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
