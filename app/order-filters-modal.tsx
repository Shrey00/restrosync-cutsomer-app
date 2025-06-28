import React, { useState, useRef, useEffect } from "react";
import {
    Modal,
    Animated,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
    Pressable,
} from "react-native";
import { Card, Button, useTheme, CheckBox } from "@rneui/themed";
import { Icon, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import useOrderStore from "@/store/orderStore";
const OrdersFiltersModal = () => {
    const { theme } = useTheme();
    const isOpen = true;
    const router = useRouter();
    const slideAnim = useRef(new Animated.Value(600)).current;
    const lastDateFilter = [
        {
            filter: "1m",
            value: "1 Months",
        },
        {
            filter: "3m",
            value: "3 Months",
        },
        {
            filter: "6m",
            value: "6 Months",
        },
        {
            filter: "12m",
            value: "12 Months",
        },
    ];
    const [selectLastDateFilter, setSelectLastDateFilter] = useState<null | number>(4);

    const addFilters = useOrderStore((state) => state.addFilter);
    const appliedFilters = useOrderStore((state) => state.appliedFilters);
    if (isOpen) {
        Animated.timing(slideAnim, {
            toValue: 0, // Slide to view
            duration: 120,
            useNativeDriver: true,
        }).start();
    }

    const closeModal = () => {
        router.back();
    };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        modalOverlay: {
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        modalContent: {
            height: "80%",
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
            marginTop: 10,
        },
        skeletonStructure: {
            backgroundColor: "#FFFFF",
            borderRadius: 8,
        },
        skeleton: {
            backgroundColor: "#EDEDED",
        },

        addButtonDetails: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 12,
            marginTop: 12,
            height: 52,
        },
        addButtonDetailsTitle: {
            fontSize: 16,
        },
        addButtonDetailsContainer: {
            borderRadius: 4,
            paddingVertical: 8,
        },
        listItemContainer: {
            padding: 12,
            marginHorizontal: 0,
            marginVertical: 0,
            borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.008,
            shadowRadius: 4,
            elevation: 1, // For Android
        },
    });

    const handleAddFilters = () => {
        const filter_1 =
            selectLastDateFilter !== null ? [lastDateFilter[selectLastDateFilter]] : [];
        const allAppliedFilters = [...filter_1];

        addFilters(allAppliedFilters);
        router.back();
    };
    useEffect(() => {
        appliedFilters.forEach((item) => {
            if (item.filter === "1m") {
                setSelectLastDateFilter(0);
            } else if (item.filter === "3m") {
                setSelectLastDateFilter(1);
            } else if (item.filter === "6m") {
                setSelectLastDateFilter(2);
            } else if (item.filter === "12m") {
                setSelectLastDateFilter(3);
            }
        });
    }, []);
    return (
        <Modal transparent visible={isOpen} animationType="none">
            <View style={styles.modalOverlay}>
                <Pressable style={{ flex: 1 }} onPress={closeModal}></Pressable>

                <Animated.View
                    style={[
                        styles.modalContent,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "jakarta-sans-semibold",
                                    fontSize: 16,
                                    marginBottom: 5,
                                }}
                            >
                                Select Filters
                            </Text>
                        </View>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Icon name="close" type="antdesign" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ gap: 8, height: "100%" }}>
                        <Card containerStyle={styles.listItemContainer}>
                            <Text
                                style={{
                                    fontFamily: "jakarta-sans-semibold",
                                    fontSize: 14,
                                    marginBottom: 4,
                                }}
                            >
                                Orders from last
                            </Text>
                            <View>
                                {lastDateFilter.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                marginVertical: 2,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    gap: 5,
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontFamily: "jakarta-sans-regular",
                                                        marginBottom: 4,
                                                    }}
                                                >
                                                    {item.value}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row" }}>
                                                <CheckBox
                                                    checked={selectLastDateFilter === index}
                                                    onPress={() => setSelectLastDateFilter(index)}
                                                    checkedIcon="dot-circle-o"
                                                    uncheckedIcon="circle-o"
                                                    size={26}
                                                    containerStyle={{
                                                        paddingBottom: 0,
                                                        marginBottom: 0,
                                                        paddingTop: 0,
                                                        marginTop: 0,
                                                        marginLeft: 0,
                                                        marginRight: 0,
                                                        paddingRight: 0,
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </Card>
                    </ScrollView>
                    <Button
                        loading={false}
                        title={"Add Filters"}
                        titleStyle={styles.addButtonDetailsTitle}
                        buttonStyle={styles.addButtonDetails}
                        containerStyle={styles.addButtonDetailsContainer}
                        onPress={() => handleAddFilters()}
                    />
                </Animated.View>
            </View>
        </Modal>
    );
};

export default OrdersFiltersModal;
