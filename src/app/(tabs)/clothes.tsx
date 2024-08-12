import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, FlatList, Dimensions, VirtualizedList } from 'react-native';
import { router } from 'expo-router';
import { TabView, SceneMap, TabBar, SceneRendererProps } from 'react-native-tab-view';

import FontAwesome5 from "@expo/vector-icons/FontAwesome5"

import { Clothing } from '@/src/services/types/types';
import { useClothes } from '@/src/services/contexts/clothesContext';
import { clothingKind } from '@/src/services/local-data/dropDownData';

const { width } = Dimensions.get('window');

const ClothesList = React.memo(({ clothes }: { clothes: Clothing[] }) => (
    <View style={{ alignItems: "center" }}>
        <FlatList
            data={clothes}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.itemContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20 }}
        />
    </View>
));

export default function Clothes() {
    const [index, setIndex] = useState(0);
    const [canChangeTab, setCanChangeTab] = useState(true);
    const { clothes } = useClothes();

    const routes = useMemo(() => [
        { key: 'all', title: 'All' },
        ...clothingKind.map(item => ({ key: item.value, title: item.label }))
    ], []);

    const filterClothes = (kind: string) => {
        if (kind === 'all') return clothes;
        return clothes.filter(item => item.kind === kind);
    };

    const renderScene = useMemo(() => SceneMap(
        routes.reduce((scenes, route) => {
            scenes[route.key] = () => <ClothesList clothes={filterClothes(route.key)} />;
            return scenes;
        }, {} as Record<string, React.FC<{ clothes: Clothing[] }>>)
    ), [routes, filterClothes]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 40, paddingHorizontal: 20 }}>
                <Text style={styles.title}>Armário</Text>
                <TouchableOpacity onPress={() => { router.push('/clothes/addClothing') }}>
                    <   FontAwesome5 name="camera" size={22} />
                </TouchableOpacity>
            </View>

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: width }}
                renderTabBar={props =>
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#593C9D' }}
                        style={{ backgroundColor: "rgba(52, 52, 52, alpha)", marginTop: 5, elevation: 0, borderBottomWidth: 1, borderBottomColor: "rgba(0, 0, 0, 0.37)" }}
                        labelStyle={styles.label}
                        scrollEnabled={true}
                        tabStyle={styles.tabStyle}
                    />
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 5
    },
    title: {
        fontWeight: "500",
        fontSize: 22
    },
    itemContainer: {
        margin: 5,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    label: {
        color: 'black',
        fontSize: 14,
        textTransform: 'none',
    },
    tabStyle: {
        width: 'auto',
        paddingHorizontal: 12,
    },
    image: {
        height: width * 0.25,
        width: width * 0.25,
        borderRadius: 10
    },
});
