'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import { getBookingById } from "@get-flat/app/http/bookings";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Heading from "@get-flat/app/components/Heading";
import Image from "next/image";
import { Alert, AlertTitle, Grid, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { AiOutlineProfile } from "react-icons/ai";
import { getCurrentUser } from "@get-flat/app/http/auth";
import { MdAccountBalance, MdDateRange, MdOutlinePerson4 } from "react-icons/md";
import { BsPassport } from "react-icons/bs";
import { BiCommentDetail, BiMailSend, BiPhoneCall } from "react-icons/bi";
import { TbMessageCircle2Filled } from "react-icons/tb";
import Chat from "@get-flat/app/components/chat";
import dict from "@get-flat/app/conts";
import MyButton from "@get-flat/app/components/Button";

const MyBookingDetails = ({ params }) => {

    const [booking, setBooking] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [chatOpen, setChatOpen] = useState(false);

    useEffect(() => {
            getBookingById(params.id)
                .then(res => {
                    const booking = res.data;
                    setBooking(booking);
                })

            getCurrentUser()
                .then(res => {
                    const user = res.data?.payload?.user;
                    setCurrentUser(user);
                })
    }, [params]);

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
                                <ListItem>
                                    <ListItemText className="p-1 bg-indigo-100 font-light w-5"><b>Код подтверждения: </b>{booking?.secretCode.padStart('0', 9)}</ListItemText>
                                </ListItem>
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
                                    <ListItemIcon><BiCommentDetail /></ListItemIcon>
                                    <ListItemText>Пожелания: {booking?.comment || '-'}</ListItemText>
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid xs={4}>
                            <Alert variant="outlined" severity="info">
                                <AlertTitle>Контакты</AlertTitle>
                                <List>
                                    <ListItem>
                                        <ListItemIcon><BiPhoneCall /></ListItemIcon>
                                        <ListItemText>{booking?.realty?.phoneNumber || booking?.realty?.owner?.phoneNumber}</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><BiMailSend /></ListItemIcon>
                                        <ListItemText>{booking?.realty?.email || booking?.realty?.owner?.email}</ListItemText>
                                    </ListItem>
                                    <ListItem>
                                        <MyButton onClick={() => setChatOpen(true)} label="Чат с владельцем" />
                                    </ListItem>
                                </List>
                            </Alert>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
            {!!(booking && currentUser) && (
                <Chat isOpen={chatOpen} bookingId={booking.id} user={currentUser} onClose={() => setChatOpen(false)}/>
            )}
        </ClientOnly>
    );
}
 
export default MyBookingDetails;