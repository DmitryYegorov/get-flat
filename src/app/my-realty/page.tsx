'use client';

import { Avatar, Chip, Container, Grid, List, ListItem, ListItemAvatar, ListItemButton, Paper, Stack, Typography } from "@mui/material";
import ClientOnly from "../components/ClientOnly";
import Heading from "../components/Heading";
import RealtyCard from "../components/realties/RealtyCard";
import EmptyState from "../components/EmptyState";
import { useEffect, useLayoutEffect, useState } from "react";
import { http } from "../http";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

export default function MyRealty() {
    
  const [realties, setRealties] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const isEmpty = realties.length === 0;

  const [section, setSection] = useState<'draft' | 'public' | 'bookings'>('draft');

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
        http.get('/users/auth/me')
            .then(res => {
                setCurrentUser(res.data?.payload?.user);
            })
    } else {
        http.get(`/realty/users/${currentUser.id}`)
            .then((res) => {
                const data = res.data;

                setRealties(data.list);
            });

        if (section === 'bookings') {
            http.get('/bookings/for-owner')
                .then(res => {
                    const b = res.data;
                    setBookings(b);
                });
        }
    }
  }, [currentUser, section]);
  

  if (isEmpty) {
    return (
      <ClientOnly>
        <EmptyState showReset/>
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <Heading
            title="Моя недвижимость"
        />
        <Grid container spacing={1} alignItems={'baseline'}>
            <Grid item xs={4}>
                <Paper style={{padding: 1}}>
                    <List>
                        <ListItemButton onClick={() => setSection('draft')}>
                            <Typography>Черновики</Typography>
                        </ListItemButton>
                        <ListItemButton onClick={() => setSection('public')}>
                            <Typography>Опубликованные</Typography>
                        </ListItemButton>
                        <ListItemButton onClick={() => setSection('bookings')}>
                            <Typography>Брони</Typography>
                        </ListItemButton>
                    </List>
                </Paper>
            </Grid>
            <Grid item xs={8}>
                <List>
                    {section !== 'bookings' && realties.map((r: any) => (
                        <ListItem key={r.id} className="hover:bg-indigo-200 cursor-pointer border-collapse" onClick={() => router.push(`/my-realty/${r.id}`)}> 
                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={r.mainPhoto}
                                    />
                                </ListItemAvatar>
                                <Typography>{r.title}</Typography>
                                <Chip label={r.status} />
                            </Stack>
                        </ListItem>
                    ))}
                    {section === 'bookings' && bookings.map(b => (
                        <ListItem key={b.id} className="hover:bg-indigo-200 cursor-pointer border-collapse" onClick={() => router.push(`/bookings/${b.id}`)}> 
                            <Stack spacing={1} direction={'row'} alignItems={'center'}>
                                <ListItemAvatar>
                                    <Avatar
                                        src={b.realty.mainPhoto}
                                    />
                                </ListItemAvatar>
                                <Typography>{b.realty.title}</Typography>
                                <Chip label={`${dayjs(b.startDate).format('MM-DD-YYYY')} - ${dayjs(b.endDate).format('DD-MM-YYYY')}`} />
                            </Stack>
                        </ListItem>
                    )
                        
                    )}
                </List>
            </Grid>
        </Grid>
      </Container>
    </ClientOnly>
  )
};