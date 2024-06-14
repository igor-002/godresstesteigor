import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="user/login" options={{ title: "Login" }} />
            <Stack.Screen name="user/register" options={{ title: "Registro" }} />
        </Stack>
    );
}