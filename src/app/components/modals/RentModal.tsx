'use client';

import useRentModal from "@get-flat/app/hooks/useRentModal";
import Modal from "./Modal";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import Heading from "../Heading";
import { http } from "@get-flat/app/http";
import toast from "react-hot-toast";
import CategoryInput from "../inputs/CategoryInput";
import { Field, FieldValues, RegisterOptions, SubmitHandler, useForm, UseFormRegisterReturn } from "react-hook-form";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImagesUpload from "../inputs/ImagesUpload";
import Input from "../inputs/Input";
import { useRouter } from "next/navigation";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5,
}

const RentModal = () => {

    const rentModal = useRentModal();

    const [step, setStep] = useState(STEPS.CATEGORY);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {errors},
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            categoryId: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '', 
            price: 1,
            title: '',
            description: '',
        }
    });

    const categoryId = watch('categoryId');
    const location  = watch('location');
    const guestsCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

    const setCustomValue = (id: string, value: any) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        })
    }

    const onBack = () => {
        setStep((value) => value - 1);
    }
    const onNext = () => {
        setStep(value => value + 1);
    }

    const actionLabel = useMemo(() => {
        if (step === STEPS.PRICE) {
            return 'Create';
        }

        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Back';
    }, [step]);

    const getCategoriesList = useCallback(async () => {
        try {
            const res = await http.get('/realty/categories');
            console.log(res.data);
            return res.data;
        } catch (err) {
            console.log({ err });
            toast.error(err?.response?.data?.message);
        }
    }, []);

    useLayoutEffect(() => {
        if (step === STEPS.CATEGORY) {
            getCategoriesList()
                .then(list => setCategories(list));
        }
    }, [getCategoriesList, step]);

    let bodyContent = (
        <div className="flex flex-col gap-8">
            <Heading
                title={"Which is best describes your place?"}
                subtitle="Pick a category"
            />
            <div
                className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    max-h-[50vh]
                    gap-3
                    overflow-y-auto
                "
            >
                {categories.map((category: any) => (
                    <div key={category.name} className="col-span-1">
                        <CategoryInput
                            onClick={(id) => {
                                setCustomValue('categoryId', id);
                            }}
                            categoryId={category.id}
                            selected={category.id === categoryId}
                            label={category.name}
                            icon={category.icon }
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const Map = useMemo(() => dynamic(() => import('../Map'), {
        ssr: false,
    }), [location]);

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <div
                className="flex flex-col gap-8"
            >
                <Heading
                    title="Где находиться ваш объект?"
                />
                <CountrySelect
                    onChange={(value) => setCustomValue('location', value)}
                    value={location}
                />
                <Map
                    center={location?.latlng}
                />
            </div>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <div
                className="flex flex-col gap-8"
            >
                <Heading
                    title={"Расскажите подробнее про ваше место"}
                    subtitle="Что бы Вы хотели рассказать о нем?"                    
                />
                <Counter
                    title="Гости"
                    subtitle="Сколько гостей можете принять?"
                    value={guestsCount}
                    onChange={(value) => setCustomValue('guestCount', value)}
                />
                <hr/>
                <Counter
                    title="Комнаты"
                    subtitle="Сколько у вас отдельных комнат?"
                    value={roomCount}
                    onChange={(value) => setCustomValue('roomCount', value)}
                />
                <hr/>
                <Counter
                    title="Ванная компанат"
                    subtitle="Сколько у вас отдельных ванных комнат или душевых?"
                    value={bathroomCount}
                    onChange={(value) => setCustomValue('bathroomCount', value)}
                />
            </div>
        );
    }

    if (step === STEPS.IMAGES) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Добавьте фото вашего места"
                    subtitle="Покажите гостям как у вас замечательно!"
                />
                <ImagesUpload
                    onChange={(url) => {
                        setCustomValue('imageSrc', url);
                        console.log(url);
                    }}
                    value={imageSrc}
                />
            </div>
        );
    }

    if (step === STEPS.DESCRIPTION) {
        bodyContent = (
            <div
                className="flex flex-col gap-8"
            >
                <Heading
                    title="Как бы вы описали ваше место?"
                    subtitle="Помогите путешественникам узнать больше о нем!"
                />
                <Input
                    id="title"
                    label="Название"
                    disabled={isLoading}
                    errors={errors}
                    required
                    register={register}
                />
                <hr/>
                <Input
                    id="description"
                    label="Описание"
                    disabled={isLoading}
                    errors={errors}
                    required
                    register={register}
                />
            </div>
        );
    }

    if (step === STEPS.PRICE) {
        bodyContent = (
            <div
                className="flex flex-col gap-8"
            >
                <Heading
                    title="Так, а теперь осталось ввести стоимость"
                    subtitle="Оцените по достоинству"
                />
                <Input
                    id="price"
                    label="Цена"
                    formatPrice
                    type='number'
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />
            </div>
        );
    }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);
        data.price = +data.price;
        http.post('/realty', data)
            .then(() => {
                toast.success('Ура! Теперь о вашем месте узнают наши пользователи!');
                router.refresh();
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
            })
            .catch((err) => {
                toast.error(err?.response?.data?.message || 'Что-то пошло не так, попробуйте позже')
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <Modal
            title="Home.GURU - это Ваш дом!"
            isOpen={rentModal.isOpen}
            onClose={rentModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            actionLabel={actionLabel}
            secondaryLabel={secondaryActionLabel}
            body={bodyContent}
            secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
        />
    );
}
 
export default RentModal;