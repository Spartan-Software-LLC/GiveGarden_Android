/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  value,
  color,
  onChangeText,
  emailValidator,
  showPassword,
  onChangeOtp,
  fieldButtonFunction,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderRadius: 30,
        height: 50,
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderColor: '#e0dada',
      }}>
     
        <TextInput
          placeholder={label}
          placeholderTextColor={color}
          keyboardType={keyboardType}
          style={{flex: 1, paddingVertical: 0}}
          secureTextEntry={false}
          value={value}
          onChangeText={onChangeText}
          onChange={onChangeOtp}
          onBlur={emailValidator}
          focusable={true}
          onSubmitEditing={fieldButtonFunction}
          autoCapitalize='none'
        />
      {/*  */}
      <TouchableOpacity onPress={showPassword}>{icon}</TouchableOpacity>
    </View>
  );
}
