import React from 'react';
import {View, Text} from 'react-native';

const Spacer = ({height, width, color}) => {
  return (
    <View
      style={{
        width: width ? width : '100%',
        height: height ? height : 15,
        backgroundColor: color,
      }}
    />
  );
};

export default Spacer;
