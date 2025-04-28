import React from "react";
import { DimensionValue, StyleSheet } from "react-native";
import { Input, InputProps, useTheme } from "@rneui/themed";
import { Text } from "react-native";
interface CustomInputProps extends InputProps {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  label?: string;
  width?: DimensionValue;
  height?: DimensionValue;
}

const CustomInput: React.FC<CustomInputProps> = ({
  leftIcon,
  rightIcon,
  label,
  width,
  height,
  ...props
}) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    inputOuterContainer: {
      width: width ? width : "100%",
      margin: 0,
      paddingHorizontal: 0,
      paddingVertical: 8,
    },
    inputInnerContainer: {
      height: height ? height : 41,
      borderWidth: 0.4,
      borderBottomWidth: 0.4,
      borderColor: theme.colors.grey4,
      paddingHorizontal: 8,
      margin: 0,
      backgroundColor: "#fff",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 4,
      elevation: 2,
    },
    input: {
      fontSize: 14,
      height: height ? height : 41,
      fontFamily: "jakarta-sans-regular",
    },
    inputErrorStyle: {
      margin: 0,
      // fontSize: 0,
    },
    label: {
      fontFamily: "jakarta-sans-medium",
      fontSize: 13,
      fontWeight: 600,
      marginBottom: 4,
      color: theme.colors.grey2,
    },
  });
  return (
    <>
      {/* <View style={styles.mainInputContainer}> */}

      {/* </View> */}
      {/* {label && <Text style={styles.label}>{label}</Text>} */}
      <Input
        label={label}
        containerStyle={styles.inputOuterContainer}
        inputContainerStyle={{ ...styles.inputInnerContainer }}
        inputStyle={styles.input}
        errorStyle={styles.inputErrorStyle}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        labelStyle={styles.label}
        {...props}
      />
    </>
  );
};

export default CustomInput;
