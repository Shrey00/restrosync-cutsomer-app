import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "@rneui/themed";
const SearchBar = () => {
  const [searchText, setSearchText] = useState("");
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    inputOuterContainer: {
      width: "100%",
      margin: 0,
      paddingHorizontal:0,
      paddingBottom: 16,
      paddingTop: 8
    },
    inputInnerContainer: {
      borderBottomWidth: 0,
      borderColor: "#EF9A9A",
      paddingHorizontal: 8,
      // borderRadius: 4,
      margin:0,
      backgroundColor: "#fff",
      // padding: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 4,
      elevation: 5, // For Android
    },
    input: {
      fontSize: 14,
      fontFamily: "jakarta-sans-regular",
    },
    inputErrorStyle: {
      margin: 0,
      fontSize: 0,
    },
    icon: {
      position: "absolute",
      right: 10,
    },
  });

  return (
    <View style={{ margin: 0 }}>
      <Input
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
        rightIcon={
          <AntDesign
            name="search1"
            size={24}
            style={{ color: theme.colors.primary }}
          />
        }
        containerStyle={styles.inputOuterContainer}
        inputContainerStyle={styles.inputInnerContainer}
        inputStyle={styles.input}
        errorStyle={styles.inputErrorStyle}
      />
    </View>
  );
};

export default SearchBar;
