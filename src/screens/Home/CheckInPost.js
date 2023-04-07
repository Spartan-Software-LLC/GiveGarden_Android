import React, {useContext, createContext, useEffect} from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import CreatePostPublic from './CreatePostPublic';
import CreatePostPrivate from './CreatePostPrivate';
import {SlideContext} from '../../context/SlideContext';
// const theme = useContext(ThemeContext);
const FirstRoute = () => (
  <View style={[styles.container]}>
    <CreatePostPublic />
  </View>
);
const SecondRoute = () => (
  <View style={[styles.container]}>
    <CreatePostPrivate />
  </View>
);

export default class CheckInPost extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    index: `${this.props.slide}` === 'home' ? 0 : 1,
    routes: [
      {key: `home`, title: 'Cộng đồng'},
      {key: `progress`, title: 'Hình chuyển đổi'},
    ],
  };

  _handleIndexChange = index => this.setState({index});

  _renderTabBar = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const {slide} = useContext(SlideContext);
    return (
      <SafeAreaView>
        <View style={styles.tabBar}>
          {props.navigationState.routes.map((route, i) => {
            const opacity = props.position.interpolate({
              inputRange,
              outputRange: inputRange.map(inputIndex =>
                inputIndex === i ? 1 : 0.3,
              ),
            });

            return (
              <TouchableOpacity
                style={styles.tabItem}
                key={i}
                onPress={() => this.setState({index: i})}>
                <Animated.Text
                  style={{opacity, fontSize: 15, fontWeight: '600', }}>
                  {route.title}
                </Animated.Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    );
  };

  _renderScene = SceneMap({
    home: FirstRoute,
    progress: SecondRoute,
  });

  render() {
    return (
      <TabView
        lazy
        navigationState={this.state}
        renderScene={this._renderScene}
        renderTabBar={this._renderTabBar}
        onIndexChange={this._handleIndexChange}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#f7f8fa',
    // backgroundColor: 'red',
    paddingRight: '30%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
  },
});
