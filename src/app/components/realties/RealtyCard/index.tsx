'use client';

import useCountries from "@get-flat/app/hooks/useCountries";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import {format} from 'date-fns';
import Image from 'next/image';
import HeartButton from "../../HeartButton";
import Button from "../../Button";
import { Typography } from "@mui/material";
import { MdStarBorder } from "react-icons/md";

interface Props {
    data: any;
    onAction?: (id: string) => void;
    reservation?: any;
    disabled?: boolean;
    actionLabel?: string;
    actionId?: string;
    currentUser?: any | null;
}

const RealtyCard: React.FC<Props> = ({
    data,
    onAction,
    reservation,
    disabled,
    actionLabel,
    actionId = '',
    currentUser,
}) => {

    const router = useRouter();

    const location = data.location;

    const handleCansel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (disabled) {
            return;
        }

        onAction?.(actionId);
    }, [onAction, actionId, disabled]);

    const handleLike = useCallback(async () => {
        
    }, []);

    const isLiked = () => {
        if (!data || !currentUser) {
            return false;
        }

        const res = !!data?.favorites?.find((f: { userId: any; }) => f.userId === currentUser.id);
        return res;
    };

    return ( 
        <div
            className="
                col-span-1
                cursor-pointer
            "
            onClick={() => {
                router.push(`/realties/${data.id}`);
            }}
        >
            <div
                className="
                    flex
                    flex-col
                    gap-2
                    w-full
                "
            >
                <div
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image
                        src={data.mainPhoto}
                        className="
                            object-cover
                            h-full
                            w-full
                            group
                            hover:scale-110
                            transition
                        "
                        alt={data.title}
                        fill
                    />
                    <div
                        className="
                            absolute
                            top-3
                            right-3
                            flex
                            flex-row
                            gap-2
                        "
                    >
                        <HeartButton
                            realtyId={data.id}
                            favorite={isLiked()}
                        />
                    </div>
                </div>
                <div className="text-xl">{data.title}</div>
                <div
                    className="font-semibold text-lg"
                >{location?.flag} {location?.region}, {location?.label}</div>
                <div className="font-light text-neutral-500">{data.category.name}</div>
                <div className="font-light text-neutral-500 flex items-center gap-2"><MdStarBorder  size={18}/> {data?.rating || 0}</div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">$ {data.price}</div>
                    {!reservation && (
                        <div className="font-light">- 1 ночь</div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCansel}
                    />
                )}
            </div>
        </div>
     );
}
 
export default RealtyCard;