'use client';

import { RegisterOptions, FieldValues, UseFormRegisterReturn, useForm } from "react-hook-form";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { http } from "../http";
import {Paper, TextField, Stack, Avatar} from '@mui/material';
import Button from "../components/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {storage} from "../firebase";

export default function Profile() {

    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [disabled, setDisabled] = useState(true);

	const [avatartSrc, setAvatarSrc] = useState(null);

	const fileInput = useRef();

    useEffect(() => {
        if (currentUser === null) {
            http.get('/users/auth/me')
            .then(res => {
                setCurrentUser(res.data.payload.user);
				console.log(currentUser);
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
                    router.refresh();
                })
            }
        } catch (err) {
            toast.error(`${err?.response?.message || 'Произошла ошибка, попробуйте позже'}`);
        }
    }

	const uploadToFireBase = async (image) => {
        const date = Date.now();

        const imageRef = ref(storage, `${date}/${image.name}`);
        const result = await uploadBytes(imageRef, image);

        const url = await getDownloadURL(result.ref);
		setAvatarSrc(url);
        await http.patch(`/users/${currentUser.id}/update`, {
			avatar: avatartSrc,
		})
		toast.success("Фото профиля успешно обновлено!")
        return result;
    }

    return (
        <ClientOnly>
            <Container>
                <Heading 
                    title={`Профиль`}
                />
                <Paper style={{padding: 10, marginTop: 20}} className="container md-auto">
                    <Stack direction='column' padding={2} margin={1} width={400} spacing={2} style={{margin: '0px auto'}}>
                        <div style={{margin: '0px auto'}}>
							<Avatar
								src={currentUser.avatar || avatartSrc}
								sx={{width: 150, height: 150}}
								className="cursor-pointer"
								onClick={() => fileInput.current.click()}
							/>
							<input 
								ref={fileInput} 
								type="file" 
								style={{ display: 'none' }} 
								onChange={(e) => {
									uploadToFireBase(e.target.files[0]);
								}}
							/>
						</div>
						
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

function setImage(url: string) {
	throw new Error("Function not implemented.");
}
