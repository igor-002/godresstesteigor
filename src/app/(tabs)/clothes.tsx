import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Teste1 from '../components/teste-topTab/teste';
import Teste2 from '../components/teste-topTab/teste2';

const Tab = createMaterialTopTabNavigator();

function TClothes() {
    return (
        <View style={{ marginTop: 20 }}>
            <Tab.Navigator>
                <Tab.Screen name="Teste 1" component={Teste1} />
                <Tab.Screen name="Teste 2" component={Teste2} />
            </Tab.Navigator >
        </View>
    );
}


export default function Clothes() {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={styles.title}>Armário</Text>
                <TouchableOpacity>
                    <FontAwesome5 name="camera" size={22} />
                </TouchableOpacity>
            </View>

            <TClothes />
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
