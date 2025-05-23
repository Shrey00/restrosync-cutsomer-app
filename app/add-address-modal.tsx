import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  Pressable,
  InteractionManager
} from "react-native";
import { Button, useTheme } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { api } from "@/constants/api";
import Entypo from "@expo/vector-icons/Entypo";
import useUserStore from "@/store/userStore";
import CustomInput from "../components/ui/CustomInput";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { AddressType } from "@/types";
import { useRouter } from "expo-router";
import useLocationStore from "@/store/locationStore";
import SelectDropdown from "react-native-select-dropdown";
import { Skeleton } from "@rneui/base";
const AddAddressModal = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offaddressModalScreen)
  const isOpen = true;
  const user = useUserStore((state) => state.user);
  const locationText = useLocationStore((state) => state.locationText);
  const setNewLocation = useLocationStore((state) => state.setNewLocation); //new location to handle food ordering to address where user is not present
  const location = useLocationStore((state) => state.location);
  const [addressSubmitLoading, setAddressSubmitLoading] = useState(false);
  const [addressButtonTitle, setAddressButtonTitle] = useState("Add Address");
  const [addressButtonDisabled, setAddressDisabled] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [addressDetailsFormData, setAddressDetailsFormData] =
    useState<AddressType>({
      address_line_1: "",
      address_line_2: "",
      city: locationText.city,
      state: locationText.state,
      country: locationText.country,
      postalCode: locationText.postalCode,
      location: {
        x: location?.coords.latitude,
        y: location?.coords.longitude,
      },
      type: "",
      selected: false,
    });
  const [addressModalScreen, setAddressModalScreen] = useState(1);
  const centerCoordinates: {
    latitude: number;
    longitude: number;
  } = { latitude: 0, longitude: 0 };

  const [initialRegion, setInitialRegion] = useState<Region | undefined>(
    undefined
  );

  if (isOpen) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  const closeModal = () => {
    // Animated.timing(slideAnim, {
    //   toValue: 800, // Slide back down
    //   duration: 120,
    //   useNativeDriver: true,
    // }).start(() => setIsOpen(false));
    router.back();
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      height: "80%",
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    modalText: {
      textAlign: "center",
      fontSize: 18,
      marginTop: 20,
    },
    itemDetailContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
    },

    addresssButton: {
      borderRadius: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 0,
      width: "100%",
    },
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      marginTop: 10,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
    map: {
      flex: 1,
      borderRadius: 8,
    },
    addButtonDetails: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      marginTop: 12,
      height: 52,
    },
    addButtonDetailsTitle: {
      fontSize: 16,
    },
    addButtonDetailsContainer: {
      borderRadius: 4,
      paddingVertical: 8,
    },
  });

  const handleRegionChangeComplete = (newRegion: any) => {
    setAddressDetailsFormData({
      ...addressDetailsFormData,
      location: {
        x: newRegion.latitude,
        y: newRegion.longitude,
      },
    });
  };
  const handleAddNewLocation = () => {
    setNewLocation(centerCoordinates);
    setAddressModalScreen(2);
  };
  const handleAddressForm = (inputName: string, text: string) => {
    setAddressDetailsFormData((prev) => {
      return {
        ...prev,
        [inputName]: text,
      };
    });
  };
  const handleBackButton = () => {
    setAddressModalScreen(1);
  };
  const handleAddressFormSubmit = async () => {
    setAddressSubmitLoading(true);
    await fetch(`${api}/address/add-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(addressDetailsFormData),
    });
    setAddressSubmitLoading(false);
    setAddressButtonTitle("Added 🎉");
    setTimeout(() => {
      // setIsOpen(false);
      setAddressModalScreen(1);
      setAddressDetailsFormData({
        ...addressDetailsFormData,
        address_line_1: "",
        address_line_2: "",
        type: "",
      });
      setAddressButtonTitle("Add Address");
      router.back();
    }, 1000);
  };

  useEffect(() => {
    if (isOpen && initialRegion?.latitudeDelta !== 0.0922) {
      (async () => {
        try {
          if (location) {
            setInitialRegion({
              latitude: location?.coords.latitude,
              longitude: location?.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        } catch (e) {
          console.log(e);
        }
      })();
      setAddressDetailsFormData({
        ...addressDetailsFormData,
        city: locationText.city,
        state: locationText.state,
        country: locationText.country,
        postalCode: locationText.postalCode,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    var flag = 0;
    Object.keys(addressDetailsFormData).forEach((key) => {
      if ((addressDetailsFormData as any)[key].length === 0) {
        flag = 1;
      }
    });
    if (flag === 0) {
      setAddressDisabled(false);
    } else {
      setAddressDisabled(true);
    }
  }, [addressDetailsFormData]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setShowMap(true));
    return () => task.cancel();
  }, [])
  return (
    <Modal transparent visible={isOpen} animationType="none">
      <View style={styles.modalOverlay}>
        <Pressable style={{ flex: 1 }} onPress={closeModal}></Pressable>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHeader}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              {addressModalScreen === 2 && (
                <Pressable onPress={handleBackButton}>
                  <Entypo
                    name="chevron-thin-left"
                    size={22}
                    color={theme.colors.primary}
                  />
                </Pressable>
              )}
              <Text
                style={{
                  fontFamily: "jakarta-sans-semibold",
                  fontSize: 16,
                  marginBottom: 5,
                }}
              >
                Add Address
              </Text>
            </View>

            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" type="antdesign" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {addressModalScreen === 1 && (
            showMap ?
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}>
                  <MapView
                    style={StyleSheet.absoluteFillObject}
                    initialRegion={initialRegion}
                    showsUserLocation={true}
                    provider={PROVIDER_GOOGLE}
                    followsUserLocation={true}
                    onRegionChangeComplete={handleRegionChangeComplete}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: [{ translateX: -25 }, { translateY: -50 }],
                    }}
                  >
                    <MaterialIcons
                      name="location-pin"
                      size={50}
                      color={theme.colors.primary}
                    />
                  </View>
                </View>
                <Button
                  title="Add Details"
                  titleStyle={styles.addButtonDetailsTitle}
                  buttonStyle={styles.addButtonDetails}
                  containerStyle={styles.addButtonDetailsContainer}
                  onPress={handleAddNewLocation}
                />
              </View>
              :
              <View style={styles.skeletonContainer}>
                <Skeleton
                  animation="pulse"
                  height={570}
                  style={styles.skeletonStructure}
                  skeletonStyle={styles.skeleton}
                />
                <Skeleton
                  animation="pulse"
                  height={48}
                  style={styles.skeletonStructure}
                  skeletonStyle={styles.skeleton}
                />
              </View>
          )}
          {/* {addressModalScreen-2} */}
          {addressModalScreen === 2 && (
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <View>
                <Text
                  style={{
                    marginBottom: 12,
                    fontFamily: "jakarta-sans-medium",
                  }}
                >
                  Add Address Details
                </Text>
                <View>
                  <SelectDropdown
                    onSelect={(selectedItem, index) => {
                      setAddressDetailsFormData({
                        ...addressDetailsFormData,
                        type: selectedItem.label,
                      });
                    }}
                    data={[
                      { key: "1", label: "Home" },
                      { key: "2", label: "Office" },
                    ]}
                    renderButton={(selectedItem, isOpened) => {
                      return (
                        <View
                          style={{
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 8,
                            borderWidth: 0.8,
                            borderColor: theme.colors.primary,
                          }}
                        >
                          <Text
                            style={{
                              color: theme.colors.primary,
                              fontFamily: "jakarta-sans-medium",
                            }}
                          >
                            {(selectedItem && selectedItem.label) ||
                              "Select Type"}
                          </Text>
                        </View>
                      );
                    }}
                    renderItem={(item, index, isSelected) => {
                      return (
                        <View
                          aria-label={item.label}
                          style={{
                            paddingTop: 6,
                            paddingBottom: 6,
                            paddingHorizontal: 16,
                          }}
                        >
                          <Text style={{ fontFamily: "jakarta-sans-medium" }}>
                            {item.label}
                          </Text>
                        </View>
                      );
                    }}
                    dropdownStyle={{ borderRadius: 8 }}
                  />
                </View>

                <CustomInput
                  placeholder="Address Line 1 (House no., Area name etc.)"
                  value={addressDetailsFormData?.address_line_1}
                  onChangeText={(text) =>
                    handleAddressForm("address_line_1", text)
                  }
                />
                <CustomInput
                  placeholder="Address Line 2(Landmarks etc.)"
                  value={addressDetailsFormData?.address_line_2}
                  onChangeText={(text) =>
                    handleAddressForm("address_line_2", text)
                  }
                />
                <CustomInput
                  placeholder="City"
                  value={addressDetailsFormData.city}
                  onChangeText={(text) => handleAddressForm("city", text)}
                />
                <CustomInput
                  placeholder="State"
                  value={addressDetailsFormData.state}
                  onChangeText={(text) => handleAddressForm("state", text)}
                />
              </View>
              <Button
                loading={addressSubmitLoading}
                title={addressButtonTitle}
                disabled={addressButtonDisabled}
                titleStyle={styles.addButtonDetailsTitle}
                buttonStyle={styles.addButtonDetails}
                containerStyle={styles.addButtonDetailsContainer}
                onPress={handleAddressFormSubmit}
              />
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

export default AddAddressModal;
