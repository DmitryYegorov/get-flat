'use client';

import { useEffect, useState } from "react";
import { http } from "../http";

interface Props {
    children: React.ReactNode;
}

const ClientOnly = ({children}: Props) => {
    const [hasMounted, setHasMounted] = useState(false);
    

    useEffect(() => {
        setHasMounted(true); 
    }, []);

    // useEffect(() => {
    //     if (localStorage.getItem('accessToken') && !authStore.user) {
    //         http.get('/users/auth/me')
    //             .then((res) => {
    //                 const data = res.data;
    //             })
    //     }
    // }, [authStore]);

    if (!hasMounted) {
        return null;
    }

    return ( <>{children}</> );
}
 
export default ClientOnly;