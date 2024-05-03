'use client';

import { useRouter } from "next/navigation";
import Heading from "../Heading";
import Button from "../Button";

interface Props {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}

const EmptyState: React.FC<Props> = ({
    title = "Не удалось ничего найти",
    subtitle = "Попробуйте изменить или удалить некоторый параметры поиска..",
    showReset
}) => {
    const router = useRouter();

    return ( 
        <div
            className="
                h-[60vh]
                flex
                flex-col
                gap-2
                justify-center
                items-center
            "
        >
            <Heading
                title={title}
                subtitle={subtitle}
                center
            />
            <div className="w-48 mt-4">
                {showReset && (
                    <Button 
                        outline
                        label="На главную"
                        onClick={() => router.push('/')}
                    />
                )}
            </div>
        </div>
     );
}
 
export default EmptyState;