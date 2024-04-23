'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import { http } from "@get-flat/app/http";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ListingClient from "./ListingClient";

export default function Realty({ params }) {

    const router = useRouter();

    const [realty, setRealty] = useState(null);
    const [booking, setBooking] = useState(null)
    
    useEffect(() => {
        http.get(`/realty/${params.id}`)
            .then(res => {
                const realty = res.data;
                setRealty(realty);
            })
    }, [params.id]);

    if (!realty) {
        return null; 
    }

    return (
        <ClientOnly>
            <ListingClient realty={realty} bookings={realty.bookings}/>
        </ClientOnly>
    );
}