'use client';

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props {
    realtyId: string;
    currentUser?: any;
}

const HeartButton: React.FC<Props> = ({
    realtyId,
    currentUser,
}) => {

    const hasFavorited = true;
    const toggleFavorite = () => {};

    return ( 
        <div
            onClick={toggleFavorite}
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
                    ${hasFavorited ? 'fill-indigo-500' : 'fill-neutral-500/70'}
                `}
             />
        </div>
     );
}
 
export default HeartButton;