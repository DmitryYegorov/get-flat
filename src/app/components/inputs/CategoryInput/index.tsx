'use client';

import { BsSnow } from "react-icons/bs";

interface Props {
    onClick: (category: any) => void;
    label: string;
    icon?: string;
    selected?: boolean;
    categoryId: string | null;
}

const CategoryInput: React.FC<Props> = ({
    onClick,
    label,
    selected,
    categoryId,
    icon
}: Props) => {
    return (
        <div
            onClick={() => onClick(categoryId)}
            className={`
                 rounded-xl
                 border-2
                 p-4
                 flex
                 flex-col
                 gap-3
                 hover:border-indigo-500
                 transition
                 cursor-pointer
                 ${selected ? 'border-indigo-500' : 'border-neutral-200'}
            `}
        >
            {/* <BsSnow size={30} /> */}
            <div
                className="font-semibold"
            >
                {label}
            </div>
        </div>
    );
}
 
export default CategoryInput;