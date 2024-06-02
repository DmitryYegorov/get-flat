'use client';

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "@get-flat/app/components/Avatar";
import { useCallback, useEffect, useState } from "react";
import MenuItem from "@get-flat/app/components/Navbar/MenuItem";
import useRegisterModule from "@get-flat/app/hooks/useRegisterModule";
import useLoginModal from '@get-flat/app/hooks/useLoginModal';
import useRentModal from "@get-flat/app/hooks/useRentModal";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@get-flat/app/http/auth";
import Button from "../../Button";
import {isMobile} from "react-device-detect";

export default function UsersMenu() {
    const registerModal = useRegisterModule();
    const loginModal = useLoginModal();
    const rentModal = useRentModal();

    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (user == null) {
            getCurrentUser()
                .then(res => {
                    const u = res.data?.payload?.user;
                    setUser(u);
					// window.location.reload();
                })
                .catch((e) => {
                    localStorage.removeItem('payload');
                    localStorage.removeItem('accessToken');
                    router.push('/');
                })
        }
    }, []);


    const [isOpen, setOpen] = useState(false);

    const toggleOpen = useCallback(() => {
        setOpen(value => !value);
    }, []);

    const onRent = useCallback(() => {
        if (!user) {
            return loginModal.onOpen();
        }

        return rentModal.onOpen();

    }, [user, loginModal, rentModal]);

	const logout = () => {
		if (!user) {
			return;
		}

		localStorage.removeItem('payload');
		localStorage.removeItem('accessToken');
		window.location.reload();
	}

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
            {/* <div
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
                Создать объявление
            </div> */}
			{!!user ? (
				<Button
					label="Создать объявление"
					onClick={onRent}
					disabled={user?.status === 'PUBLICATIONS_BLOCKED'}
				/>
			) : !isMobile && (<div style={{
				width: 300
			}}></div>)}
			<div></div>
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
                    <Avatar imageSrc={user?.avatar}/>
                </div>
            </div>
        </div>
        {isOpen && (
            <div
                className="
                    absolute
                    rounded-xl
                    shadow-md
                    w-[50vw]
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
                    {!user ? (
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
                            {(user?.role === 'ADMIN' && (
                                <MenuItem
                                onClick={() => router.push('/admin-panel')}
                                label="Панель Администратора"
                                />
                            ))}
                            <MenuItem
                                onClick={() => router.push('/my-trips') }
                                label={`Мои поездки`}
                            />
                            <MenuItem
                                onClick={() => router.push('/favorites') }
                                label={`Избранное`}
                            />
                            <MenuItem
                                onClick={() => router.push('/my-bookings') }
                                label={`Брони`}
                            />
                            <hr/>

                            <MenuItem
                                onClick={() => router.push('/my-realty')}
                                label={`Моя недвижимость`}
                            />
                            <hr/>
                            <MenuItem
								onClick={() => logout() }
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