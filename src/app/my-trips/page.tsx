'use client';

import { useEffect, useState } from "react";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import { getCurrentUser } from "../http/auth";
import { getUserBookings } from "../http/bookings";
import Heading from "../components/Heading";
import { Link, Paper, Stack } from "@mui/material";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { http } from "../http";

const MyBookingsPage = () => {

    const [currentUser, setCurrentUser] = useState(null);
    const [trips, setTrips] = useState<any[] | null>(null);

    useEffect(() => {
        if (currentUser == null) {
            getCurrentUser()
                .then(res => {
                    const user = res.data?.payload?.user;

                    setCurrentUser(user);
                });
        }

        if (trips == null) {
            getUserBookings()
                .then((res) => {
                    const b = res.data;
                    setTrips(b || []);
                })
        }
    }, [currentUser, trips]);

    const router = useRouter();

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title="Ваши поездки"
                />
                <Stack spacing={2} marginTop={2}>
					{trips?.length == 0 && (
						<Stack className="border-solid border-[3px] border-indigo-500 p-3 rounded-xl flex-col items-center w-[70vw]" style={{margin: '0 auto'}}>
							<Heading
								title="У вас пока что не было подтвержденных брованирований"
								center
								subtitle="Вы можете выбрать то что вам понравиться на главной странице нашего сайта :)"
							/>

							<div>
								<Link href="/">На главную</Link>
							</div>
						</Stack>
					)}
                    {trips?.map(b => (
                        <>
                            <div
                                onClick={() => router.push(`/my-trips/${b.id}`)}
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