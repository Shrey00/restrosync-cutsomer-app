import { useState, useEffect } from "react";
import { View, StyleSheet, Platform, Pressable } from "react-native";
import { Text, Button, Avatar } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import SearchBar from "./Search";
import { User } from "@/types";
import { router } from "expo-router";
import * as Location from "expo-location";

const Header = ({
  user,
  showSearch,
}: {
  user: User | null;
  showSearch: boolean;
}) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 10,
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingBottom:8
    },
    locationIconContainer: {
      borderRadius: 46,
      backgroundColor: theme.colors.secondary,
      height: 46,
      width: 46,
      justifyContent: "center",
      alignItems: "center",
    },
    locationIcon: {
      color: theme.colors.primary,
    },
    locationText: {
      fontSize: 14,
      fontFamily: "jakarta-sans-semibold",
    },
    locationTextCity: {
      fontSize: 12,
      color: theme.colors.grey2,
    },
    locationRightIcon: {
      color: theme.colors.primary,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      backgroundColor: theme.colors.primary,
    },
  });
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location.coords);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  function handleLocationSetting() {}

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleLocationSetting}>
          <View style={styles.locationContainer}>
            <View style={styles.locationIconContainer}>
              <MaterialIcons
                name="location-pin"
                size={28}
                style={styles.locationIcon}
              />
            </View>
            <View>
              <Text style={styles.locationText}>Flat no.23,Shankar Nagar</Text>
              <Text style={styles.locationTextCity}>Raipur</Text>
            </View>
            <Entypo
              name="chevron-thin-right"
              size={24}
              style={styles.locationRightIcon}
            />
          </View>
        </Pressable>

        <View style={styles.rightContainer}>
          {user ? (
            <Avatar
              rounded
              size={42}
              title={user.firstName.charAt(0).toUpperCase()}
              containerStyle={styles.avatar}
            />
          ) : (
            <Button
              title="Login"
              onPress={() => {
                router.replace("/login");
              }}
            />
          )}
        </View>
      </View>
      {showSearch && <SearchBar />}
    </View>
  );
};

export default Header;
