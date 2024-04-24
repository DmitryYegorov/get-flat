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
import { List, ListItem, ListItemIcon, Typography } from '@mui/material';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { endOfDay, format } from 'date-fns';
import dayjs from 'dayjs';

interface Props {
    onBook: (data?: any) => void;
}

const BookingModal = ({onBook}: Props) => {
    
    const bookingModal = useBooking();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        setIsLoading(true);

        http.post('/bookings', {
            realtyId: bookingModal.realty.id,
            startDate: bookingModal.startDate,
            endDate: bookingModal.endDate,
        })
            .then((res) => {
                toast.success('Ваша бронь создана успешно, желаем хорошо отдохнуть!');
                console.log('booking', res.data);
                onBook(res.data);
                bookingModal.onClose();
            })
            .catch(error => {
                // toast.error(error.response?.data?.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    console.log({bookingModal});

    const bodyContent = (
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
            <List style={{minWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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


    return ( 
        <Modal
            disabled={isLoading}
            isOpen={bookingModal.isOpen}
            title='Бронирование'
            actionLabel='Да, всё правильно!'
            onClose={bookingModal.onClose}
            onSubmit={onSubmit}
            body={bodyContent}
        />
    );
}
 
export default BookingModal;