'use client';

import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import Realty from './page';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Image from 'next/image';
import HeartButton from "@get-flat/app/components/HeartButton";
import { IoPerson } from "react-icons/io5";
import { Grid, List, ListItem, ListItemIcon, Paper, Stack, Typography } from "@mui/material";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import Button from "@get-flat/app/components/Button";
import { http } from "@get-flat/app/http";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

interface Props {
    realty: any;
    reservations?: any[]; 
}

const ListingClient: React.FC<Props> = ({realty}) => {

    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            http.get('/users/auth/me')
                .then((res) => {
                    const user = res.data?.payload?.user;
                    if (realty.favorites.filter((f: { realtyId: any; userId: any; }) => f.realtyId === realty.id && f.userId === user.id).length) {
                        setIsLiked(true);
                    }
                    setCurrentUser(user);
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
                        <Typography variant="body1">{realty.description}</Typography>
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
                                <Typography variant="subtitle1">Количество сан. узлов: {realty.bathroomCount}</Typography>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><MdBedroomParent /></ListItemIcon>
                                <Typography variant="subtitle1">Комнаты: {realty.roomsCount}</Typography>
                            </ListItem>
                            <ListItem>
                                {currentUser ? (
                                    <Button
                                        label="Забронировать"
                                        onClick={() => {}}

                                    />
                                ) : (
                                    <Typography variant="caption">Для того, чтобы забронировать нужна авторизация</Typography>
                                )}
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
     );
}
 
export default ListingClient;