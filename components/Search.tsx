import { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import { Input } from "@rneui/themed";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useTheme } from "@rneui/themed";
import { useRouter, useSegments } from "expo-router";
import useModalStore from "@/store/modalsStore";
import useOrderStore from "@/store/orderStore";
const SearchBar = ({
  setSearchText,
  searchText,
}: {
  setSearchText?: any;
  searchText?: string;
}) => {
  const { theme } = useTheme();
  const getCurrentOrders = useOrderStore((state) => state.getCurrentOrders);
  const currentOrders = getCurrentOrders();
  const orders = useOrderStore((state) => state.orders);
  const setHoverOrderCardVisible = useModalStore(
    (state) => state.setHoverOrderInfo
  );
  const styles = StyleSheet.create({
    inputOuterContainer: {
      width: "100%",
      margin: 0,
      paddingHorizontal: 0,
      paddingBottom: 16,
      paddingTop: 8,
    },
    inputInnerContainer: {
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

  const inputRef = useRef(null);
  const segments = useSegments(); // Detects route changes
  useEffect(() => {
    if (segments[1] === "search" && inputRef.current) {
      setHoverOrderCardVisible(false);
      inputRef.current?.focus();
    } else if (orders.length > 0) {
      setHoverOrderCardVisible(true);
    }
  }, [segments, orders]);

  const router = useRouter();
  const handleSearchBarFocus = () => {
    router.replace("/search");
  };
  return (
    <View style={{ margin: 0 }}>
      <Input
        ref={inputRef}
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
        onPress={handleSearchBarFocus}
      />
    </View>
  );
};

export default SearchBar;
