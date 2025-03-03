import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, Link } from 'expo-router';
import * as yup from 'yup';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Api from '@/src/services/api';
import { useClothes } from '@/src/services/contexts/clothesContext';
import Fonts from '@/src/services/utils/Fonts';
import { globalColors } from '@/src/styles/global';
import { MyButton } from '../components/button/button';

type FormData = {
    email: string;
    password: string;
}

const registerSchema = yup.object({
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string().required('Senha é obrigatória'),
}).required();

export default function Login() {
    const [resultData, setResultData] = useState(null);
    const { getClothes } = useClothes()

    const form = useForm<FormData>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        await Api.post('/auth/login', {
            ...data
        })
            .then(async function (response) {
                console.log(response.data);
                setResultData(response.data.msg);
                reset();

                const { token } = response.data;
                await AsyncStorage.setItem('jwtToken', token);

                getClothes();
                router.replace('(tabs)');
            })
            .catch(function (error) {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });

    };

    return (
        <View style={styles.container}>

            <TouchableOpacity style={styles.containVoltar} onPress={() => router.back()}>
                <Image style={styles.imgVoltar} source={require('../../../assets/icons/voltar.png')} />
            </TouchableOpacity >

            <View style={styles.containlogotxt}>
                <Text style={styles.titulo} >Faça Login</Text>
                <Image style={styles.logoimg} source={require('../../../assets/images/gPurple.png')} />
            </View>

            <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                    <>
                        <>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChange}
                            placeholder="Email"
                            value={value}
                            autoCapitalize="none"

                        />
                        
                        </>
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
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
                            placeholder="Senha"
                            onChangeText={onChange}
                            value={value}
                            secureTextEntry={true}
                            autoCapitalize="none"
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                    </>
                )}
            />

            <MyButton onPress={handleSubmit(onSubmit)} title="Entrar" />

            <TouchableOpacity style={styles.containsenha}>
                <Text style={styles.text}>Esqueci a</Text>
                <Link href={"/auth/forgotPassword/sendEmail"} style={{ textDecorationLine: "underline", color: globalColors.primary, fontSize: 16, fontFamily: Fonts['montserrat-semibold'], }}> senha</Link>
            </TouchableOpacity>

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
        paddingHorizontal: 20,
        gap: 10,

    },

    containVoltar: {
        paddingTop: '15%',
    },

    imgVoltar: {
        height: 30,
        width: 30,
    },

    containlogotxt: {
        marginTop: "40%",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        justifyContent: 'space-between',
    },

    titulo: {
        fontFamily: Fonts['montserrat-black'],
        fontSize: 32,
        color: globalColors.primary,
        paddingRight: 15,
    },

    logoimg: {
        height: 55,
        width: 55,
        resizeMode: 'contain',
    },

    button: {
        backgroundColor: "#593C9D",
        borderRadius: 10,
        paddingVertical: 15,
        width: "100%",
        alignItems: "center",
        marginTop: 20,
    },

    input: {
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#A7A7A7',
        fontFamily: Fonts['montserrat-regular'],
        fontSize: 16,
        flexDirection:'row',
    },

    containsenha: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    text: {
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