/* eslint-disable react-native/no-inline-styles */
import {Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#10C45C',
        borderRadius: 30,
        paddingHorizontal: 24,
        paddingVertical: 10,
        alignSelf: 'flex-end',
        // marginRight: 16,
      }}>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontWeight: '600',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
