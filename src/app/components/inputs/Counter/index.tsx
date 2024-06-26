'use client';

import { useCallback } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

interface Props {
    title: string;
    subtitle: string;
    value: number;
    onChange: (value: number) => void;
    max?: number;
	min?: number;
}

const Counter: React.FC<Props> = ({
    title,
    subtitle,
    value,
    onChange,
    max,
	min = 0
}: Props) => {
    const onAdd = useCallback(() => { 
		console.log('onAdd')
        if (max != null && value === max) {
            return;
        }

        onChange(value + 1);
    }, [onChange, value, max]);

    const onReduce = useCallback(() => {
        if (value === min) {
            return;
        }

        onChange(value - 1);
    }, [value, onChange, min]);

    return (
        <div
            className="flex flex-row items-center justify-between m-1"
        > 
            <div className="flex flex-col">
                <div className="font-medium">
                    {title}
                </div>
                <div
                    className="font-light text-gray-600"
                >
                    {subtitle}
                </div>
            </div>
            <div className="flex flex-row items-center gap-4">
            <div
                    onClick={onReduce}
                    className="
                        w-10
                        h-10
                        rounded-full
                        border-[1px]
                        border-neutral-400
                        flex
                        items-center
                        justify-center
                        text-neutral-600
                        cursor-pointer
                        hover:opacity-80
                        transition
                    "
                ><AiOutlineMinus/></div>
                <div
                    onClick={onReduce}
                    className="
                        font-light
                        text-xl
                        text-neutral-600
                    "
                >{value.toString()}</div>
                <div
                    onClick={onAdd}
                    className="
                        w-10
                        h-10
                        rounded-full
                        border-[1px]
                        border-neutral-400
                        flex
                        items-center
                        justify-center
                        text-neutral-600
                        cursor-pointer
                        hover:opacity-80
                        transition
                    "
                ><AiOutlinePlus/></div>
            </div>
        </div>
    );
}
 
export default Counter;