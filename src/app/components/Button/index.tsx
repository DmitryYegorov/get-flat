'use client';

import { styled } from "@mui/material";
import { IconType } from "react-icons";

interface Props {
    label: string;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: IconType;
    type?: 'file';
	hidden?: boolean;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

const Button: React.FC<Props> = ({
    label,
    onClick,
    disabled,
    outline,
    small,
    icon: Icon,
    type,
	hidden
}) => {
    return ( <button
        onClick={onClick}
        disabled={disabled}
		style={hidden ? {overflow: 'hidden'} : {}}
        className={`
            relative
            disabled:opacity-70
            disabled:cursor-not-allowed
            rounded-lg
            hover:opacity-80
            transition
            w-full
            ${outline ? 'bg-white' : 'bg-indigo-500'}
            ${outline ? 'border-black' : 'border-indigo-500'}
            ${outline ? 'bg-white' : 'bg-indigo-500'}
            ${outline ? 'text-black' : 'text-white'}
            ${small ? 'py-1' : 'py-3'}
            ${small ? 'text-sm' : 'text-md'}
            ${small ? 'font-light' : 'font-semibold' }
            ${small ? 'border-[1px]' : 'border-[2px]'}
        `}
    >
        {Icon && (
            <Icon
                size={small ? 16 : 24}
                className={`
                    absolute
                    left-4
                    top-3
                `} 
            />
        )}
        {label}
        {type === 'file' && (<VisuallyHiddenInput type="file" />)}
    </button> );
}
 
export default Button;