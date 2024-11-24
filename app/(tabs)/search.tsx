import Header from "@/components/Header";
import useUserStore from "@/store/userStore";
import { useTheme, ListItem } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Pressable,
  Text,
} from "react-native";
import { Link } from "expo-router";
import { Badge } from "@rneui/themed";
import { api } from "@/constants/api";
import { Skeleton } from "@rneui/themed";
import FoodItemCard from "@/components/FoodItemCard";
import { useRouter } from "expo-router";
import { getViewProp } from "react-native-reanimated";
import { getValueFor } from "@/utils";
import AddToCartModal from "@/components/AddToCartModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FiltersModal from "@/components/FiltersModal";
import ItemOptionsOverlay from "@/components/ItemOptionsOverlay";
import { FoodItemProps } from "@/types";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import VegIcon from "../../assets/veg-icon.svg";
import NonVegIcon from "../../assets/non-veg-icon.svg";
import useMenuStore from "@/store/menuStore";
type SearchItem = {
  itemName: string | null;
  restaurantName: string;
  restaurantId: string;
  cuisineType: string;
  categoryName: string;
};
const search = () => {
  const user = useUserStore((state) => state.user);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchItem[]>([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const removeFilter = useMenuStore((state) => state.removeFilter);
  const addFilter = useMenuStore((state) => state.addFilter);
  const fetchResults = async (query: string) => {
    try {
      const response = await fetch(`${api}/menu/search?searchQuery=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  useEffect(() => {
    if (searchText.length > 0) {  
      setLoading(true);
    } else {
      setLoading(false);
    }
    const delayDebounceFn = setTimeout(() => {
      (async () => {
        if (searchText.trim()) {
          const result = await fetchResults(searchText);
          setResults(result);
          setLoading(false);
        }
      })();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const styles = StyleSheet.create({
    uiMessage: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    searchItem: {
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 0.8,
      borderColor: theme.colors.secondary,
    },
    badgeStyle: {
      paddingHorizontal: 1.2,
      paddingBottom: 0.8,
      borderRadius: 4,
      height: 21,
    },
    badgeTextStyle: {
      fontFamily: "jakarta-sans-regular",
      marginBottom: 2,
      fontSize: 9,
    },
    generalBadgeStyle: {
      backgroundColor: "transparent",
      borderColor: theme.colors.grey0,
    },
    generalColor: {
      color: "#EFEFEF",
    },
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
  });
  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
      }}
    >
      <Header
        user={user}
        showSearch={true}
        setSearchText={setSearchText}
        searchText={searchText}
      />

      <ScrollView contentContainerStyle={{ marginHorizontal: 10 }}>
        {results.length !== 0 &&
          !loading &&
          results?.map((item, index) => {
            return (
              <ListItem
                key={index}
                onPress={() => {
                  removeFilter({ filter: "search", value: "any" as string });
                  addFilter([
                    { filter: "search", value: item.itemName as string },
                  ]);
                  router.push(
                    `/menu?name=${item.restaurantName}&search=${item.itemName}&restaurantId=${item.restaurantId}`
                  );
                }}
                style={styles.searchItem}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    {item.cuisineType === "veg" ? (
                      <VegIcon width={14} height={14} />
                    ) : (
                      <NonVegIcon width={14} height={14} />
                    )}{" "}
                    {item.itemName}
                  </ListItem.Title>
                  <View style={{ flexDirection: "row", gap: 4, marginTop: 4 }}>
                    <Badge
                      status="primary"
                      value={item.restaurantName}
                      badgeStyle={styles.badgeStyle}
                      textStyle={styles.badgeTextStyle}
                    />
                    <Badge
                      status="primary"
                      value={item.categoryName}
                      badgeStyle={{
                        ...styles.badgeStyle,
                        ...styles.generalBadgeStyle,
                      }}
                      textStyle={{
                        ...styles.badgeTextStyle,
                        color: theme.colors.grey0,
                      }}
                    />
                  </View>
                </ListItem.Content>
                <Entypo
                  name="chevron-thin-right"
                  size={20}
                  color={theme.colors.primary}
                />
              </ListItem>
            );
          })}
        {loading && (
          <View style={styles.skeletonContainer}>
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
            <Skeleton
              animation="pulse"
              height={140}
              style={styles.skeletonStructure}
              skeletonStyle={styles.skeleton}
            />
          </View>
        )}
      </ScrollView>
      {results.length === 0 && searchText.length === 0 && !loading && (
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
            Find your flavor, one search at a time!
          </Text>
        </View>
      )}
      {results.length === 0 && searchText.length > 0 && !loading && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text
            style={{ marginBottom: 170, fontFamily: "jakarta-sans-medium", fontSize:16 }}
          >
            Couldn't find what you're looking for.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default search;
