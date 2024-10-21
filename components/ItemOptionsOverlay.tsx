import { Overlay } from "@rneui/themed";
import { View, Text } from "react-native";
import React from "react";

const ItemOptionsOverlay = ({
  visible,
  toggleOverlay,
}: {
  visible: boolean;
  toggleOverlay?: () => void;
}) => {
  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
      <Text>Hello!</Text>
      <Text>Welcome to React Native Elements</Text>
    </Overlay>
  );
};

export default ItemOptionsOverlay;
