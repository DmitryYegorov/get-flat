'use client';

import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import Realty from './page';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Image from 'next/image';
import HeartButton from "@get-flat/app/components/HeartButton";
import { IoPerson } from "react-icons/io5";
import { Alert, AlertTitle, Box, Grid, List, ListItem, ListItemIcon, Paper, Stack, Typography } from "@mui/material";
import { MdBathroom, MdBedroomParent, MdKitchen, MdLocalParking, MdWc } from "react-icons/md";
import { http } from "@get-flat/app/http";
import { LocalizationProvider } from '@mui/x-date-pickers';

// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs, locale } from 'dayjs';
import { useForm } from "react-hook-form";
import {Button} from "@mui/material";
import { indigo } from "@mui/material/colors";
import useBooking from "@get-flat/app/hooks/useBookingModal";
import 'rsuite/dist/rsuite.min.css';
import ruRu from 'rsuite/locales/ru_RU'


import { CustomProvider, DateRangePicker } from 'rsuite';
const { allowedMaxDays, allowedDays, allowedRange, beforeToday, afterToday, combine } =
  DateRangePicker;

interface Props {
    realty: any;
    bookings?: any[]; 
}

function getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dateArray = [];
    let currentDate = new Date(startDate.getTime());

    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

const ListingClient: React.FC<Props> = ({realty, bookings}) => {

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [booked, setBooked] = useState<Date[]>([]);

    const [booking, setBooking] = useState(null);

    const bookingModal = useBooking();

    const {
        setValue,
        register,
        handleSubmit,
        watch
    } = useForm({
        defaultValues: {
            startDate: new Date(),
            endDate: new Date(),
        }
    });

    const startDate = watch('startDate');
    const endDate = watch('endDate');

    useEffect(() => {

        realty?.bookings?.forEach((booking) => {
            setBooked([...booked, ...getDatesInRange(new Date(booking.startDate), new Date(booking.endDate))]);
            console.log(booked);
        })

        if (!currentUser) {
            http.get('/users/auth/me')
                .then((res) => {
                    const user = res.data?.payload?.user;
                    if (realty.favorites.filter((f: { realtyId: any; userId: any; }) => f.realtyId === realty.id && f.userId === user.id).length) {
                        setIsLiked(true);
                    }
                    setCurrentUser(user);

                    if (bookings) {
                        bookings.forEach(booking => {
                            if (booking.userId === user.id) {
                                setBooking(booking);
                            }
                        });
                    }
                })
                .catch(() => {
                    //.. do noting
                    console.log('user not loaded')
                })
        }

    }, [currentUser, isLiked, realty]);
 
    return ( 
        <Container>
            <Heading
                title={realty.title}
                subtitle={`${realty.location?.region}, ${realty?.location?.label}`}
            />
            <div
                className="
                    w-full
                    h-[60vh]
                    overflow-hidden
                    rounded-xl
                    relative
                "
            >
                <div>
                    <Image
                        fill
                        src={realty.mainPhoto}
                        alt={realty.title}
                        className="object-cover w-full"
                    />
                </div>
                {currentUser && (
                    <div
                        className="absolute top-5 right-5"
                    >
                        <HeartButton
                            realtyId={realty.id}
                            favorite={isLiked}
                        />
                    </div>
                )}
            </div>
            <Grid container spacing={2} marginTop={1}>
                <Grid item xs={8}>
                    <Paper style={{padding: 10, border: '1px solid #ececee'}} elevation={0}>
                        <div
                            style={{
                                display: 'flex',
                                scrollSnapType: 'x mandatory',
                                gap: 20,
                                overflowX: 'auto'
                            }}
                        >  
                        {realty.images.map((src: string) => (
                                <div className="flex flex-row gap-2" key={src} style={{
                                    scrollSnapAlign: 'start',
                                    flex: '0 0 300px'
                                }}>
                                    <div
                                        key={src}
                                        className="
                                            aspect-square
                                            w-full
                                            relative
                                            overflow-hidden
                                            rounded-xl
                                        "
                                    >
                                    <Image
                                        key={src}
                                        fill
                                        src={src}
                                        alt={realty.title}
                                        className="
                                            object-cover
                                            h-full
                                            w-full
                                        "
                                    />
                                </div>
                                </div>
                            ))}

                        </div>
                        <Typography variant="body1">{bookingModal.isOpen ? 'true' : 'false'} {realty.description}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper style={{padding: 10}}>
                        <List>
                            <ListItem>
                                <ListItemIcon><IoPerson /></ListItemIcon>
                                <Typography variant="subtitle1">Гости: {realty.guestCount} чел.</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><MdBathroom /></ListItemIcon>
                                <Typography variant="subtitle1">Ванные комнаты: {realty.bathroomCount}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><MdWc /></ListItemIcon>
                                <Typography variant="subtitle1">Уборные: {realty.bathroomCount}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><MdKitchen /></ListItemIcon>
                                <Typography variant="subtitle1">Отдельная кухня: {realty.hasKitchen ? 'Да' : 'Нет'}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><MdLocalParking /></ListItemIcon>
                                <Typography variant="subtitle1">Парковка: {realty.hasParking ? 'Да' : 'Нет'}</Typography>
                            </ListItem>
                            </List>
                            <Box>
                                {currentUser ? (
                                    (
                                        <Stack spacing={1}>
                                           {
                                            booking && (
                                                <Alert>
                                                    <AlertTitle>У вас есть бронь</AlertTitle>
                                                    <List>
                                                        <ListItem>{dayjs(booking?.startDate).format('DD/MM/YYYY')} - {dayjs(booking?.endDate).format('DD/MM/YYYY')}</ListItem>
                                                    </List>
                                                </Alert>
                                            )
                                           }
                                            <hr/>
                                            {/* <Typography>Бронь</Typography> */}
                                            <Stack direction={'row'} spacing={1}>
                                                <CustomProvider locale={ruRu}>
                                                <DateRangePicker
                                                    defaultCalendarValue={[startDate, endDate]}
                                                    onChange={(value) => {
                                                        const [startDate, endDate] = value!;
                                                        setValue('startDate', startDate);
                                                        setValue('endDate', endDate);
                                                    }}
                                                    format="dd/MM/yyyy"
                                                    appearance="subtle"
                                                    placement="top"
                                                    shouldDisableDate={(date) => {
                                                        const formatted = booked.map(b => dayjs(b).format('YYYY-MM-DD'));
                                                        // console.log({formatted});
                                                        const res = formatted.includes(dayjs(date).format('YYYY-MM-DD'));
                                                        return res;
                                                    }}
                                                />
                                                </CustomProvider>
                                            </Stack>
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: indigo[500]}}
                                                onClick={() => {
                                                    bookingModal.onOpen({
                                                        realty,
                                                        startDate,
                                                        endDate,
                                                        user: currentUser,
                                                    });
                                                    setCurrentUser(null);
                                                }}
                                            >Забронировать</Button>
                                        </Stack>
                                    )
                                ) : (
                                    <Typography variant="caption">Для того, чтобы забронировать нужна авторизация</Typography>
                                )}
                            </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
     );
}
 
export default ListingClient;