'use client';

import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import Realty from './page';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Image from 'next/image';
import HeartButton from "@get-flat/app/components/HeartButton";
import { IoPerson } from "react-icons/io5";
import { Alert, AlertTitle, Box, Grid, List, ListItem, ListItemIcon, Paper, Stack, Typography } from "@mui/material";
import { MdAccessibility, MdBathroom, MdBathtub, MdBedroomParent, MdBreakfastDining, MdChildFriendly, MdDinnerDining, MdKitchen, MdLocalParking, MdLunchDining, MdShower, MdWc } from "react-icons/md";
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
function containsHTML(inputString: string): boolean {
    // Регулярное выражение для поиска HTML-тегов
    const htmlRegex = /<[^>]*>/;
    return htmlRegex.test(inputString);
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
                        <div className="m-2 p-1">
                            {containsHTML(realty?.description) ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: realty.description
                                    }} 
                                />
                            ) : (
                                <Typography variant="body1">{realty.description}</Typography>
                            )}
                        </div>
                        <Stack direction='column' width={'90%'} margin={2}>
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><IoPerson /> <Typography>Гости (взрослые)</Typography></Stack>
                                <Typography variant="subtitle1">{realty.guestCount} чел.</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdChildFriendly /> <Typography>Спальные места для детей</Typography></Stack>
                                <Typography variant="subtitle1">{realty.childrenCount === 0 ? 'Нет' : realty.childrenCount}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdBathroom /> <Typography>Ванные</Typography></Stack>
                                <Typography variant="subtitle1">{realty.bathroomCount}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdShower /> <Typography>Душевые</Typography></Stack>
                                <Typography variant="subtitle1">{realty.showerCount === 0 ? 'Нет' : realty.showerCount}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdWc /> <Typography>Туалеты</Typography></Stack>
                                <Typography variant="subtitle1">{realty.bathroomCount}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdBathtub /> <Typography>Сан. узел раздельный</Typography></Stack>
                                <Typography variant="subtitle1">{realty.bathroomIsCombined ? 'Да' : 'Нет'}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdKitchen /> <Typography>Кухня отдельно</Typography></Stack>
                                <Typography variant="subtitle1">{realty.hasKitchen ? 'Да' : 'Нет'}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdBreakfastDining /> <Typography>Бесплатные завтраки</Typography></Stack>
                                <Typography variant="subtitle1">{realty.hasBreakfast ? 'Да' : 'Нет'}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdLunchDining /> <Typography>Бесплатные обеды</Typography></Stack>
                                <Typography variant="subtitle1">{realty.hasLunch ? 'Да' : 'Нет'}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdDinnerDining /> <Typography>Бесплатные полдники</Typography></Stack>
                                <Typography variant="subtitle1">{realty.hasDinner ? 'Да' : 'Нет'}</Typography>
                            </Stack>
                            <hr />
                            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
                                <Stack direction={'row'} alignItems={'center'} spacing={1}><MdAccessibility /> <Typography>Удобства для людей с ограниченными возможностями</Typography></Stack>
                                <Typography variant="subtitle1">{realty.isAccessible ? 'Да' : 'Нет'}</Typography>
                            </Stack>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper style={{padding: 10}}>
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
                                            <Stack direction='column' spacing={1}>
                                                <Typography>Где находиться?</Typography>
                                                <List>
                                                    <ListItem>{realty?.location?.flag} {realty?.location?.label}, {realty?.location?.region}</ListItem>
                                                    <ListItem>{realty?.city?.name}</ListItem>
                                                    <ListItem>{realty?.address}</ListItem>
                                                </List>
                                                <hr />
                                                <CustomProvider locale={ruRu}>
                                                <DateRangePicker
                                                    label={"Когда хотите отдохнуть здесь?"}
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
                                                        const slots = new Set(realty?.slots.map((slot) => dayjs(slot).format('YYYY-MM-DD')) || []);
                                                        const isSlot = slots.has(dayjs(date).format('YYYY-MM-DD'));
                                                        const formattedBookings = booked.map(b => dayjs(b).format('YYYY-MM-DD'));
                                                        const isBooked = formattedBookings.includes(dayjs(date).format('YYYY-MM-DD'));

                                                        return isBooked || !isSlot;
                                                    }}
                                                    placeholder="Даты въезда и выезда"
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