import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, FlatList, Dimensions } from 'react-native';

import { Clothing } from '@/src/services/types/types';
import Api from '@/src/services/api';

const { width } = Dimensions.get('window');

export default function favClothes() {
    const [clothes, setClothes] = useState<Clothing[]>([])

    const getFavClothes = async () => {
        await Api.get('/clothing/favs')
            .then(response => {
                setClothes(response.data)
                console.log(clothes);
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }

    useEffect(() => {
        getFavClothes();
    }, []);

    const renderItem = ({ item }: { item: Clothing }) => (
        <TouchableOpacity key={item._id} style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={clothes}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                numColumns={3}
                contentContainerStyle={{ justifyContent: "center" }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        alignItems: "center"
    },
    itemContainer: {
        margin: 5,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
    },
    image: {
        height: width * 0.25,
        width: width * 0.25,
        borderRadius: 10
    },
});
