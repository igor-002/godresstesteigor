import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type FormData = {
    name: string;
    surname: string;
    email: string;
    password: string;
}

const registerSchema = yup.object({
    name: yup.string().required('Nome é obrigatório'),
    surname: yup.string().required('Sobrenome é obrigatório'),
    email: yup.string().email('Email inválido').required('Email é obrigatório'),
    password: yup.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .matches(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .matches(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .matches(/[0-9]/, 'Senha deve conter pelo menos um número')
        .matches(/[!@#$%^&*(),.?":{}|<>-_]/, 'Senha deve conter pelo menos um caractere especial')
        .required('Senha é obrigatória'),
}).required();

export default function Register() {
    const [submittedData, setSubmittedData] = useState<FormData | null>(null);

    const form = useForm<FormData>({
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: ""
        },
        resolver: yupResolver(registerSchema),
    });

    const { handleSubmit, control, formState: { errors } } = form;

    const onSubmit: SubmitHandler<FormData> = (data) => {
        setSubmittedData(data);
        console.log(data)
    };

    return (
        <View style={styles.container}>
            <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                    </>
                )}
            />
            <Controller
                control={control}
                name="surname"
                render={({ field: { value, onChange } }) => (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Sobrenome"
                            onChangeText={onChange}
                            value={value}
                        />
                        {errors.surname && <Text style={styles.error}>{errors.surname.message}</Text>}
                    </>
                )}
            />
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


            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={{ color: "#fff", fontWeight: "500" }}>Cadastrar-se</Text>
            </TouchableOpacity>

            {submittedData && (
                <View style={styles.resultContainer}>
                    <Text style={{ fontWeight: 500, marginBottom: 10 }}>Dados enviados para o banco:</Text>
                    <Text style={styles.resultText}>"name": "{submittedData.name}"</Text>
                    <Text style={styles.resultText}>"surname": "{submittedData.surname}"</Text>
                    <Text style={styles.resultText}>"email": "{submittedData.email}"</Text>
                    <Text style={styles.resultText}>"password": "{submittedData.password}"</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 20,
        gap: 10
    },
    button: {
        backgroundColor: "#593C9D",
        borderRadius: 5,
        paddingVertical: 10,
        color: "#fff",
        width: "100%",
        alignItems: "center",
        marginTop: 50,
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        width: "100%",
        borderWidth: 1,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: '500'
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
