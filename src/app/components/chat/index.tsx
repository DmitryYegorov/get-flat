'use client';

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import "react-chat-elements/dist/main.css"
import { MessageList } from 'react-chat-elements';
import { indigo } from "@mui/material/colors";
import { getBookingById } from "@get-flat/app/http/bookings";
import { http } from "@get-flat/app/http";
import io from 'socket.io-client';
import { useForm } from "react-hook-form";
import { Button, Stack, TextField } from "@mui/material";


interface Props {
    isOpen: boolean;
    user: any;
    bookingId: string;
    onClose: () => void;
}

const socket = io('http://localhost:4444');

const ChatLayout: React.FC<Props> = ({
    isOpen,
    bookingId,
    user,
    onClose,
}) => {
    
    const [open, setOpen] = useState(isOpen);
    const [messages, setMessages] = useState<any>([]);
    const [newMessage, setNewMessage] = useState('');
	const [booking, setBooking] = useState<any>(null);

    const {
        setValue,
        watch,
    } = useForm();

    const text = watch('text');

    useEffect(() => {
        setOpen(isOpen);

        if (open) {
            http.get(`/bookings/${bookingId}/chat`)
                .then(res => {
                    const m = res.data;
                    setMessages(m);
                });

			getBookingById(bookingId)
				.then(res => {
					const data = res.data;
					setBooking(res);
				})
        }
    }, [bookingId, isOpen, open]);

    useEffect(() => {
        if (!messages?.length) {
            socket.emit('requestAllMessages', {
                bookingId: bookingId,
                userId: user.id,
            });
        }
        socket.on('allMessages', (payload) => {
            setMessages([...payload]);
        });
        socket.on('newMessage', (payload) => {
            setMessages([...payload]);
        });

        // if (messages.filter((m )=> m.from != user.id).some((m) => !m.isRead)) {
        //     setTimeout(() => {
        //         socket.emit('readMessages', {bookingId, userId: user.id});
        //     }, 1500)
        // }
    }, [bookingId, messages, socket, user.id]);

    const sendMessage = () => {
        const message = {
            bookingId,
            from: user.id,
            text,
        };
        socket.emit('sendMessage', message);
        setValue('text', '');
    };

    const handleClose = useCallback(() => {
        setOpen(!open);
        onClose();
    }, [open]);

    return ( 
        <div
            className={`
                justify-center
                items-center
                flex
                overflow-y-hidden
                overflow-x-auto
                fixed
                inset-0
                z-50
                outline-none
                focus:outline-none
                bg-neutral-800/70
                ${open ? `translate-x-0` : 'translate-x-full'}
                ${open ? `opacity-100` : 'opasity-0'}
            `}
        >
            <div
                className={`
                    relative
                    bg-white
                    h-full
                    w-full
                    z-50
                    transalte
                    duration-300
                    ${open ? `translate-x-02` : 'translate-x-full'}
                    ${open ? `opacity-100` : 'opasity-0'}
                `}

                style={{maxWidth: "100%"}}
            >
                <div
                    className="
                        flex
                        items-center
                        p-6
                        rounded-t
                        justify-center
                        relative
                        w-full
                        border-b-[1px]
                    "
                >
                    <button
                        className="
                            p-1
                            border-0
                            hover:opacity-70
                            transition
                            absolute
                            left-9
                        "
                        onClick={handleClose}
                    >
                        <IoMdClose size={18} />
                    </button>

                    <div className="font-semibold">Чат с владельцем {booking?.realty?.tittle} {user.firstName}</div>
                </div>
                <div
                    className={`
                        bg-white
                    `}
                >
                    <div className="flex flex-col min-h-screen">
                        <MessageList
                            lockable={true}
                            toBottomHeight={'100%'}
                            className="flex-auto max-h-[50vh]"
                            dataSource={messages.map((m) => {
                                console.log(user.id, m.from, user.id === m.from);
                                return ({...m, position: user.id === m.from ? 'right' : 'left'});
                            })}
                        />
                        <hr/>
                        <Stack spacing={2} direction={'row'} style={{margin: '10px'}}>
                                <TextField
                                    placeholder="Напишите сообщение..."
                                    multiline
                                    rows={4}
                                    onChange={(e) => setValue('text', e.target.value)}
                                    value={text}
                                    fullWidth
                                />
                                <Button
                                    // backgroundColor={indigo[500]}
									variant="contained"
                                    onClick={sendMessage}
									style={{
										height: '60px'
									}}
                                >Отправить</Button>
                        </Stack>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default ChatLayout;