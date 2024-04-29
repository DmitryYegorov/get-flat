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
import { List, ListItem, ListItemIcon, Select, TextField, Typography, MenuItem, ListItemText } from '@mui/material';
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
            bookingModal.onClose();
            setOpen(false);
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
            guestEmail: bookingModal?.user?.email,
            guestPhone: null,
            guestName: null,
            comment: null,
            guestCount: 1,
            childrenCount: 0,
        }
    });

    const guestPhone = watch('guestPhone');
    const guestEmail = watch('guestEmail');
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
            guestPhone,
            guestEmail,
            comment,
            guestCount,
            childrenCount,
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
        const diff = dayjs(bookingModal.endDate).diff(dayjs(bookingModal.startDate), 'days') + 1;
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
                <List className='text-xl font-semibold w-full'>
                    <ListItem>
                        <ListItemIcon><AiOutlineArrowLeft size={18} /></ListItemIcon>
                        <ListItemText>Въезд {dayjs(bookingModal.startDate).format('DD/MM/YYYY')}</ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><AiOutlineArrowLeft size={18} /></ListItemIcon>
                        <ListItemText>Выезд {dayjs(bookingModal.endDate).format('DD/MM/YYYY')}</ListItemText>
                    </ListItem>
                    <ListItem className='text-xl font-semibold'>
                        {bookingModal.realty?.location?.flag} {bookingModal.realty?.location?.label}, {bookingModal.realty?.location?.region}
                    </ListItem>
                    <ListItem className='text-xl font-semibold'>
                        {bookingModal.realty?.location?.cityName}
                    </ListItem>
                    <ListItem>
                        <div className='text-xl font-semibold'>Итого: {bookingModal.realty?.price} $ * {diff} дней = {diff * (+bookingModal.realty?.price)} $</div>
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
                <TextField
                    placeholder='Номер телефона'
                    value={guestPhone}
                    onChange={(e) => setValue('guestPhone', e.target.value)}
                    {...register('guestPhone', {required: true})}
                    error={!!errors['guestPhone']}
                />
                <TextField
                    placeholder='E-mail'
                    value={guestEmail}
                    onChange={(e) => setValue('guestEmail', e.target.value)}
                    {...register('guestEmail', {required: true})}
                    error={!!errors['guestEmail']}
                />
                <TextField
                    placeholder='Полное имя'
                    value={guestName}
                    onChange={(e) => setValue('guestName', e.target.value)}
                    error={!!errors?.['guestName']}
                    helperText="Должно совпадать с Вашим удостоверением личности (паспорт и т.д)"
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