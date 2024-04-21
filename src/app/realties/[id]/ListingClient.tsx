import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import Realty from './page';
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import Image from 'next/image';
import HeartButton from "@get-flat/app/components/HeartButton";
import { IoPerson } from "react-icons/io5";
import { Grid, List, ListItem, ListItemIcon, Paper, Stack, Typography } from "@mui/material";
import { MdBathroom, MdBedroomParent } from "react-icons/md";
import Button from "@get-flat/app/components/Button";
import { http } from "@get-flat/app/http";

interface Props {
    realty: any;
    reservations?: any[]; 
}

const ListingClient: React.FC<Props> = ({realty}) => {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        if (!currentUser) {
            http.get('/users/auth/me')
            .then((res) => {
                setCurrentUser(res.data?.payload?.user);
            })
            .catch(() => {
                //.. do noting
            })
        }

    }, [currentUser]);
 
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
                <Image
                    fill
                    src={realty.mainPhoto}
                    alt={realty.title}
                    className="object-cover w-full"
                />
                <div
                    className="absolute top-5 right-5"
                >
                    <HeartButton
                        realtyId={realty.id}
                        currentUser={{}}
                    />
                </div>
            </div>
            <Grid container spacing={2} marginTop={1}>
                <Grid item xs={8}>
                    <Paper style={{padding: 10, border: '1px solid #ececee'}} elevation={0}>
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