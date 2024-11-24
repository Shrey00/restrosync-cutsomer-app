import React from "react";
import OfferLinkCard from "@/components/OfferLinkCard";
import BrandLinkCard from "@/components/BrandLinkCard";
import { RestaurantType } from "@/types";
import { View, Text, Pressable } from "react-native";
import { ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@rneui/themed";
import { useRouter, Href, Link } from "expo-router";
import { Skeleton } from "@rneui/base";
import useMenuStore from "@/store/menuStore";
const SlideLinkCardSection = ({
  heading,
  link,
  cardData,
  sectionType,
  loading,
}: {
  heading: string;
  link: { text: string; link: Href<string | object> };
  cardData: RestaurantType[];
  sectionType: "offers" | "brands";
  loading: boolean;
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const removeFilter = useMenuStore((state) => state.removeFilter);
  const styles = StyleSheet.create({
    container: {
      paddingBottom: 16,
    },
    cardListContainerHeadingContainer: {
      paddingHorizontal: 12,
      paddingBottom: 10,
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexDirection: "row",
    },
    cardListContainerHeading: {
      fontSize: 16,
      fontFamily: "jakarta-sans-semibold",
    },
    link: {
      fontSize: 14,
      fontFamily: "jakarta-sans-bold",
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
    cardSkeleton: {
      borderRadius: 8,
      padding: 0,
      margin: 0,
      width: 160,
      minHeight: 140,
      overflow: "hidden",
      backgroundColor: "#FFFFF",
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.cardListContainerHeadingContainer}>
        <Text style={styles.cardListContainerHeading}>{heading}</Text>
        {link.text.length > 0 && (
          <Link href={link.link}>
            <Text style={styles.link}>{link.text}</Text>
          </Link>
        )}
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.offerLinkCardContainer}>
          {loading && (
            <>
              <Skeleton
                style={styles.cardSkeleton}
                skeletonStyle={{ backgroundColor: "#EDEDED" }}
              />
              <Skeleton
                style={styles.cardSkeleton}
                skeletonStyle={{ backgroundColor: "#EDEDED" }}
              />
              <Skeleton
                style={styles.cardSkeleton}
                skeletonStyle={{ backgroundColor: "#EDEDED" }}
              />
            </>
          )}
          {cardData.map((item, index) => {
            return (
              <>
                {sectionType === "brands" && (
                  <Pressable
                    key={index}
                    onPress={() => {
                      removeFilter({ filter: "search", value: "any" });
                      router.push(
                        `/menu?name=${item.name}&restaurantId=${item.id}`
                      );
                    }}
                  >
                    <BrandLinkCard
                      key={index}
                      imageSource={{ uri: item.logo }} // Replace with your image URL
                      title={item.name}
                      showOffer={false}
                      offerText="Sunday Offer-30% Off"
                    />
                  </Pressable>
                )}
                {sectionType === "offers" && (
                  <Link key={index} href="/offers">
                    <OfferLinkCard
                      key={index}
                      imageSource={{ uri: item.logo }} // Replace with your image URL
                      title={item.name}
                    />
                  </Link>
                )}
              </>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default SlideLinkCardSection;
