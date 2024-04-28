'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import { getBookingById } from "@get-flat/app/http/bookings";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Heading from "@get-flat/app/components/Heading";
import Image from "next/image";
import { Alert, AlertTitle, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, TextField, Typography } from "@mui/material";
import { AiOutlineProfile } from "react-icons/ai";
import { getCurrentUser } from "@get-flat/app/http/auth";
import { MdAccountBalance, MdDateRange, MdOutlinePerson4 } from "react-icons/md";
import { BsPassport } from "react-icons/bs";
import { BiCommentDetail, BiMailSend, BiMessageSquare, BiPhoneCall } from "react-icons/bi";
import Link from "next/link";
import { TbMessageCircle2Filled } from "react-icons/tb";
import Chat from "@get-flat/app/components/chat";
import { MessageList } from "react-chat-elements"
import { Input as ChatInput } from 'react-chat-elements'
import { indigo } from "@mui/material/colors";
import Button from "@get-flat/app/components/Button";
import { http } from "@get-flat/app/http";
import toast from "react-hot-toast";


const BookingDetails = ({ params }) => {

    const [booking, setBooking] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [chatOpen, setChatOpen] = useState(false);
    const [secretCode, setSecretCode] = useState('');

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
    }, [booking, currentUser, params]);

    if (!currentUser) {
        return null;
    }

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title="Детали брони"
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
                                w-full
                                group
                            "
                        />
                    </div>
                    <div className="text-xl font-medium mt-2 ml-1">
                        Паспорт бронирования
                    </div>
                    <Grid container>
                        <Grid item xs={8}>
                            <List>
                                {/* <ListItem>
                                    <ListItemText className="p-1 bg-indigo-100 font-light w-5"><b>Код подтверждения: </b>{booking?.secretCode.padStart('0', 9)}</ListItemText>
                                </ListItem> */}
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
                                    <ListItemText>{booking?.documentType}, №{booking?.documentId}</ListItemText>
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><BiCommentDetail /></ListItemIcon>
                                    <ListItemText>Пожелания: {booking?.comment || '-'}</ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid xs={4}>
                            <div className="p-2">
                                <Button
                                    label="Чат с гостем"
                                    onClick={() => setChatOpen(true)}
                                />
                            </div>

                            <div className="p-2 flex flex-row justify-between gap-2">
                                {!booking?.confirmed ? (<>
                                    <TextField
                                            placeholder="Код"
                                            helperText="Когда гость прибудет, спросите у него секретный код для подтверждения"
                                            value={secretCode}
                                            onChange={(e) => setSecretCode(e.target.value)}
                                        />
                                        <div className="w-40">
                                            <Button
                                                label="Подтвердить"
                                                onClick={() => {
                                                    http.post('/bookings/check-code', {bookingId: booking.id, secretCode })
                                                        .then((res) => {
                                                            toast.success("Подтверждение прошло успешно!");
                                                            setBooking(null);
                                                        })
                                                        .catch(err => {
                                                            const message = err?.response?.data?.message;
                                                            console.log({err});
                                                            if (message != null) {
                                                                toast.error(message);
                                                            } else {
                                                                toast.error('Произошла ошибка');
                                                            }
                                                        })
                                                }}
                                            />
                                        </div>
                                </>) : (
                                    <div className="w-full">
                                    <Alert severity="success">Бронь завершена</Alert>
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
 
export default BookingDetails;