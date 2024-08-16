import React, { useState } from "react";
import { View, FlatList, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, Image } from "react-native";

import { Clothing } from "@/src/services/types/types";
import Modal from "../modals/modal";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const { width } = Dimensions.get('window');

export const ClothesList = React.memo(({ clothes, canOpen }: { clothes: Clothing[], canOpen: boolean }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openClothing, setOpenClothing] = useState<Clothing | null>(null);

    const handleOpenClothing = (clothing: Clothing) => {
        setOpenClothing(clothing);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setOpenClothing(null);
    };

    return (
        <View style={{ alignItems: "center" }}>
            <FlatList
                data={[...clothes].reverse()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer} onPress={() => handleOpenClothing(item)}>
                        <View style={styles.imageContainer}>
                            <ImageBackground source={{ uri: item.image }} style={styles.image}>
                                {item.fav === true && <MaterialIcons name="favorite" color="red" size={16} />}
                            </ImageBackground>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item._id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 20 }}
            />

            {canOpen === true && openClothing && (
                <View>
                    <Modal isOpen={openModal} onRequestClose={handleCloseModal}>
                        <View style={styles.modalContent}>
                            <View style={{ borderRadius: 5, overflow: 'hidden', flex: 1 }}>
                                <ImageBackground source={{ uri: openClothing.image }} style={{ flex: 1, padding: 5 }} resizeMode='stretch'>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <TouchableOpacity onPress={handleCloseModal}>
                                            <FontAwesome5 name="arrow-left" size={18} style={styles.modalComponent} />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <FontAwesome5 name="edit" size={18} style={styles.modalComponent} />
                                        </TouchableOpacity>
                                    </View>
                                </ImageBackground>
                            </View>
                        </View>
                    </Modal>
                </View>
            )}
        </View>
    )
});

const styles = StyleSheet.create({
    itemContainer: {
        margin: 5,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    imageContainer: {
        height: width * 0.25,
        width: width * 0.25,
        borderRadius: 5,
        overflow: 'hidden'
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 5
    },
    modalContent: {
        backgroundColor: "#fff",
        height: "75%",
        width: "90%",
        borderRadius: 10,
        padding: 10
    },
    modalComponent: {
        color: "grey"
    },
});
