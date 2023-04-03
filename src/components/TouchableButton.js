import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';

const TouchableButton = ({
  title,
  textStyle,
  containerStyle,
  buttonStyle,
  interalView,
  actionEdit,
  ...rest
}) => {
  return (
    <View style={[Styles.container, containerStyle]}>
      <TouchableOpacity
        {...rest}
        style={[Styles.touchableStyle, buttonStyle]}
        onPress={actionEdit}>
        <View style={[Styles.interalView, interalView]}>
          <Text style={[Styles.textStyle, textStyle]}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TouchableButton;

const Styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    height: 50,
  },
  touchableStyle: {
    width: '100%',
    height: '100%',
    backgroundColor: '#226ddcff',
    borderRadius: 60,
  },
  interalView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#226ddcff',
    borderRadius: 60,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'uppercase',
  },
});
