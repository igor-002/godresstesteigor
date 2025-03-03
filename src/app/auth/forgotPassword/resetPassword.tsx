import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, Link } from 'expo-router';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Api from '@/src/services/api';
import { globalColors } from '@/src/styles/global';
import Fonts from '@/src/services/utils/Fonts';
import { MyButton } from '../../components/button/button';

type FormData = {
    token: string;
    password: string;
    confirm_password: string;
}

const registerSchema = yup.object({
    token: yup.string().required('Código é obrigatório'),
    password: yup.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial')
        .required('Senha é obrigatória'),
    confirm_password: yup.string().required('Confirme a senha').oneOf([yup.ref('password')], 'As senhas devem ser iguais!')
}).required();

export default function resetPassword() {
    const [resultData, setResultData] = useState(null);

    const form = useForm<FormData>({
        defaultValues: {
            token: "",
            password: "",
            confirm_password: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const resendToken = async () => {
        const email = await AsyncStorage.getItem('userEmail');

        await Api.post('/auth/forgot_password', {
            email: email
        })
            .then(async function (response) {
                console.log(response.data);
                setResultData(response.data.msg);
                reset();
            })
            .catch(function (error) {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });
    }


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const email = await AsyncStorage.getItem('userEmail')

        await Api.post('/auth/reset_password', {
            email: email,
            token: data.token,
            password: data.password
        })
            .then(async function (response) {
                console.log(response.data);
                setResultData(response.data.msg);
                reset();

                await AsyncStorage.removeItem('userEmail');

                router.replace('/');
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
                <Text style={styles.title}>Codigo enviado para seu email</Text>
            </View>

            <Controller
                control={control}
                name="token"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            placeholder="Código"
                            value={value}
                            autoCapitalize="none"
                        />
                        {errors.token && <Text style={styles.error}>{errors.token.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            placeholder="Nova senha"
                            value={value}
                            autoCapitalize="none"
                            secureTextEntry={true}
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="confirm_password"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            placeholder="Confirmar senha"
                            value={value}
                            autoCapitalize="none"
                            secureTextEntry={true}
                        />
                        {errors.confirm_password && <Text style={styles.error}>{errors.confirm_password.message}</Text>}
                    </>
                )}
            />
            <View style={{ marginTop: 50, gap: 10 }}>
                <TouchableOpacity style={{ borderRadius: 5, paddingVertical: 10, width: "100%", alignItems: "center", backgroundColor: "grey" }} onPress={resendToken}>
                    <Text style={{ color: "#fff", fontWeight: "500" }}>Reenviar código</Text>
                </TouchableOpacity>

                <MyButton onPress={resendToken} title='Reenviar código' />

                <TouchableOpacity style={{ borderRadius: 5, paddingVertical: 10, width: "100%", alignItems: "center", backgroundColor: "#593C9D" }} onPress={handleSubmit(onSubmit)}>
                    <Text style={{ color: "#fff", fontWeight: "500" }}>Alterar senha</Text>
                </TouchableOpacity>

                <MyButton onPress={handleSubmit(onSubmit)} title='Alterar senha'/>

            </View>

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

    title: {
        marginTop:"30%",
        marginBottom:20,

        color: globalColors.primary,
        fontSize: 32,
        fontFamily: Fonts['montserrat-extrabold'],
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
