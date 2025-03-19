import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Animated,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from "react-native";
import { Button, useTheme } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import useUserStore from "@/store/userStore";
import useOrderStore from "@/store/orderStore";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import useModalStore from "@/store/modalsStore";
const AddNoteModal = () => {
  const isOpen = useModalStore((state) => state.addNoteModalOpen);
  const setIsOpen = useModalStore((state) => state.setAddNoteModalOpen);
  const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
  const { theme } = useTheme();
  const IMAGE_WIDTH = 70;
  const setDeliveryNote = useOrderStore((state) => state.setDeliveryNote);
  const deliveryNote = useOrderStore((state) => state.deliveryNote);
  function handleAddNote() {
    showToast("Note added successfully");
    setIsOpen(false);
  }
  if (isOpen) {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide to view
      duration: 120,
      useNativeDriver: true,
    }).start();
  }

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 600, // Slide back down
      duration: 120,
      useNativeDriver: true,
    }).start(() => setIsOpen(false));
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    openButton: {
      padding: 15,
      backgroundColor: "#673ab7",
      borderRadius: 10,
    },
    openButtonText: {
      color: "#fff",
      fontSize: 18,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      height: 380,
      backgroundColor: "#fff",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      flexDirection: "column",
      justifyContent: "space-between",
    },
    closeButton: {
      alignSelf: "flex-end",
    },
    modalText: {
      textAlign: "center",
      fontSize: 18,
      marginTop: 20,
    },
    itemDetailContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    imageAndTextContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    image: {
      width: IMAGE_WIDTH,
      height: 70,
      borderRadius: 10,
    },
    optionsCardContainer: {
      borderRadius: 8,
      marginHorizontal: 0,
    },
    optionsContainer: {
      flexDirection: "column",
    },
    cartButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
    },
    cartButtonTitle: {
      fontSize: 16,
    },
    cartButtonContainer: {
      borderRadius: 4,
      paddingVertical: 8,
      width: "100%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingBottom: 16,
    },
    skeletonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
    },
    skeletonStructure: {
      backgroundColor: "#FFFFF",
      borderRadius: 8,
      marginTop: 10,
    },
    skeleton: {
      backgroundColor: "#EDEDED",
    },
  });
  const showToast = (text: string) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  };
  return (
    <Modal transparent visible={isOpen} animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Modal Content */}
          <View>
            {/* <View> */}
            <View style={styles.modalHeader}>
              <Text
                style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}
              >
                Add note
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Icon name="close" type="antdesign" size={24} color="#000" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder="Add a note for the delivery partner"
              value={deliveryNote}
              onChangeText={(text) => {
                setDeliveryNote(text);
              }}
              style={{
                height: 120,
                borderWidth: 0.6,
                borderColor: theme.colors.grey4,
                margin: 0,
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 8,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.02,
                shadowRadius: 4,
                elevation: 2,
                fontFamily: "jakarta-sans-regular",
                fontSize: 13,
              }}
            />
          </View>
          <Button
            icon={
              <FontAwesome6
                name="plus"
                size={16}
                color="#FDE4E8"
                style={{ marginRight: 6 }}
              />
            }
            title={"Add note"}
            titleStyle={styles.cartButtonTitle}
            buttonStyle={styles.cartButton}
            containerStyle={styles.cartButtonContainer}
            onPress={handleAddNote}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddNoteModal;
