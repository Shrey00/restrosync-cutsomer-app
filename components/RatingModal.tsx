import { Text, StyleSheet } from "react-native";
import { useState } from "react";
import { Dialog } from "@rneui/themed";
import { Rating } from "react-native-ratings";
import Entypo from "@expo/vector-icons/Entypo";
import { useTheme, Button } from "@rneui/themed";
import useOrderStore from "@/store/orderStore";
export default function RatingModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) {
  const { theme } = useTheme();
  const getCurrentOrders = useOrderStore((state) => state.getCurrentOrders);
  const currentOrders = getCurrentOrders();
  const [ratingStage, setRatingStage] = useState(0);
  const styles = StyleSheet.create({
    button: {
      marginVertical: 16,
      paddingVertical: 10,
    },
    otpText: {
      fontSize: 16,
      fontFamily: "jakarta-sans-semibold",
      marginBottom: 10,
      textAlign: "center",
    },
    switchText: {
      color: "#2089dc",
      fontFamily: "jakarta-sans-semibold",
    },
    buttonText: {
      fontSize: 16,
      fontFamily: "jakarta-sans-semibold",
    },
  });
  return (
    <Dialog
      isVisible={isOpen}
      onBackdropPress={setIsOpen}
      overlayStyle={{ borderRadius: 8, height: 300 }}
    >
      <Text
        style={{
          marginBottom: 12,
          fontFamily: "jakarta-sans-bold",
          fontSize: 15,
          textAlign: "center",
        }}
      >
        {ratingStage === 0 && "Food Quality"}
        {ratingStage === 1 && "Packaging"}
        {ratingStage === 2 && "Delivery"}
      </Text>
      <Text style={{ marginBottom: 8, marginLeft: 14 }}>
        For order consisting{" "}
        {currentOrders[0]?.orderItems.length > 1
          ? currentOrders[0]?.orderItems[0]?.name +
            ", " +
            currentOrders[0]?.orderItems[1]?.name +
            (currentOrders[0]?.orderItems.length > 2 ? " etc." : "")
          : currentOrders[0]?.orderItems[0]?.name}
      </Text>
      {/* <Dialog.Loading /> */}
      <Rating
        type="star"
        ratingCount={5}
        imageSize={50}
        startingValue={0}
        readonly={false}
        showReadOnlyText={false}
        ratingBackgroundColor="#E8D6AE"
        style={{ marginBottom: 22 }}
      />
      {ratingStage === 2 ? (
        <Button
          title="Submit"
          titleStyle={{ fontFamily: "jakarta-sans-bold", fontSize: 15 }}
          loading={false}
          containerStyle={{ borderRadius: 30 }}
          buttonStyle={{ paddingTop: 4, paddingBottom: 6, borderRadius: 30 }}
          onPress={() => {
            setRatingStage((prev) => {
              if (prev < 2) return ++prev;
              return prev;
            });
          }}
          loadingStyle={{ height: 25.5 }}
        />
      ) : (
        <Button
          title="Next"
          titleStyle={{ fontFamily: "jakarta-sans-bold", fontSize: 15 }}
          iconRight={true}
          icon={
            <Entypo
              name="chevron-right"
              size={28}
              style={{ marginTop: 3 }}
              color={theme.colors.secondary}
            />
          }
          loading={false}
          containerStyle={{ borderRadius: 30 }}
          buttonStyle={{ paddingTop: 4, paddingBottom: 6, borderRadius: 30 }}
          onPress={() => {
            setRatingStage((prev) => {
              if (prev < 2) return ++prev;
              return prev;
            });
          }}
          loadingStyle={{ height: 25.5 }}
        />
      )}

      <Text
        style={{
          fontFamily: "jakarta-sans-medium",
          fontSize: 12,
          marginTop: 14,
        }}
      >
        Your valuable rating and feedback will help us improve our services.
      </Text>
    </Dialog>
  );
}
