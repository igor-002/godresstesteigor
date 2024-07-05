import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import Api from '@/src/services/api';
import Modal from '../components/modal';

type FormData = {
    name: string;
};

const addCatSchema = yup.object({
    name: yup.string().required('Nome é obrigatório')
}).required();

export default function Home() {
    const [name, setName] = useState<string | null>(null);
    const [surname, setSurname] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [resultData, setResultData] = useState(null);

    const form = useForm<FormData>({
        defaultValues: {
            name: ""
        },
        resolver: yupResolver(addCatSchema),
    });

    const { handleSubmit, control, formState: { errors }, reset } = form;

    const getUser = async () => {
        Api.get('/user')
            .then(function (response) {
                console.log(response);
                setName(response.data.user.name);
                setSurname(response.data.user.surname)
            })
            .catch(function (error) {
                console.log(error.response.data)
                router.replace('/auth/login')
            })
    }

    const onSubmitCat: SubmitHandler<FormData> = async (data) => {
        await Api.post('/cat', {
            ...data
        })
            .then(async function (response) {
                console.log(response.data);
                setModalOpen(false);
                setResultData(null);
                reset();
            })
            .catch(function (error) {
                console.log(error.response.data);
                setResultData(error.response.data.msg);
            });

    };

    useEffect(() => {
        getUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('jwtToken');
        router.replace('/');
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.title}>Olá, </Text>
                <Text style={styles.title}>{name ? name : "..."} </Text>
                <Text style={styles.title}>{surname ? surname : "..."}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={{ color: "grey", fontWeight: "500" }}>Logout</Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: "#fff", padding: 10, marginTop: 20, borderRadius: 10, gap: 5 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontSize: 16, fontWeight: "500" }}>Minhas Categorias:</Text>
                    <TouchableOpacity onPress={() => setModalOpen(true)}>
                        <FontAwesome5 name="plus" size={14} />
                    </TouchableOpacity>
                </View>


                <Modal isOpen={modalOpen}>
                    <View>
                        <View style={styles.modalContent}>
                            <Text style={{ fontSize: 14, fontWeight: "500" }}>Adicionar Categoria</Text>

                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <TextInput
                                            style={styles.input}
                                            onChangeText={onChange}
                                            placeholder="Nome"
                                            value={value}
                                            autoCapitalize="none"
                                        />
                                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                                    </>
                                )}
                            />


                            {resultData && (
                                <View>
                                    <Text style={styles.error}>{resultData}</Text>
                                </View>
                            )}

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit(onSubmitCat)}>
                                <Text style={{ color: "#ffff", fontWeight: "500" }}>Adicionar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton} onPress={() => {
                                setModalOpen(false)
                            }}>
                                <Text style={{ color: "#fff", fontWeight: "500" }}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <View style={{ marginTop: 16, gap: 10 }}>

                </View>
            </View>
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
    text: {
        fontWeight: 400,
        fontSize: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        gap: 10,
        padding: 20
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    submitButton: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    closeButton: {
        backgroundColor: "grey",
        borderRadius: 5,
        paddingVertical: 10,
        width: "100%",
        alignItems: "center",
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: '500'
    },
});
