import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraView, CameraViewRef, FlashMode } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

export default function CameraScreen() {
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
    const [image, setImage] = useState(null);
    const [flash, setFlash] = useState<FlashMode>('off');
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        (async () => {
            await MediaLibrary.requestPermissionsAsync();
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    if (hasCameraPermission === null) {
        return <View />;
    }
    if (hasCameraPermission === false) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
                <Text><Text style={{ color: "red" }}>Sem acesso à câmera</Text>. Para este recurso, altorize a GoDress nas configurações de seu smartphone.</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} facing='back' flash={flash} ref={cameraRef}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setFlash(flash === 'off' ? 'on' : 'off');
                        }}>
                        <Text style={styles.text}> Flash: {flash} </Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
