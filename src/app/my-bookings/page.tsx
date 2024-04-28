'use client';

import { useEffect, useState } from "react";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import { getCurrentUser } from "../http/auth";
import { getUserBookings } from "../http/bookings";
import Heading from "../components/Heading";
import { Paper, Stack } from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const MyBookingsPage = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [bookings, setBookings] = useState<any[] | null>(null);

    useEffect(() => {
        if (currentUser == null) {
            getCurrentUser()
                .then(res => {
                    const user = res.data?.payload?.user;

                    setCurrentUser(user);
                });
        }

        if (bookings == null) {
            getUserBookings()
                .then((res) => {
                    const b = res.data;
                    setBookings(b || []);
                })
        }
    }, [currentUser, bookings]);

    const router = useRouter();

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title="Ваши брони"
                />
                <Stack spacing={2} marginTop={2}>
                    {bookings?.map(b => (
                        <>
                            <div
                                onClick={() => router.push(`/my-bookings/${b.id}`)}
                                className="
                                    aspect-square
                                    w-full
                                    relative
                                    overflow-hidden
                                    rounded-xl
                                    h-[300px]
                                    cursor-pointer
                                "
                            >
                                <Image
                                    src={b.realty?.mainPhoto}
                                    alt='booking'
                                    fill
                                    className="
                                        object-cover
                                        h-full
                                        w-full
                                        group-hover:scale-110
                                        transition
                                        bg-indigo-500
                                        md:brightness-50
                                        blur-[2px]
                                        hover:scale-110
                                        hover:blur-none
                                        transition-all
                                    "    
                                />
                                <div className="flex flex-col gap-8 absolute top-[40%] left-[40%] text-xl rounded-md text-white items-center">
                                    <div>
                                        {b.realty?.title}
                                    </div>
                                    <div className="font-light">{dayjs(b.startDate).format('DD-MM-YYYY')} - {dayjs(b.endDate).format('DD-MM-YYYY')}</div>
                                </div>
                            </div>
                        </>
                    ))}
                </Stack>
            </Container>
        </ClientOnly>
    );
}
 
export default MyBookingsPage;