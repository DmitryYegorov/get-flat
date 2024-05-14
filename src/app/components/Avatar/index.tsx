'use client';

import Image from "next/image";
import { Avatar as MuiAvatar } from "@mui/material";

interface Props {
	imageSrc: string | null;
}

export default function Avatar(props: Props) {
	const {imageSrc} = props;
    return (
        // <Image
        //     className="rounded-full"
        //     height={50}
        //     width={50}
        //     src={imageSrc || "/images/placeholder.jpg"}
        //     alt={"Avatar"}            
        // />

		<MuiAvatar
			src={imageSrc || '/images/placeholder.jpg'}
			sx={{
				width: 30,
				height: 30,
			}}
		/>
    );
}