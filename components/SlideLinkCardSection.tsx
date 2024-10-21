import React from "react";
import OfferLinkCard from "@/components/OfferLinkCard";
import { View, Text } from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import { Href, Link } from "expo-router";
const SlideLinkCardSection = ({
  heading,
  link,
  cardData,
}: {
  heading: string;
  link: { text: string; link: Href<string | object> };
  cardData: { image: string; text: string; link: Href<string | object> }[];
}) => {
  const { theme } = useTheme();
  const styles = StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
    cardListContainerHeadingContainer: {
      paddingHorizontal: 12,
      paddingBottom: 10,
      justifyContent: "space-between",
      alignItems:"flex-end",
      flexDirection: "row",
    },
    cardListContainerHeading: {
      fontSize: 16,
      fontFamily:"jakarta-sans-semibold"
    },
    link: {
      fontSize: 14,
      fontFamily:"jakarta-sans-bold",
      color: theme.colors.primary,
    },
    scrollContainer: {
      paddingHorizontal: 10,
    },
    offerLinkCardContainer: {
      flex: 1,
      flexDirection: "row",
      gap: 8,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.cardListContainerHeadingContainer}>
        <Text style={styles.cardListContainerHeading}>{heading}</Text>
        <Link href={link.link}>
          <Text style={styles.link}>{link.text}</Text>
        </Link>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.offerLinkCardContainer}>
          {cardData.map((item, index) => {
            return (
              <Link key={index} href={item.link}>
                <OfferLinkCard
                  imageSource={{ uri: item.image }} // Replace with your image URL
                  title={item.text}
                />
              </Link>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SlideLinkCardSection;
