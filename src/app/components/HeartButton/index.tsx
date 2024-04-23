'use client';

import { likeRealty } from "@get-flat/app/http/realty";
import { MouseEventHandler, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props {
    realtyId: string;
    favorite?: boolean,
}

const HeartButton: React.FC<Props> = ({
    realtyId,
    favorite,
}) => {

    const [hasFavorite, setHasFavorite] = useState(!!favorite);
    const toggleHandle = async (e: any) => {
        e.stopPropagation();
        setHasFavorite(!hasFavorite);
        await likeRealty(realtyId);
    }

    return ( 
        <div
            onClick={toggleHandle}
            className="
                relative
                hover:opacity-80
                transition
                cursor-pointer
            "
        >
             <AiOutlineHeart
                size={28}
                className="
                    fill-white
                    absolute
                    -top-[2px]
                    -right-[2px]
                "
             />
             <AiFillHeart
                size={24}
                className={`
                    ${hasFavorite ? 'fill-indigo-500' : 'fill-neutral-500/70'}
                `}
             />
        </div>
     );
}
 
export default HeartButton;