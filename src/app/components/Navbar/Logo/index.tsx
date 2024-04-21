'use-client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
    const router = useRouter();

    return ( 
        <div className="flex flex-row gap-2 items-center cursor-pointer transition hover:text-indigo-600" onClick={() => router.push('/')}>
            <Image
                src="/images/logo/logo.svg"
                width={35}
                height={35}
                alt="HomeGuru"
            />
            <div className="text-xl text-indigo-800 font-light">HomeGuru</div>
        </div>
     );
}
 
export default Logo;