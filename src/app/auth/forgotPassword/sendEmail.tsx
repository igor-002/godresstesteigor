import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, Link } from 'expo-router';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Api from '@/src/services/api';
import { globalColors, globalStyles } from '@/src/styles/global';
import Fonts from '@/src/services/utils/Fonts';
import { MyButton } from '../../components/button/button';

type FormData = {
    email: string;
}

const registerSchema = yup.object({
    email: yup.string().email('Email inválido').required('Email é obrigatório')
}).required();

export default function sendEmail() {
    const [resultData, setResultData] = useState(null);

    const form = useForm<FormData>({
        defaultValues: {
            email: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        await Api.post('/auth/forgot_password', {
            ...data
        })
            .then(async function (response) {
                console.log(response.data);
                setResultData(response.data.msg);
                reset();

                await AsyncStorage.setItem('userEmail', data.email)

                router.navigate('/auth/forgotPassword/resetPassword')
            })
            .catch(function (error) {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });

    };

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.containVoltar} onPress={() => router.back()}>
                <Image style={styles.imgVoltar} source={require('../../../../assets/icons/voltar.png')} />
            </TouchableOpacity >

            <View>
                <Text style={styles.title}>Redefinir sua senha</Text>
            </View>
            <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            placeholder="Email"
                            value={value}
                            autoCapitalize="none"
                        />
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                    </>
                )}
            />

            <Text style={styles.texto}>Você irá receber um e-mail no endereçoinformado acima contendo o procedimento para criar uma nova senha para esse usúario</Text>

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={{ color: "#fff", fontWeight: "500" }}>Enviar</Text>
            </TouchableOpacity>

            <MyButton onPress={handleSubmit(onSubmit)} title='Enviar Component'/>


            {resultData && (
                <View style={styles.resultContainer}>
                    <Text style={{ fontWeight: "500", marginBottom: 10 }}>Status:</Text>
                    <Text style={styles.resultText}>{resultData}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 10
    },

    containVoltar: {
        paddingTop: '15%',
    },

    imgVoltar: {
        height: 30,
        width: 30,
    },

    title:{
        marginTop:"30%",
        marginBottom:20,
        fontFamily: Fonts['montserrat-extrabold'],
        fontSize: 32,
        color: globalColors.primary,
        paddingRight: 15,
    },

    texto:{
        fontFamily:Fonts['montserrat-regular'],
        fontSize:11,
        marginBottom:20,
    },

    button: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        color: "#fff",
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        borderWidth: 1.5,
        borderRadius: 10,
        borderColor: globalColors.primary,
        fontFamily: Fonts['montserrat-regular'],
        fontSize: 16,
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: "500"
    },
    resultContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f5f5f5',
        width: '100%',
        gap: 10
    },
    resultText: {
        fontSize: 14,
    },
});
