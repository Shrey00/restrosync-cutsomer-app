import React from "react";
import { View, Text, StyleSheet, Linking, ScrollView } from "react-native";
import { Image } from "@rneui/themed";

interface DataItem {
  name: string;
  image: string;
  link: string;
}
const Categories = () => {
  const data: DataItem[] = [
    {
      name: "Pizza",
      image: "https://example.com/pizza.jpg",
      link: "https://example.com/pizza",
    },
    {
      name: "Burger",
      image: "https://example.com/burger.jpg",
      link: "https://example.com/burger",
    },
    {
      name: "Pasta",
      image: "https://example.com/pasta.jpg",
      link: "https://example.com/pasta",
    },
    {
      name: "Salad",
      image: "https://example.com/salad.jpg",
      link: "https://example.com/salad",
    },
    {
      name: "Salad",
      image: "https://example.com/salad.jpg",
      link: "https://example.com/salad",
    },
    {
      name: "Salad",
      image: "https://example.com/salad.jpg",
      link: "https://example.com/salad",
    },
  ];

  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };
  const heading = "Popular Categories"
  return (
    <View>
      <View style={styles.categoriesListContainerHeadingContainer}>
        <Text style={styles.categoriesListContainerHeading}>{heading}</Text>
        {/* <Link href={link.link}>
          <Text style={styles.link}>{link.text}</Text>
        </Link> */}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      >
        <View style={styles.categoriesContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.image}
                onPress={() => handlePress(item.link)}
              />
              <Text style={styles.text}>{item.name}</Text>
            </View>
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
    fontFamily:"jakarta-sans-semibold"
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
