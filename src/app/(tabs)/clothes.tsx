import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import TopTabs from '../components/topTabs/tobTabs';
import { Link, router } from 'expo-router'; 

export default function Clothes() {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.title}>Armário</Text>
                <TouchableOpacity>
                    <Link href={'/components/camera/camera'}>  
                        <FontAwesome5 name="camera" size={22} />
                    </Link>
                </TouchableOpacity>
            </View>

            <TopTabs />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 5
    },
    title: {
        fontWeight: "500",
        fontSize: 22
    },
});
