import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps } from '@rneui/themed';

interface CustomInputProps extends InputProps {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
}

const CustomInput: React.FC<CustomInputProps> = ({
  leftIcon,
  rightIcon,
  ...props
}) => {
  return (
    <Input
      containerStyle={styles.inputOuterContainer}
      inputContainerStyle={styles.inputInnerContainer}
      inputStyle={styles.input}
      errorStyle={styles.inputErrorStyle}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  inputOuterContainer: {
    width: '100%',
    margin: 0,
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  inputInnerContainer: {
    borderBottomWidth: 0,
    borderColor: '#EF9A9A',
    paddingHorizontal: 8,
    margin: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 4, 
  },
  input: {
    fontSize: 14,
    fontFamily: 'jakarta-sans-regular',
  },
  inputErrorStyle: {
    margin: 0,
    fontSize: 0,
  },
});

export default CustomInput;