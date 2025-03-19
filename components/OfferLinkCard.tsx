import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "@rneui/themed";
const OfferLinkCard = ({
  imageSource,
  title,
}: {
  imageSource: { uri: string };
  title: string;
}) => {
  const styles = StyleSheet.create({
    cardContainer: {
      borderRadius: 8,
      padding: 0,
      margin: 0,
      width: 160,
      minHeight: 195,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: 120,
    },
    textContainer: {
      padding: 15,
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
  });
  return (
    <Card containerStyle={styles.cardContainer}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Card>
  );
};

export default OfferLinkCard;
