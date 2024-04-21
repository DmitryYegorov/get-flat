'use client';

import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm } from "react-hook-form";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { useEffect, useLayoutEffect, useState } from "react";
import { http } from "../http";
import {Paper, TextField, Stack} from '@mui/material';
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function Profile() {

    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<any>(JSON.parse(localStorage.getItem('payload') || '')?.user);
    const [disabled, setDisabled] = useState(true);
    const authStore = useAuth();

    // useEffect(() => {
    //     http.get('/users/auth/me')
    //         .then(res => {
    //             setCurrentUser(res.data?.payload?.user);
    //             for (const key of Object.keys(currentUser)) {
    //                 register(key, {
    //                     value: currentUser[key]
    //                 })
    //             }
    //         });
    // }, [currentUser]);

    useLayoutEffect(() => {
        if (!currentUser) {
            http.get('/users/auth/me')
            .then(res => {
                setCurrentUser(res.data.payload.user);
            })
            .catch(e => {
                if (e?.response?.status >= 400) {
                    router.push('/');
                }
            });
        }
    }, [currentUser])

    const {
        register,
        formState: { errors },
        setValue,
        handleSubmit
    } = useForm<FieldValues>({});

    if (!currentUser) {
        return null;
    }

    const handleChange = (id: string, value: any) => {
        setValue(id, value, {
            shouldTouch: true,
            shouldDirty: true,
            shouldValidate: true,
        });
        setDisabled(false);
    }

    const onSubmit = async (data) => {
        try {
            const res = await http.patch(`/users/${currentUser.id}/update`, data);
            if (res.status < 400) {
                toast.success(`Данные успешно сохранены!`);
                http.get('/users/auth/me').then(res => {
                    setCurrentUser(res.data.payload);
                    localStorage.setItem('payload', JSON.stringify(currentUser));
                    authStore.onAuthorized(currentUser);
                    router.refresh();
                })
            }
        } catch (err) {
            toast.error(`${err?.response?.message || 'Произошла ошибка, попробуйте позже'}`);
        }
    }

    return (
        <ClientOnly>
            <Container>
                <Heading 
                    title={`Профиль`}
                />
                <Paper style={{padding: 10}} className="container md-auto">
                    <Stack direction='column' padding={2} width={300} spacing={2} alignSelf={'center'}>
                        <TextField
                            defaultValue={currentUser.firstName}
                            label='Фамилия'
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                        <TextField
                            defaultValue={currentUser.lastName}
                            label='Имя'
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                        <TextField
                            defaultValue={currentUser.middleName}
                            label='Отчество'
                            onChange={(e) => handleChange('middleName', e.target.value)}
                        />
                        <TextField
                            defaultValue={currentUser.email}
                            label='E-Mail'
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        <TextField
                            defaultValue={currentUser.telegram}
                            label='Telegram'
                            onChange={(e) => handleChange('telegram', e.target.value)}
                        />
                        <Button 
                            label="Сохранить"
                            disabled={disabled}
                            onClick={handleSubmit(onSubmit)}
                        />
                    </Stack>
                </Paper>
            </Container>
        </ClientOnly>
    );
}