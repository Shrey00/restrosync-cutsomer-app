import { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, Button, Avatar } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { MaterialIcons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import SearchBar from "./Search";
import { User } from "@/types";
import { router } from "expo-router";
import { MAP_API_KEY } from "@/constants/api";
import * as Location from "expo-location";
import useLocationStore from "@/store/locationStore";
import useModalStore from "@/store/modalsStore";
const Header = ({
  user,
  showSearch,
  setSearchText,
  searchText,
}: {
  user: User | null;
  showSearch: boolean;
  setSearchText?: any;
  searchText?: string;
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
      paddingBottom: 8,
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
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const locationText = useLocationStore((state) => state.locationText);
  const setLocationText = useLocationStore((state) => state.setLocationText);
  const [locationAccessDenied, setLocationAccessDenied] = useState<
    "waiting" | "done"
  >("waiting");

  const setAddAddressModalOpen = useModalStore(
    (state) => state.setAddAddressModalOpen
  );
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      let location: any;
      if (status !== "granted") {
        setLocationAccessDenied("done");
        return;
      } else {
        location = await Location.getCurrentPositionAsync({});
        // setLocationAccessDenied("done");
      }
      setLocation(location);
      const response = await fetch(
        `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${location.coords.latitude},${location.coords.longitude}&api_key=${MAP_API_KEY}`
      );
      const responseData = await response.json();
      let requiredLocationData = {
        formattedAddress: "",
        areaName: "",
        subLocality: "",
        neighbourhood: "",
        city: "",
        country: "",
        state: "",
        postalCode: "",
      };
      requiredLocationData.formattedAddress =
        responseData?.results[0].formatted_address;
      requiredLocationData.areaName = responseData?.results[0].name;
      responseData?.results[0].address_components.forEach(
        (item: any, index: number) => {
          if (item.types) {
            for (let i = 0; i < item.types.length; ++i) {
              if (item.types[i] === "country")
                requiredLocationData.country = item.short_name;
              if (item.types[i] === "administrative_area_level_1")
                requiredLocationData.state = item.short_name;
              if (item.types[i] === "administrative_area_level_2")
                requiredLocationData.city = item.short_name;
              if (item.types[i] === "locality")
                requiredLocationData.areaName = item.short_name;
              if (item.types[i] === "sublocality")
                requiredLocationData.subLocality = item.short_name;
              if (item.types[i] === "neighborhood")
                requiredLocationData.neighbourhood = item.short_name;
              if (item.types[i] === "postal_code")
                requiredLocationData.postalCode = item.short_name;
            }
          }
        }
      );
      setLocationText(requiredLocationData);
    })();
  }, [setLocation, setLocationText]);

  // let text = "Waiting..";
  // if (locationAccessDenied) {
  //   text = locationAccessDenied;
  // } else if (location) {
  //   text = JSON.stringify(location);
  //   console.log(text);
  // }

  function handleLocationSetting() {
    // setAddAddressModalOpen(true);
    router.push("/add-address-modal");
  }

  return (
    <View>
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

              <View style={{ minWidth: "60%", maxWidth: "68%" }}>
                {locationText.city.length > 0 ||
                  locationAccessDenied === "done" ? (
                  <View>
                    <Text style={styles.locationText} numberOfLines={1}>
                      {locationText.formattedAddress}
                    </Text>
                    <Text style={styles.locationTextCity}>
                      {locationText.state ? locationText.state : "--"},{" "}
                      {locationText.country ? locationText.country : "--"}
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.locationText} numberOfLines={1}>
                      Loading...
                    </Text>
                    <Text style={styles.locationTextCity}>Loading...</Text>
                  </View>
                )}
              </View>
              <Entypo
                name="chevron-thin-right"
                size={24}
                style={styles.locationRightIcon}
              />
            </View>
          </Pressable>

          <View style={styles.rightContainer}>
            {user?.token ? (
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
        {showSearch && (
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        )}
      </View>
    </View>
  );
};

export default Header;
