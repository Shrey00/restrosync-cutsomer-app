import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { Card, Button, useTheme, CheckBox } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import VegIcon from "../assets/veg-icon.svg";
import NonVegIcon from "../assets/non-veg-icon.svg";
import useUserStore from "@/store/userStore";
import useModalStore from "@/store/modalsStore";
import useMenuStore from "@/store/menuStore";
const FiltersModal = () => {
  const { theme } = useTheme();
  const isOpen = useModalStore((state) => state.filtersModalOpen);
  const setIsOpen = useModalStore((state) => state.setFiltersModalOpen);
  const user = useUserStore((state) => state.user);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offaddressModalScreen)  const [addressModalScreen, setAddressModalScreen] = useState(1);

  const [sortByFilters, setSortByFilters] = useState([
    {
      filter: "ascendingPrice",
      value: "Price: Low to High",
    },
    {
      filter: "descendingPrice",
      value: "Price:High to Low",
    },
  ]);
  const [ratingFilters, setRatingFilters] = useState([
    {
      filter: "rating_2",
      value: "From 2⭐",
    },
    {
      filter: "rating_3",
      value: "From 3⭐",
    },
    {
      filter: "rating_4",
      value: "From 4⭐",
    },
  ]);
  const [dietFilter, setDietFilter] = useState([
    {
      filter: "veg",
      value: "veg",
    },
    {
      filter: "non-veg",
      value: "non-veg",
    },
  ]);
  const [selectSortByFilter, setSelectSortByFilter] = useState<null | number>(
    null
  );
  const [selectRatingFilter, setSelectRatingFilter] = useState<null | number>(
    null
  );
  const [selectDietFilter, setSelectDietFilter] = useState<null | number>(null);

  const addFilters = useMenuStore((state) => state.addFilter);
  const appliedFilters = useMenuStore((state) => state.appliedFilters);
  if (isOpen) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 800, // Slide back down
      duration: 120,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
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
    listItemContainer: {
      padding: 12,
      marginHorizontal: 0,
      marginVertical: 0,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.008,
      shadowRadius: 4,
      elevation: 1, // For Android
    },
  });

  const handleAddFilters = () => {
    const filter_1 =
      selectSortByFilter !== null ? [sortByFilters[selectSortByFilter]] : [];
    const filter_2 =
      selectRatingFilter !== null ? [ratingFilters[selectRatingFilter]] : [];
    const filter_3 =
      selectDietFilter !== null ? [dietFilter[selectDietFilter]] : [];
    const allAppliedFilters = [...filter_1, ...filter_2, ...filter_3];

    addFilters(allAppliedFilters);
    setIsOpen(false);
  };
  useEffect(() => {
    if (!isOpen) {
      setSelectDietFilter(null);
      setSelectSortByFilter(null);
      setSelectRatingFilter(null);
    } else {
      appliedFilters.forEach((item, index) => {
        if (item.filter === "ascendingPrice") {
          setSelectSortByFilter(0);
        } else if (item.filter === "descendingPrice") {
          setSelectSortByFilter(1);
        }
        if (item.filter === "rating_2") {
          setSelectRatingFilter(0);
        } else if (item.filter === "rating_3") {
          setSelectRatingFilter(1);
        } else if (item.filter === "rating_4") {
          setSelectRatingFilter(2);
        }
        if (item.filter === "veg") {
          setSelectDietFilter(0);
        } else if (item.filter === "non-veg") {
          setSelectDietFilter(1);
        }
      });
    }
  }, [isOpen]);
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
              <Text
                style={{
                  fontFamily: "jakarta-sans-semibold",
                  fontSize: 16,
                  marginBottom: 5,
                }}
              >
                Select Filters
              </Text>
            </View>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Icon name="close" type="antdesign" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ gap: 8, height: "100%" }}>
            <Card containerStyle={styles.listItemContainer}>
              <Text
                style={{
                  fontFamily: "jakarta-sans-semibold",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Sort By
              </Text>
              <View>
                {sortByFilters.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 2,
                      }}
                    >
                      <Text style={{ fontFamily: "jakarta-sans-regular" }}>
                        {item.value}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <CheckBox
                          checked={selectSortByFilter === index}
                          onPress={() => setSelectSortByFilter(index)}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          size={26}
                          containerStyle={{
                            paddingBottom: 0,
                            marginBottom: 0,
                            paddingTop: 0,
                            marginTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            paddingRight: 0,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
            <Card containerStyle={styles.listItemContainer}>
              <Text
                style={{
                  fontFamily: "jakarta-sans-semibold",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Rating
              </Text>

              <View>
                {ratingFilters.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 2,
                      }}
                    >
                      <Text style={{ fontFamily: "jakarta-sans-regular" }}>
                        {item.value}
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        <CheckBox
                          checked={selectRatingFilter === index}
                          onPress={() => setSelectRatingFilter(index)}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          size={26}
                          containerStyle={{
                            paddingBottom: 0,
                            marginBottom: 0,
                            paddingTop: 0,
                            marginTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            paddingRight: 0,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
            <Card containerStyle={styles.listItemContainer}>
              <Text
                style={{
                  fontFamily: "jakarta-sans-semibold",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                Diet Preference
              </Text>

              <View>
                {dietFilter.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginVertical: 2,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        {item.filter === "veg" ? (
                          <VegIcon width={18} height={18} />
                        ) : (
                          <NonVegIcon width={18} height={18} />
                        )}
                        <Text
                          style={{
                            fontFamily: "jakarta-sans-regular",
                            marginBottom: 4,
                          }}
                        >
                          {item.value}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "row" }}>
                        <CheckBox
                          checked={selectDietFilter === index}
                          onPress={() => setSelectDietFilter(index)}
                          checkedIcon="dot-circle-o"
                          uncheckedIcon="circle-o"
                          size={26}
                          containerStyle={{
                            paddingBottom: 0,
                            marginBottom: 0,
                            paddingTop: 0,
                            marginTop: 0,
                            marginLeft: 0,
                            marginRight: 0,
                            paddingRight: 0,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          </ScrollView>
          <Button
            loading={false}
            title={"Add Filters"}
            titleStyle={styles.addButtonDetailsTitle}
            buttonStyle={styles.addButtonDetails}
            containerStyle={styles.addButtonDetailsContainer}
            onPress={() => handleAddFilters()}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FiltersModal;
