import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Image } from "@rneui/themed";
import { Href, useRouter } from "expo-router";
import useMenuStore from "@/store/menuStore";
interface DataItem {
  name: string;
  image: string;
  link: string;
}
const Categories = () => {
  const router = useRouter();
  const data: DataItem[] = [
    {
      name: "Pizza",
      image:
        "https://www.vegrecipesofindia.com/wp-content/uploads/2020/11/pizza-recipe.jpg",
      link: "/menu?name=All&search=pizza",
    },
    {
      name: "Burger",
      image:
        "https://www.noracooks.com/wp-content/uploads/2023/04/veggie-burgers-1-2.jpg",
      link: "/menu?name=All&search=burger",
    },
    {
      name: "Sandwiches",
      image:
        "https://www.maggi.ph/sites/default/files/srh_recipes/91afe3a3615aaa162847dc3fdcdda2da.jpg",
      link: "/menu?name=All&search=sandwich",
    },
    {
      name: "Pasta",
      image:
        "https://www.foodiecrush.com/easy-homemade-marinara-sauce/penne-marinara-sauce-foodiecrush-com-004/",
      link: "/menu?name=All&search=pasta",
    },
    {
      name: "Fries",
      image:
        "https://www.recipetineats.com/tachyon/2022/09/Fries-with-rosemary-salt_1.jpg",
      link: "/menu?name=All&search=fries",
    },
    {
      name: "Shakes",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN4S8wWC1GZJDXq1Ex4K-v7gCmH7ieNfaMhg&s",
      link: "/menu?name=All&search=shakes",
    },
    {
      name: "Breads",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUPAqshPnXk3Kb-P2U4T-NZ3x2NcQ510IfXA&s",
      link: "/menu?name=All&search=breads",
    },
  ];
  const heading = "Popular Categories";
  const removeFilter = useMenuStore((state) => state.removeFilter);
  const addFilter = useMenuStore((state) => state.addFilter);
  return (
    <View>
      <View style={styles.categoriesListContainerHeadingContainer}>
        <Text style={styles.categoriesListContainerHeading}>{heading}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      >
        <View style={styles.categoriesContainer}>
          {data.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                removeFilter({ filter: "search", value: "any" as string });
                addFilter([{ filter: "search", value: item.name }]);
                router.push(item.link as Href);
              }}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.text}>{item.name}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesListContainerHeadingContainer: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  categoriesListContainerHeading: {
    fontSize: 16,
    fontFamily: "jakarta-sans-semibold",
  },
  container: {
    paddingBottom: 16,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 150,
  },
  text: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "jakarta-sans-semibold",
    textAlign: "center",
  },
});

export default Categories;
