'use client';

import { useLayoutEffect, useState } from "react";
import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { getFavoriteRealties } from "../http/realty";
import RealtyCard from "../components/realties/RealtyCard";
import { getCurrentUser } from "../http/auth";

const Favorites = () => {


    const [realties, setRealties] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    useLayoutEffect(() => {
        getFavoriteRealties()
            .then((res) => {
                setRealties(res.data?.list || []);
            })

        if (!currentUser) {
            getCurrentUser()
                .then((res) => {
                    const user = res.data?.payload?.user;
                    setCurrentUser(user);
                })
        }
    }, [currentUser]);

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title={'Избранное'}
                    subtitle="Кажется, Вам это понравилось"
                />

                <div
                    className="
                        pt-24
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        md:grid-cols-3
                        lg:grid-cols-4
                        xl:grid-cols-5
                        2xl:grid-cols-6
                        gap-8
                    "
                >
                    {realties.map((realty: any) => (
                        <RealtyCard
                            key={realty.id}
                            data={realty}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            </Container>
        </ClientOnly>
    );
}
 
export default Favorites;