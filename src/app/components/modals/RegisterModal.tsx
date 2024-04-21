'use client';

import {http} from '../../http';
import {AiFillGithub} from 'react-icons/ai';
import {FcGoogle} from 'react-icons/fc';
import { useCallback, useState } from 'react';
import {
    FieldValue,
    FieldValues,
    RegisterOptions,
    SubmitHandler,
    useForm,
    UseFormRegisterReturn
} from 'react-hook-form';
import useRegisterModule from '@get-flat/app/hooks/useRegisterModule';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@get-flat/app/hooks/useLoginModal';

const RegisterModal = () => {
    const registerModal = useRegisterModule();
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
            firstName: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        http.post('/users/auth/register', data)
            .then((res) => {
                // registerModal.onClose();
            })
            .catch(error => {
                toast.error(error.response.data.message);
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
                title={'Регистрация'}
                subtitle={'Заполните форму'}
                center
            />
            <Input
                id={'firstName'}
                label={'Фамилия'}
                register={register}
                errors={errors}
                disabled={isLoading}
                required
            /> 
            <Input
                id={'lastName'}
                label={'Имя'}
                register={register}
                errors={errors}
                disabled={isLoading}
                required
            /> 
            <Input
                id={'middleName'}
                label={'Отчество'}
                register={register}
                errors={errors}
                disabled={isLoading}
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
                            registerModal.onClose();
                            loginModal.onOpen();
                        }}
                    >Уже есть аккаунт</div>
                </div>
            </div>
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title='Register'
            actionLabel='Continue'
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}
 
export default RegisterModal;