import { View, Text, StyleSheet, Image } from "react-native";
import { Card } from "@rneui/themed";

import { useState } from "react";
import { ActivityIndicator, Animated } from "react-native";
import { Button } from "@rneui/themed";

const AddToCartButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      fontSize: 14,
    },
    emoji: {
      fontSize: 14,
      marginLeft: 10,
    },
  });

  const handleAddToCart = () => {
    setIsLoading(true);

    // Simulate network request to add item to cart
    setTimeout(() => {
      setIsLoading(false);
      setIsAdded(!isAdded);
      triggerAnimation();
    }, 1500); // 1.5 second delay to simulate API call
  };

  const triggerAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      // Reset animation after it's done
      setTimeout(() => {
        animationValue.setValue(0);
      }, 600);
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title={isAdded ? "Added!" : "Add to Cart"}
        onPress={handleAddToCart}
        titleStyle={styles.buttonText}
        disabled={isLoading}
        icon={
          isLoading ? (
            <ActivityIndicator style={styles.emoji} size={20} color="white" />
          ) : (
            isAdded && <Text style={styles.emoji}>🎉</Text>
          )
        }
        iconRight
      />
    </View>
  );
};

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
      margin:0,
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
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="cover" 
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Card>
  );
};

export default OfferLinkCard;
