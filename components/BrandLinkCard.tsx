import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "@rneui/themed";

const BrandLinkCard = ({
  imageSource,
  title,
  showOffer,
  offerText,
}: {
  imageSource: { uri: string };
  title: string;
  showOffer: boolean;
  offerText: string;
}) => {
  const styles = StyleSheet.create({
    cardContainer: {
      borderRadius: 8,
      padding: 0,
      margin: 0,
      width: 160,
      minHeight: 140,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: 120,
    },
    textContainer: {
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 14,
      textAlign: "center",
    },
    description: {
      fontSize: 14,
      textAlign: "center",
    },
    offerInfoText: {
      fontFamily: "jakarta-sans-medium",
      fontSize: 11,
      color: "#066D07",
      textAlign: "center",
    },
    offerInfo: {
      backgroundColor: "#E1FFE9",
      padding: 4,
    },
  });
  return (
    <Card containerStyle={styles.cardContainer}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {showOffer && (
        <View style={styles.offerInfo}>
          <Text style={styles.offerInfoText}>{offerText}</Text>
        </View>
      )}
    </Card>
  );
};

export default BrandLinkCard;
