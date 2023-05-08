import {AppRegistry, Platform} from 'react-native';
import {registerRootComponent} from 'expo';
import App from './App';
import {Text} from 'react-native';
import {name as appName} from './app.json';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
if (Platform.OS == 'android') {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  AppRegistry.registerComponent(appName, () => App);
} else {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  AppRegistry.registerComponent(appName, () => App);
}
