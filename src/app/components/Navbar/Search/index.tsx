'use client';

import useFilter from "@get-flat/app/hooks/useFilterModal";
import { BiSearch } from "react-icons/bi";

export default function Search() {

    const filter = useFilter();

    return <div
        onClick={() => filter.onOpen({})}
        className="
            border-[1px]
            w-full
            md:w-auto
            py-2
            rounded-full
            shadow-sm
            hover:shadow-md
            transition
            cursor-pointer
        "
    >
        <div
            className="
                flex
                flex-row
                items-center
                justify-between
            "
        >
            <div
                className="
                    hidden
                    sm:block
                    text-sm
                    font-semibold
                    px-6
                    border-x-[1px]
                    flex-1
                    text-center
                "
            >
                Поиск по параметрам
            </div>
            <div
                className="
                    text-sm
                    pl-6
                    pr-2
                    text-gray-600
                    flex
                    flex-row
                    items-center
                    gap-3
                "
            >
                <div
                    className="
                        p-2
                        bg-indigo-500
                        rounded-full
                        text-white
                    "
                >
                    <BiSearch height={18}/>
                </div>
            </div>
        </div>
    </div>
}