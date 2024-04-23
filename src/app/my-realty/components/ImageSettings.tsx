import Image from 'next/image';
import { Stack, Typography } from '@mui/material';

import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { MdDelete } from 'react-icons/md';

interface Props {
    isMain?: true,
    src: string;
    width: number;
    height: number;
    fill?: boolean;
    onDelete?: (id: string) => void;
    onMakeMain?: (src: string) => void;
}

const ImageSettings: React.FC<Props> = ({
    isMain,
    width,
    height,
    fill,
    src,
    onDelete,
    onMakeMain,
}) => {
    return ( 
        <div style={{width}} className={`${isMain ? 'p-2' : 'p-1'} bg-neutral-200 rounded-md`}>
            <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
                <div
                    className="
                        flex
                        flex-col
                        gap-2
                        w-full
                        cursor-pointer
                    "
                >
                    <div
                        className='
                            aspect-square
                            w-full
                            relative
                            overflow-hidden
                            rounded-xl
                        '
                        {...bindTrigger(popupState)}
                    >
                        <Image src={src} fill={true} alt={isMain ? "Главное фото" : 'Photo'} 
                            className="
                                object-cover
                                h-full
                                w-full
                                group-hover:scale-110
                                transition
                            "
                        />
                    </div>
                    <Menu {...bindMenu(popupState)}>
                        <MenuItem onClick={() => {
                            onDelete(src);
                            popupState.close();
                        }}><Stack spacing={2} direction='row' alignItems={'center'}><MdDelete color='red'/> <Typography color={'error'}>Удалить</Typography> </Stack></MenuItem>
                        {
                            !isMain && (
                                <>
                                    <MenuItem onClick={() => {
                                        onMakeMain?.(src);
                                        popupState.close();
                                    }}>Сделать главным</MenuItem>
                                </>
                            )
                        }
                    </Menu>
                </div>
            )}
            </PopupState>
            {isMain && <Typography>Главное изображение</Typography>}
        </div>
     );
}

const ContextMenu = () => {
    return (
        <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
            <React.Fragment>
            <div
                className='cursor-pointer'
                {...bindTrigger(popupState)}
            >
                <Image src={src} width={300} height={300} alt={isMain ? "Главное фото" : 'Photo'}/>
            </div>
            <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={popupState.close}>Profile</MenuItem>
                <MenuItem onClick={popupState.close}>My account</MenuItem>
                <MenuItem onClick={popupState.close}>Logout</MenuItem>
            </Menu>
            </React.Fragment>
        )}
        </PopupState>
    )
}
 
export default ImageSettings;