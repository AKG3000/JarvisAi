import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

type CustomInputProps = {
  label: string;
  type: 'email' | 'password' | 'username';
  value: string;
  onChangeText: (text: string) => void;
  width?: number|string;
  error?: string;
};

const CustomInput: React.FC<CustomInputProps> = ({ label, type, value, onChangeText,width='100%',error }) => {

  return (
    <View style={[styles.container, { width: width as number }]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default CustomInput;