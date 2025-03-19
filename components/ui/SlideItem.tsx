// import { PURPLE_IMAGES } from "@/constants/purple-images";
import React, { useMemo } from "react";
import {
  ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewProps,
} from "react-native";
import type { AnimatedProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

interface Props {
  style?: StyleProp<ImageStyle>;
  index?: number;
  rounded?: boolean;
  source?: ImageSourcePropType;
  testID?: string;
}
const PURPLE_IMAGES = [
  "https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1505968409348-bd000797c92e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1570051008600-b34baa49e751?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGZyZWUlMjBpbWFnZXN8ZW58MHx8MHx8fDA%3D",
];
export const SlideItem: React.FC<Props> = (props) => {
  const {
    style,
    index = 0,
    rounded = false,
    testID,
    ...animatedViewProps
  } = props;

  const source = useMemo(
    () => props.source || PURPLE_IMAGES[index % PURPLE_IMAGES.length],
    [index, props.source]
  );

  return (
    <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
      <Animated.Image
        style={[style, styles.container, rounded && { borderRadius: 15 }]}
        // source={source}
        src={PURPLE_IMAGES[index % PURPLE_IMAGES.length]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <View style={styles.overlayTextContainer}>
          <Text style={styles.overlayText}>{index}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  overlayTextContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
