import { StyleSheet, Text, View } from 'react-native';

export default function home() {
    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center", gap: 10 }}>
                <Text style={{ fontSize: 26, fontWeight: 700, color:"#593C9D" }}>Login</Text>
                <Text>Teste de integração backend - frontend</Text>
            </View>
            <Text style={{ color: "grey", fontSize: 10 }}>powered by GoDress</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 40
    },
});
