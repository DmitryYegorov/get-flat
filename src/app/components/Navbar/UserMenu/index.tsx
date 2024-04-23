'use client';

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "@get-flat/app/components/Avatar";
import { useCallback, useState } from "react";
import MenuItem from "@get-flat/app/components/Navbar/MenuItem";
import useRegisterModule from "@get-flat/app/hooks/useRegisterModule";
import useLoginModal from '@get-flat/app/hooks/useLoginModal';
import useAuth from "@get-flat/app/hooks/useAuth";
import useRentModal from "@get-flat/app/hooks/useRentModal";
import { useRouter } from "next/navigation";

export default function UsersMenu() {
    const registerModal = useRegisterModule();
    const loginModal = useLoginModal();
    const authStore = useAuth();
    const rentModal = useRentModal();

    const router = useRouter();

    const [isOpen, setOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setOpen(value => !value);
    }, []);

    const onRent = useCallback(() => {
        if (!authStore.isAuthorized) {
            return loginModal.onOpen();
        }

        return rentModal.onOpen();

    }, [authStore.isAuthorized, loginModal, rentModal]);

    return <div
        className="relative"
    >
        <div 
            className="
                flex
                flex-row
                items-center
                gap-3
            "
        >
            <div
                onClick={onRent}
                className="
                    hidden
                    md:block
                    text-sm
                    font-semibold
                    py-3
                    px-4
                    rounded-full
                    hover:bg-neutral-100
                    transtion
                    cursor-pointer
                "
            >
                HomeGuru твой дом
            </div>
            <div
                onClick={toggleOpen}
                className="
                    p-4
                    md:py-1
                    md:px-2
                    border-[1px]
                    border-neutral-200
                    flex
                    flex-row
                    items-center
                    gap-3
                    rounded-full
                    cursor-pointer
                    hover:shadow-md
                    transition
                "
            >
                <AiOutlineMenu />
                <div className="hidden md:block">
                    <Avatar />
                </div>
            </div>
        </div>
        {isOpen && (
            <div
                className="
                    absolute
                    rounded-xl
                    shadow-md
                    w-[40vw]
                    md:w-3/4
                    bg-white
                    overflow-hidden
                    right-0
                    top-12
                    text-sm
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        cursor-pointer
                    "
                >
                    {!(localStorage.getItem('accessToken') && localStorage.getItem('payload')) ? (
                        <>
                        <MenuItem
                            onClick={() => loginModal.onOpen() }
                            label="Войти"
                        />
                        <MenuItem
                            onClick={() => registerModal.onOpen() }
                            label="Зарегистрироваться"
                        />
                    </>
                    ) : (
                        <>
                            <MenuItem
                                onClick={() => router.push('/profile') }
                                label="Профиль"
                            />
                            {(authStore.user.role === 'ADMIN' && (
                                <MenuItem
                                onClick={() => {}}
                                label="Панель Администратора"
                                />
                            ))}
                            <MenuItem
                                onClick={() => {} }
                                label={`Мои поездки`}
                            />
                            <MenuItem
                                onClick={() => router.push('/favorites') }
                                label={`Избранное`}
                            />
                            <MenuItem
                                onClick={() => {} }
                                label={`Брони`}
                            />
                            <hr/>

                            <MenuItem
                                onClick={() => router.push('/my-realty')}
                                label={`Моя недвижимость`}
                            />
                            <hr/>
                            <MenuItem
                            onClick={() => loginModal.onOpen() }
                            label="Выйти"
                        />
                        </>
                    )}
                </div>
            </div>
        )}
    </div>
}

interface MenuProps {
    isOpen: boolean;
}