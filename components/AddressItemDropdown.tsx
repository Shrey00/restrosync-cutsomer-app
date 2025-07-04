import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import useUserStore from '@/store/userStore';
import { api } from "@/constants/api";
import useAddressStore from "@/store/addressStore";

const AddressItemDropdown = ({ id, visible, setVisible, index }: { id: string, visible: boolean, setVisible: (value: number) => void, index: number }) => {
    const token = useUserStore((state) => state.user.token);
    const removeAddressItem = useAddressStore((state) => state.removeAddressItem);
    const toggleDropdown = () => {
        if (visible)
            setVisible(-1);
        else
            setVisible(index)
    };
    const handleRemoveAddressItem = async () => {
        try {
            console.log("URL:", `${api}/address/update-address?id=${id}&removed=${true}`)
            await fetch(`${api}/address/update-address?id=${id}&removed=${true}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            });
            removeAddressItem(id);
        } catch (e) {
            console.log(e);
        }

    }
    const handleMenuItemPress = (action: string) => {
        setVisible(-1);
        if (action === "remove") handleRemoveAddressItem()
    };
    const styles = StyleSheet.create({
        container: {
            // alignItems: "flex-end",
            // position: 'relative'
        },
        overlay: {
            // flex: 1,
            // height: "100%",
            // width: "100%",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            // zIndex: 10,
            backgroundColor: 'black'
            // justifyContent: "flex-start",
            // alignItems: "flex-end",
        },
        dropdown: {
            backgroundColor: "white",
            padding: 6,
            borderRadius: 5,
            display: visible ? 'flex' : 'none',
            elevation: 5,
            position: 'absolute',
            top: 20,
            right: 30,
            zIndex: 99,
            minWidth: 160,
            maxHeight: 160,
        },
        option: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 4,
            paddingHorizontal: 8,
        },
        optionText: {
            marginLeft: 10,
            fontSize: 13,
            fontFamily: "jakarta-sans-regular",
        },
    });

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={toggleDropdown} style={{ padding: 5 }}>
                <Feather name="more-vertical" size={20} color="black" />
            </TouchableOpacity>
            {/* <Modal
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
        style={styles.container}
      > */}
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setVisible(-1)}
            />
            <View style={styles.dropdown}>
                <TouchableOpacity
                    style={styles.option}
                    onPress={() => handleMenuItemPress("remove")}
                >
                    <Feather name="trash-2" size={18} color="black" />
                    <Text style={styles.optionText}>Remove</Text>
                </TouchableOpacity>
            </View>

            {/* </TouchableOpacity> */}
            {/* </Modal> */}
        </View>
    );
};


export default AddressItemDropdown;
