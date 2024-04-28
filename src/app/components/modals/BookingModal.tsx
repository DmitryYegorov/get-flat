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
import useBooking from '@get-flat/app/hooks/useBookingModal';
import { List, ListItem, ListItemIcon, Select, TextField, Typography, MenuItem } from '@mui/material';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { endOfDay, format } from 'date-fns';
import dayjs from 'dayjs';
import Document from '@tiptap/extension-document';
import { useRouter } from 'next/navigation';
import Counter from '../inputs/Counter';

interface Props {
    onBook: (data?: any) => void;
}

enum STEPS {
    DATES = 0,
    DOCUMENT = 1,
}

const BookingModal = ({onBook}: Props) => {
    
    const bookingModal = useBooking();
    const [isLoading, setIsLoading] = useState(false);

    const [step, setStep] = useState(STEPS.DATES);
    const [open, setOpen] = useState(bookingModal.isOpen);

    const router = useRouter();

    const nextStep = () => {
        if (step === STEPS.DOCUMENT) {
            return;
        }

        setStep(step + 1);
    };
    
    const {
        setValue,
        watch,
        register,
        formState: {errors},
        handleSubmit,
    } = useForm({
        defaultValues: {
            documentType: null,
            documentId: null,
            guestName: null,
            comment: null,
            guestCount: 1,
            childrenCount: 0,
        }
    });

    const documentType = watch('documentType');
    const documentId = watch('documentId');
    const guestName = watch('guestName');
    const comment = watch('comment');
    const guestCount = watch('guestCount');
    const childrenCount = watch('childrenCount');

    const onSubmit = (data) => {
        setIsLoading(true);

        http.post('/bookings', {
            realtyId: bookingModal.realty.id,
            startDate: bookingModal.startDate,
            endDate: bookingModal.endDate,
            guestName,
            documentId,
            documentType,
            comment,
        })
            .then((res) => {
                toast.success('Ваша бронь создана успешно, желаем хорошо отдохнуть!');
                console.log('booking', res.data);
                onBook(res.data);
                // bookingModal.onClose();
                router.push(`/my-bookings/${res.data.id}`);
            })
            .catch(error => {
                // toast.error(error.response?.data?.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    let bodyContent;

    if (step === STEPS.DATES) {
        bodyContent = (
            <div
                className='
                    flex
                    flex-col
                    gap-4
                '
            >
                <Heading
                    title={'Ваша бронь'}
                    center
                />
                <List>
                    <ListItem>
                        <ListItemIcon><AiOutlineArrowLeft size={18} /></ListItemIcon>
                        <ListItem>Въезд {dayjs(bookingModal.startDate).format('DD/MM/YYYY')}</ListItem>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><AiOutlineArrowLeft size={18} /></ListItemIcon>
                        <ListItem>Выезд {dayjs(bookingModal.endDate).format('DD/MM/YYYY')}</ListItem>
                    </ListItem>
                    <ListItem>
                        {bookingModal.realty?.location?.flag} {bookingModal.realty?.location?.label}, {bookingModal.realty?.location?.region}
                    </ListItem>
                    <ListItem>
                        <Typography variant='h6'>Всё верно?</Typography>
                    </ListItem>
                </List>
            </div>
        );
    }

    if (step === STEPS.DOCUMENT) {
        bodyContent = (
            <div
                className='
                    flex
                    flex-col
                    gap-4
                '
            >
                <Heading
                    title={'Ваша бронь'}
                    center
                />
                <Counter
                    title={'Сколько человек будет?'}
                    subtitle={''}
                    value={guestCount}
                    onChange={(val) => setValue('guestCount', val)}    
                    max={bookingModal.realty.guestCount}            
                />
                {bookingModal.realty?.childrenCount >= 1 && (
                    <Counter
                        title={'Сколько детей будет?'}
                        subtitle={''}
                        value={childrenCount}
                        onChange={(val) => setValue('childrenCount', val)}   
                        max={bookingModal.realty.childrenCount}             
                    />
                )}
                <Select {...register('documentType', { required: true})} error={errors['documentType']} placeholder='Документ' value={documentType} onChange={(e) => setValue('documentType', e.target.value)} required>
                    <MenuItem value="passport">Паспорт</MenuItem>
                    <MenuItem value="driver_licence">Водительское удостоверение</MenuItem>
                </Select>
                <TextField
                    placeholder='Номер документа'
                    value={documentId}
                    onChange={(e) => setValue('documentId', e.target.value)}
                    {...register('documentId', {required: true})}
                    error={!!errors['documentId']}
                />
                <TextField
                    placeholder='Полное имя (Должно совпадать как в вашем докумегте!)'
                    value={guestName}
                    onChange={(e) => setValue('guestName', e.target.value)}
                    error={!!errors?.['guestName']}
                    {...register('guestName', {required: true})}
                />
                <TextField
                    placeholder='Пожелания'
                    rows={5}
                    multiline
                    value={comment}

                    onChange={(e) => setValue('comment', e.target.value)}
                    {...register('comment', {required: false})}
                />

            </div>
        );
    }


    return ( 
        <Modal
            disabled={isLoading}
            isOpen={bookingModal.isOpen}
            title='Бронирование'
            actionLabel='Продолжить'
            onClose={bookingModal.onClose}
            onSubmit={step === STEPS.DOCUMENT ? handleSubmit(onSubmit) : nextStep}
            body={bodyContent}
        />
    );
}
 
export default BookingModal;