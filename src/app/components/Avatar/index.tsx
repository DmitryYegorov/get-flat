'use client';

import Image from "next/image";

interface Props {

}

export default function Avatar(props: Props) {
    return (
        <Image
            className="rounded-full"
            height={30}
            width={30}
            src={"/images/placeholder.jpg"}
            alt={"Avatar"}            
        />
    );
}