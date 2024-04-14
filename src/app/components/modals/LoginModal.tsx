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
import useAuth from '@get-flat/app/hooks/useAuth';

const LoginModal = () => {
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const authStore = useAuth();
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

        http.post('/users/auth/login', data)
            .then((res) => {
                console.log(res);
                const data = res.data;
                console.log({data});
                const {accessToken, payload} = data;

                authStore.onAuthorized(payload);

                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('payload', JSON.stringify(payload));

                toast.success(`Авторизация прошла успешно! Приятного пользования, ${data.payload.user.lastName} :)`);
                loginModal.onClose();
            })
            .catch(error => {
                toast.error(error.response?.data?.message);
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
            <hr />
            <Button
                outline
                label='Continue with google'
                icon={FcGoogle}
                onClick={() => {}}
            />
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
            title='Login'
            actionLabel='Continue'
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}
 
export default LoginModal;