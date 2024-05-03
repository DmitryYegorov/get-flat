'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import { getBookingById } from "@get-flat/app/http/bookings";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Heading from "@get-flat/app/components/Heading";
import Image from "next/image";
import { Alert, AlertTitle, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Rating, TextField, Typography } from "@mui/material";
import { AiOutlineProfile } from "react-icons/ai";
import { getCurrentUser } from "@get-flat/app/http/auth";
import { MdAccountBalance, MdDateRange, MdOutlinePerson4 } from "react-icons/md";
import { BsPassport } from "react-icons/bs";
import { BiCommentDetail, BiMailSend, BiPhoneCall } from "react-icons/bi";
import Link from "next/link";
import { TbMessageCircle2Filled } from "react-icons/tb";
import Chat from "@get-flat/app/components/chat";
import { useForm } from "react-hook-form";
import Input from "@get-flat/app/components/inputs/Input";
import Button from "@get-flat/app/components/Button";
import toast from "react-hot-toast";
import { http } from "@get-flat/app/http";

const MyTripDetails = ({ params }) => {

    const [booking, setBooking] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [chatOpen, setChatOpen] = useState(false);
    const [myReview, setMyReview] = useState(null);
    
    const {
        setValue,
        watch,
        handleSubmit,
    } = useForm({
        defaultValues: {
            rating: 0,
            text: null,
            advantages: null,
            disadvantages: null,
        }
    });

    const rating = watch('rating');
    const text = watch('text');
    const advantages = watch('advantages');
    const disadvantages = watch('disadvantages');

    useEffect(() => {
        if (booking == null) {
            getBookingById(params.id)
                .then(res => {
                    const booking = res.data;
                    setBooking(booking);
                })
        }

        if (currentUser == null) {
            getCurrentUser()
                .then(res => {
                    const user = res.data?.payload?.user;
                    setCurrentUser(user);
                })
        }

        if (currentUser != null && booking != null) {
            const r = booking?.reviews?.find((r) => r.authorId === currentUser?.id);
            if (!!r) {
                setMyReview(r);

                setValue('rating', r.rating);
                setValue('text', r.text);
                setValue('advantages', r.advantages);
                setValue('disadvantages', r.disadvantages);
            }
        }
    }, [booking, currentUser, params]);


    const sendReview = async (data) => {
        try {
            const res = await http.post(`/bookings/${booking.id}/review/create`, data);
            toast.success("Спасибо за вашу обратнуб связь!");
            setBooking(null);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title="Детали вашей поездки"
                    subtitle={`${booking?.realty?.title} / ${dayjs(booking?.startDate).format('DD-MM-YYYY')} - ${dayjs(booking?.endDate).format('DD-MM-YYYY')}`}
                />
                <Paper>
                    <div
                        className="
                            aspect-square
                            w-full
                            relative
                            overflow-hidden
                            rounded-xl
                            h-[300px]
                        "
                    >
                        <Image
                            src={booking?.realty?.mainPhoto}
                            alt={"Бронь"}
                            fill
                            className="
                                object-cover
                                h-full
                                group
                                w-full
                                group
                            "
                        />
                        <div className="absolute top-5 left-5">
                            <Alert severity={booking?.tripStatus?.value === 'in_progress' ? (booking?.tripStatus === 'canceled' ? 'error' : 'info') : 'success'}>
                                {booking?.tripStatus?.label}
                            </Alert>
                        </div>
                    </div>
                    <div className="text-xl font-medium mt-2 ml-1">
                        Паспорт бронирования
                    </div>
                    <Grid container>
                        <Grid item xs={8}>
                            <List>
                                <ListItem>
                                    <ListItemIcon><AiOutlineProfile /></ListItemIcon>
                                    <ListItemText>{booking?.guestName || currentUser?.fullName}</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><MdDateRange /></ListItemIcon>
                                    <ListItemText>{dayjs(booking?.createdAt).format('DD-MM-YYYY HH:mm')}</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><MdAccountBalance /></ListItemIcon>
                                    <ListItemText>{booking?.total || 100.2} $</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><MdOutlinePerson4 /></ListItemIcon>
                                    <ListItemText>{booking?.guestCount} чел. {booking?.childrenCount && `+ ${booking?.childrenCount} детей`}</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><BsPassport /></ListItemIcon>
                                    <ListItemText>{booking?.guestEmail} {booking?.guestPhone}</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><BiCommentDetail /></ListItemIcon>
                                    <ListItemText>Пожелания: {booking?.comment || '-'}</ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid xs={4}>
                            <div className="p-2 p-l-4 border-solid border-l-[2px] border-indigo-200 mb-2 flex flex-col gap-4">
                                <div className="flex flex-row gap-2 mb-2">
                                    <Typography component="legend">Ваша оценка:</Typography>
                                    <Rating
                                        name="simple-controlled"
                                        value={rating}
                                        onChange={(event, newValue) => {
                                            setValue('rating', newValue);
                                        }}
                                        disabled={!!myReview}
                                    />
                                </div>
                                    <TextField
                                        multiline
                                        rows={5}
                                        placeholder={`Оставьте свой отзыв, помогите другим пользователям узнать больше про "${booking?.realty?.title}"`}
                                        fullWidth
                                        value={text}
                                        onChange={(e) => {
                                            setValue('text', e.target.value);
                                        }}
                                        disabled={!!myReview}
                                    />
                                <div>
                                    <TextField
                                        label="Что больше всего понравилось?"
                                        multiline
                                        rows={2}
                                        placeholder={`Оставьте свой отзыв, помогите другим пользователям узнать больше про "${booking?.realty?.title}"`}
                                        fullWidth
                                        onChange={(e) => setValue('advantages', e.target.value)}
                                        value={advantages}
                                        disabled={!!myReview}
                                    />
                                </div>
                                <div>
                                    <TextField
                                        label="Что больше всего не понравилось?"
                                        multiline
                                        rows={2}
                                        placeholder={`Оставьте свой отзыв, помогите другим пользователям узнать больше про "${booking?.realty?.title}"`}
                                        fullWidth
                                        value={disadvantages}
                                        onChange={(e) => setValue('disadvantages', e.target.value)}
                                        disabled={!!myReview}
                                    />
                                </div>
                                {myReview ? null : (
                                    <div>
                                        <Button
                                            label="Отправить"
                                            onClick={handleSubmit(sendReview)}
                                        />
                                    </div>
                                )}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            {!!(booking && currentUser) && (
                <Chat isOpen={chatOpen} bookingId={booking.id!} user={currentUser} onClose={() => setChatOpen(false)}/>
            )}
        </ClientOnly>
    );
}
 
export default MyTripDetails;