'use client';

import Container from "@get-flat/app/components/Container";

import Logo from "@get-flat/app/components/Navbar/Logo";
import Search from "@get-flat/app/components/Navbar/Search"
import UserMenu from "@get-flat/app/components/Navbar/UserMenu"

const Navbar = () => {
    return (<div className="fixed w-full bg-white z-10 shadow-sm">
        <div className="
            py-4
            border-b-[1px]
            z-50
        ">
            <Container>
                <div
                    className="
                        flex
                        flex-row
                        items-center
                        justify-between
                        gap-3
                        md:gap-0
                    "
                >
                    <Logo />
                    <Search />
                    <UserMenu />
                </div>
            </Container>
        </div>
    </div>);
}
 
export default Navbar;