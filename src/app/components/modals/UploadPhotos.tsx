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
import useUploadPhotosModal from '@get-flat/app/hooks/useUploadPhotosModal';

const UploadPhotos = () => {
    
    const authStore = useAuth();
    const uploadModal = useUploadPhotosModal();
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

        http.post('', data)
            .then((res) => {
                
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
                title={'Загрузка изображений'}
                center
            />
            <Input
                id={'image'}
                label={''}
                register={register}
                type='file'
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
                            uploadModal.onClose();
                            setTimeout(() => uploadModal.onOpen(), 300)
                        }}
                    >У меня нет аккаунта</div>
                </div>
            </div>
        </div>
    );

    return ( 
        <Modal
            disabled={isLoading}
            isOpen={uploadModal.isOpen}
            title='Загрузка изображений'
            actionLabel='Продолжить'
            onClose={uploadModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    );
}
 
export default UploadPhotos;