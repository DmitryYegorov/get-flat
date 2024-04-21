import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import Realty from './page';
import { useMemo } from "react";
import Image from 'next/image';
import HeartButton from "@get-flat/app/components/HeartButton";

interface Props {
    realty: any;
    reservations?: any[]; 
}

const ListingClient: React.FC<Props> = ({realty}) => {
 
    return ( 
        <Container>
            <Heading
                title={realty.title}
                subtitle={`${realty.location?.region}, ${realty?.location?.label}`}
            />
            <div
                className="
                    w-full
                    h-[60vh]
                    overflow-hidden
                    rounded-xl
                    relative
                "
            >
                <Image
                    fill
                    src={realty.mainPhoto}
                    alt={realty.title}
                    className="object-cover w-full"
                />
                <div
                    className="absolute top-5 right-5"
                >
                    <HeartButton
                        realtyId={realty.id}
                        currentUser={{}}
                    />
                </div>
            </div>
            <div className="text-l">
                    {realty.description}
            </div>
        </Container>
     );
}
 
export default ListingClient;