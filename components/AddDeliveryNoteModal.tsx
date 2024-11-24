// import React, { useState, useRef, useEffect } from "react";
// import {
//   Modal,
//   Animated,
//   TouchableOpacity,
//   View,
//   StyleSheet,
//   ScrollView,
// } from "react-native";
// import { Card, Image, Button, useTheme, CheckBox } from "@rneui/themed";
// import { Icon, Text, Skeleton } from "@rneui/themed";
// import { CartItemProps, FoodItemProps } from "@/types/index";
// import { Rating } from "react-native-ratings";
// import VegIcon from "../assets/veg-icon.svg";
// import NonVegIcon from "../assets/non-veg-icon.svg";
// import { api } from "@/constants/api";
// import useUserStore from "@/store/userStore";
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
// import useCartStore from "@/store/cartStore";
// import { VariantsData } from "@/types";
// import useModalStore from "@/store/modalsStore";

// const AddToCartModal = ({ menuItemData }: { menuItemData: FoodItemProps }) => {
//   const isOpen = useModalStore((state) => state.addToCartModalOpen);
//   const setIsOpen = useModalStore((state) => state.setAddToCartModalOpen);
//   const slideAnim = useRef(new Animated.Value(600)).current; // Initial position of modal (offscreen)
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [selectedIndex, setIndex] = React.useState(0);
//   const [variantsData, setVariantsData] = useState<VariantsData[]>([]);
//   const [variantsDataLoading, setVariantsDataLoading] = useState(true);
//   const [addToCartLoading, setAddToCartLoading] = useState(false);
//   const [cartButtonText, setcartButtonText] = useState("Add");
//   const addToCart = useCartStore((state) => state.addToCart);
//   const { theme } = useTheme();
//   const user = useUserStore((state) => state.user);
//   if (isOpen) {
//     Animated.timing(slideAnim, {
//       toValue: 0, // Slide to view
//       duration: 120,
//       useNativeDriver: true,
//     }).start();
//   }

//   const closeModal = () => {
//     Animated.timing(slideAnim, {
//       toValue: 600, // Slide back down
//       duration: 120,
//       useNativeDriver: true,
//     }).start(() => setIsOpen(false));
//   };
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     openButton: {
//       padding: 15,
//       backgroundColor: "#673ab7",
//       borderRadius: 10,
//     },
//     openButtonText: {
//       color: "#fff",
//       fontSize: 18,
//     },
//     modalOverlay: {
//       flex: 1,

//       justifyContent: "flex-end",
//       backgroundColor: "rgba(0, 0, 0, 0.5)",
//     },
//     modalContent: {
//       height: 600,
//       backgroundColor: "#fff",
//       borderTopLeftRadius: 20,
//       borderTopRightRadius: 20,
//       padding: 20,
//       flexDirection: "column",
//       justifyContent: "space-between",
//     },
//     closeButton: {
//       alignSelf: "flex-end",
//     },
//     modalText: {
//       textAlign: "center",
//       fontSize: 18,
//       marginTop: 20,
//     },
//     itemDetailContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       alignItems: "center",
//     },
//     imageAndTextContainer: {
//       flexDirection: "row",
//       alignItems: "center",
//       gap: 8,
//     },
//     image: {
//       width: 70,
//       height: 70,
//       borderRadius: 10,
//     },
//     optionsCardContainer: {
//       borderRadius: 8,
//       marginHorizontal: 0,
//     },
//     optionsContainer: {
//       flexDirection: "column",
//     },
//     cartButton: {
//       backgroundColor: theme.colors.primary,
//       paddingVertical: 12,
//     },
//     cartButtonTitle: {
//       fontSize: 16,
//     },
//     cartButtonContainer: {
//       borderRadius: 4,
//       paddingVertical: 8,
//       width: "100%",
//     },
//     modalHeader: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       paddingBottom: 16,
//     },
//     skeletonContainer: {
//       flexDirection: "column",
//       justifyContent: "center",
//       alignItems: "center",
//       gap: 6,
//     },
//     skeletonStructure: {
//       backgroundColor: "#FFFFF",
//       borderRadius: 8,
//       marginTop: 10,
//     },
//     skeleton: {
//       backgroundColor: "#EDEDED",
//     },
//   });

//   useEffect(() => {
//     if (isOpen) {
//       (async () => {
//         try {
//           const response = await fetch(`${api}/menu/item/variants`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${user.token}`,
//             },
//             body: JSON.stringify({ menuItemId: menuItemData.id }),
//           });
//           const responseData = await response.json();
//           setVariantsData(responseData.data);
//           setVariantsDataLoading(false);
//         } catch (e) {
//           console.log(e);
//         }
//       })();
//     }
//   }, [isOpen]);
//   useEffect(() => {
//     if (variantsData[selectedIndex]?.sellingPrice) {
//       setcartButtonText(
//         `Add to cart at ₹${variantsData[selectedIndex]?.sellingPrice}`
//       );
//     }
//   }, [selectedIndex, variantsDataLoading]);
//   const handleScroll = (event: any) => {
//     const slideSize = event.nativeEvent.layoutMeasurement.width;
//     const index = event.nativeEvent.contentOffset.x / slideSize;
//     setActiveIndex(Math.round(index));
//   };

//   async function handleAddToCart() {
//     if (cartButtonText === "Added 🎉") return;
//     try {
//       const cartItemParams = {
//         id: variantsData[selectedIndex]?.id,
//         name: menuItemData.name,
//         sellingPrice: variantsData[selectedIndex]?.sellingPrice,
//         quantity: 1,
//         cuisineType: menuItemData.cuisineType,
//         markedPrice: variantsData[selectedIndex]?.markedPrice,
//         discount: variantsData[selectedIndex]?.discount,
//       };
//       setAddToCartLoading(true);
//       addToCart(cartItemParams);
//       const response = await fetch(`${api}/cart/add-to-cart`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user.token}`,
//         },
//         body: JSON.stringify({ userId: user.id, menuItemId: cartItemParams.id }),
//       });
//       setcartButtonText("Added 🎉");
//       setTimeout(() => {
//         setIsOpen(false);
//       }, 1000);
//       setAddToCartLoading(false);
//     } catch (e) {
//       console.log(e);
//     }
//   }

//   return (
//     <Modal transparent visible={isOpen} animationType="none">
//       <View style={styles.modalOverlay}>
//         <Animated.View
//           style={[
//             styles.modalContent,
//             { transform: [{ translateY: slideAnim }] },
//           ]}
//         >
//           {/* Modal Content */}
//           <View>
//             <View style={styles.modalHeader}>
//                <Text
//                 style={{ fontFamily: "jakarta-sans-semibold", fontSize: 16 }}
//               >
//                 Add Delivery Note
//               </Text>
//               <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
//                 <Icon name="close" type="antdesign" size={24} color="#000" />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <Button
//             icon={
//               <FontAwesome6
//                 name="plus"
//                 size={16}
//                 color="#FDE4E8"
//                 style={{ marginRight: 6 }}
//               />
//             }
//             loading={addToCartLoading}
//             title={cartButtonText}
//             titleStyle={styles.cartButtonTitle}
//             buttonStyle={styles.cartButton}
//             containerStyle={styles.cartButtonContainer}
//             onPress={handleAddToCart}
//           />
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// export default AddToCartModal;
