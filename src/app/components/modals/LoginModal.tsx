'use client';

import {http} from '../../http';
import {FcGoogle} from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@get-flat/app/hooks/useLoginModal';
import useRegisterModal from '@get-flat/app/hooks/useRegisterModule';
import axios, {AxiosError} from 'axios';

const LoginModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('http://localhost:4444/users/auth/login', data)
            .then((res) => {
				console.log({res})
                const data = res?.data;
				const accessToken = data?.accessToken;
				const payload = data?.payload;

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('payload', JSON.stringify(payload));

                setTimeout(() => {
					window.location.reload();
				}, 1000);

				toast.success(`Авторизация прошла успешно! Приятного пользования, ${data?.payload?.user?.lastName} :)`);

                loginModal.onClose();
            })
            .catch((error) => {
				if (axios.isAxiosError(error)) {
					const err = error as AxiosError;
					toast.error(err.response?.data?.message || 'Произошла ошибка, попробуйте позже');
					return;
				}
				console.log('not', error);
                toast.error(null || 'Произошла ошибка, попробуйте позже');
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const bodyContent = (
        <div
            className='
                flex
                flex-col
                gap-4
            '
        >
            <Heading
                title={'С возвращением! :)'}
                center
            />
            <Input
                id={'email'}
                label={'E-mail'}
                register={register}
                errors={errors}
                disabled={isLoading}
                required
            /> 
            <Input
                id={'password'}
                label={'Пароль'}
                type='password'
                register={register}
                errors={errors}
                disabled={isLoading}
                required
            /> 
        </div>
    );

    const footerContent = (
        <div
            className='
                flex flex-col gap-4 mt-3
            '
        >
            <div
                className='
                    text-neutral-500
                    text-center
                    mt-4
                    font-light
                '
            >
                <div className='flex flex-row items-center gap-2 justify-center'>
                    <div
                        className='
                            text-neutral-800
                            cursor-pointer
                            hover:underline
                        '
                        onClick={() => {
                            loginModal.onClose();
                            setTimeout(() => registerModal.onOpen(), 300)
                        }}
                    >У меня нет аккаунта</div>
                </div>
            </div>
        </div>
    );

    return ( 
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title='Авторизация'
            actionLabel='Войти'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}
 
export default LoginModal;