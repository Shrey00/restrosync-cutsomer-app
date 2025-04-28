import { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, Badge, ListItem } from "@rneui/themed";
import { api } from "@/constants/api";
import { Skeleton } from "@rneui/themed";
import Header from "@/components/Header";
import FoodItemCard from "@/components/FoodItemCard";
import useMenuStore from "../store/menuStore";
import useUserStore from "../store/userStore";
import { getViewProp } from "react-native-reanimated";
import { getValueFor } from "@/utils";
import AddToCartModal from "@/components/AddToCartModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FiltersModal from "@/components/FiltersModal";
import ItemOptionsOverlay from "@/components/ItemOptionsOverlay";
import { FoodItemProps } from "@/types";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import useModalStore from "@/store/modalsStore";
import HoverCardCartInfo from "@/components/HoverCardCartInfo";
import HoverCardOrderInfo from "@/components/HoverCardOrderInfo";
import useCartStore from "@/store/cartStore";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 20;
export default function Menu() {
  const { theme } = useTheme();
  const user = useUserStore((state) => state.user);
  const { name, restaurantId } = useLocalSearchParams();
  const setFilterModalOpen = useModalStore(
    (state) => state.setFiltersModalOpen
  );
  const uri =
    "https://thumbs.dreamstime.com/b/food-photography-epic-cheeseburger-flying-ingredients-splashing-dripping-sauce-dark-background-advertising-313260294.jpg";
  const styles = StyleSheet.create({
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
    badgeStyle: {
      paddingHorizontal: 4,
      paddingVertical: 1.5,
      borderRadius: 4,
      height: 32,
    },
    badgeTextStyle: { fontFamily: "jakarta-sans-semibold", marginBottom: 2 },
    greenBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: "#009806",
    },
    redBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: "#A40000",
    },
    generalBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: theme.colors.grey4,
    },
    greenColor: {
      color: "#009806",
    },
    redColor: {
      color: "#A40000",
    },
    generalColor: {
      color: "#EFEFEF",
    },
  });
  const { token } = useUserStore((state) => state.user);
  const menu = useMenuStore((state) => state.menu);
  const setMenu = useMenuStore((state) => state.setMenu);
  const appliedFilters = useMenuStore((state) => state.appliedFilters);
  const addFilter = useMenuStore((state) => state.addFilter);
  const removeFilter = useMenuStore((state) => state.removeFilter);
  const setCartHoverInfo = useCartStore((state) => state.setCartHoverInfo);
  const cart = useCartStore((state) => state.cart);
  const setCartItem = useCartStore((state) => state.setCartItem);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState<boolean[]>([]);
  // const [hoverCardVisble, setHoverCardVisble] = useState(false);
  const hoverCardVisble = useModalStore((state) => state.hoverCartInfo);
  const setHoverCardVisble = useModalStore((state) => state.setHoverCartInfo);
  const hoverOrderCardVisible = useModalStore((state) => state.hoverOrderInfo);
  const setHoverOrderCardVisible = useModalStore(
    (state) => state.setHoverOrderInfo
  );
  const [menuItemData, setMenuItemData] = useState<FoodItemProps>({
    id: "",
    name: "",
    images: [],
    rating: 0,
    sellingPrice: 0,
    markedPrice: 0,
    discount: 0,
    cuisineType: "",
    variant: "",
    restaurantId: "",
  });
  const generateMenuEndpoint = () => {
    var queryParameters: string = "";
    appliedFilters.forEach((item, index) => {
      if (queryParameters.length > 0 && index < 2) {
        queryParameters += "&";
      }
      if (item.filter === "search") {
        queryParameters += "searchQuery=" + item.value;
      }
      if (
        item.filter === "ascendingPrice" ||
        item.filter === "descendingPrice"
      ) {
        queryParameters += "sortBy=" + item.filter;
      }
      if (item.filter === "veg" || item.filter === "non-veg") {
        queryParameters += "cuisineType=" + item.filter;
      }
      if (
        item.filter === "rating_2" ||
        item.filter === "rating_3" ||
        item.filter === "rating_4"
      ) {
        queryParameters += "ratingFrom=" + item.filter;
      }
    });
    const endpoint =
      queryParameters.length > 0
        ? `${api}/menu/category-wise-items?${queryParameters}`
        : `${api}/menu/category-wise-items`;
    return endpoint;
  };

  useEffect(() => {
    setMenu([]);
    (async () => {
      try {
        setLoadingMenuItems(true);
        const endpoint = generateMenuEndpoint();
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ restaurantId }),
        });
        const responseData = await response.json();
        const categoryExpandedArr: boolean[] = [];
        for (let i = 0; i < responseData.data.length; ++i) {
          categoryExpandedArr.push(true);
        }
        setMenu(responseData.data);
        setCategoryExpanded(categoryExpandedArr);
        setLoadingMenuItems(false);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [appliedFilters]);
  useEffect(() => {
    (async () => {
      const response = await fetch(`${api}/cart/get-cart-items`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const responseData = await response.json();
      if (responseData.data.length > 0) {
        setCartItem(responseData.data);
        setCartHoverInfo(responseData.data[0], responseData.data.length);
        setHoverCardVisble(true);
      }
    })();
  }, []);
  const [prevOffset, setPrevOffset] = useState(0);
  const handleScrollCardView = (event: any) => {
    if (cart.length === 0) {
      return;
    }
    const currentOffset = event.nativeEvent.contentOffset.y + 20;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    if (layoutHeight + currentOffset >= contentHeight) {
      setHoverCardVisble(false); // Reached bottom
      return;
    }
    if (currentOffset < prevOffset) {
      setHoverCardVisble(true);
    }
    setPrevOffset(currentOffset);
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header user={user} showSearch={true} />
      <View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            gap: 6,
            height: 36,
            maxHeight: 36,
            marginBottom: 0,
            paddingHorizontal: 10,
            marginHorizontal: 0,
          }}
          horizontal={true}
        >
          <Badge
            status="primary"
            value={name}
            badgeStyle={styles.badgeStyle}
            textStyle={styles.badgeTextStyle}
          />
          <Badge
            onPress={() => {
              setFilterModalOpen(true);
            }}
            status="primary"
            value={
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <AntDesign name="filter" size={18} color="black" />
                <Text>Filters</Text>
              </View>
            }
            badgeStyle={{
              ...styles.badgeStyle,
              ...styles.generalBadgeStyle,
            }}
            textStyle={{
              ...styles.badgeTextStyle,
              color: theme.colors.grey0,
            }}
          />

          {appliedFilters.map((item, index) => {
            return (
              <Badge
                key={index}
                status="primary"
                onPress={() => removeFilter(item)}
                value={
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Text
                      style={
                        item.filter === "veg"
                          ? [styles.badgeTextStyle, styles.greenColor]
                          : null
                      }
                    >
                      {item.value}
                    </Text>
                    <AntDesign
                      name="close"
                      size={16}
                      color="black"
                      style={{ marginTop: 2 }}
                    />
                  </View>
                }
                badgeStyle={
                  item.filter === "veg"
                    ? [styles.badgeStyle, styles.greenBadgeStyle]
                    : [styles.badgeStyle, styles.generalBadgeStyle]
                }
              />
            );
          })}
        </ScrollView>
      </View>
      <ScrollView
        onScroll={(e) => handleScrollCardView(e)}
        contentContainerStyle={{
          paddingBottom: 10,
        }}
      >
        {loadingMenuItems ? (
          <View style={styles.skeletonContainer}>
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              width={CARD_WIDTH}
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
          </View>
        ) : (
          menu?.map((item, index) => {
            return (
              <ListItem.Accordion
                key={index}
                animation={{ type: "timing", duration: 50 }}
                content={
                  <ListItem.Content>
                    <ListItem.Title>{item.category}</ListItem.Title>
                  </ListItem.Content>
                }
                isExpanded={categoryExpanded[index]}
                onPress={() => {
                  let categoryExpandedModified = [...categoryExpanded];
                  categoryExpandedModified[index] =
                    !categoryExpandedModified[index];
                  setCategoryExpanded(categoryExpandedModified);
                }}
              >
                {item.items?.map((menuItem, i) => (
                  <FoodItemCard
                    key={i}
                    id={menuItem.id}
                    restaurantId={menuItem.restaurantId}
                    name={menuItem.name}
                    images={menuItem.images}
                    rating={menuItem.rating}
                    markedPrice={menuItem.markedPrice}
                    discount={menuItem.discount}
                    sellingPrice={menuItem.sellingPrice}
                    cuisineType={menuItem.cuisineType}
                    description={menuItem.description}
                    variant={menuItem.variant}
                    user={user}
                    setMenuItemData={() => setMenuItemData(menuItem)}
                  />
                ))}
              </ListItem.Accordion>
            );
          })
        )}
      </ScrollView>
      {!loadingMenuItems && menu.length === 0 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text
            style={{ marginBottom: 170, fontFamily: "jakarta-sans-medium" }}
          >
            Oops! did not found any item.
          </Text>
        </View>
      )}

      <AddToCartModal menuItemData={menuItemData} />
      <HoverCardCartInfo
        isVisible={hoverCardVisble}
        setIsVisible={setHoverCardVisble}
      />
      <HoverCardOrderInfo
        isVisible={hoverOrderCardVisible}
        setIsVisible={setHoverOrderCardVisible}
      />
      <FiltersModal />
    </SafeAreaView>
  );
}
