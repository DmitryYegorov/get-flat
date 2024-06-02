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
import { Checkbox, FormControlLabel, Select, TextareaAutosize, TextField, MenuItem, FormControl, InputLabel } from "@mui/material";
import Head from "next/head";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    BATH = 3,
    FOOD = 4,
    IMAGES = 5,
    DESCRIPTION = 6,
    PRICE = 7,
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
            wcCount: 1,
            hasKitchen: false,
            hasParking: false,
            childrenCount: 0,
            bathType: '',
            showerCount: 1,
            hasPlayground: false,
            bathroomIsCombined: false,
            isAccessible: false,
            hasBreakfast: false,
            hasDinner: false,
            hasLunch: false,
        }
    });

    const categoryId = watch('categoryId');
    const location  = watch('location');
    const guestsCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');
    const wcCount = watch('wcCount');
    const hasKitchen = watch('hasKitchen');
    const hasParking = watch('hasParking');
    const childrenCount = watch('childrenCount');
    const bathType = watch('bathType');
    const showerCount = watch('showerCount');
    const hasPlayground = watch('hasPlayground');
    const bathroomIsCombined = watch('bathroomIsCombined');
    const isAccessible = watch('isAccessible');
    const hasBreakfast = watch('hasBreakfast');
    const hasLunch = watch('hasLunch');
    const hasDinner = watch('hasDinner');
	const address = watch('address');

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
            return 'Готово';
        }

        return 'Дальше';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === STEPS.CATEGORY) {
            return undefined;
        }

        return 'Назад';
    }, [step]);

    const getCategoriesList = useCallback(async () => {
        try {
            const res = await http.get('/realty-categories');
            return res.data;
        } catch (err) {
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
                title={"Как лучше всего можно описать ваше место?"}
                subtitle="Кликните на подходящий вариент"
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
                {categories?.length && categories.map((category: any) => (
                    <div key={category.name} className="col-span-1">
                        <CategoryInput
                            onClick={(id) => {
                                setCustomValue('categoryId', id);
                            }}
                            categoryId={category.id}
                            selected={category.id === categoryId}
                            label={category.name}
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
                    country={location}
					city={location?.cityName}
                />
                <Map
                    center={location?.latlng}
                />

				<TextField
					multiline
					rows={3}
					placeholder="Адрес"
					label="Адрес"
					onChange={(e) => setCustomValue('address', e.target.value)}
					value={address}
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
                    <hr />
                    <Counter
                        title="Детские"
                        subtitle="Сколько у вас метс для детей, если есть?"
                        value={childrenCount}
                        onChange={(value) => setCustomValue('childrenCount', value)}
                    />
                    <hr />
                    <Counter
                        title="Комнаты"
                        subtitle="Сколько у вас отдельных комнат?"
                        value={roomCount}
                        onChange={(value) => setCustomValue('roomCount', value)}
                    />
                    <div>
                    <div className="flex flex-col">
                        <FormControlLabel control={<Checkbox defaultChecked={hasParking} onChange={(e) => setCustomValue('hasParking', e.target.checked)}/>} label="Есть парковка" />
                        <FormControlLabel control={<Checkbox defaultChecked={hasPlayground} onChange={(e) => setCustomValue('hasPlayground', e.target.checked)}/>} label="Есть детская площадка" />
                        <FormControlLabel control={<Checkbox defaultChecked={isAccessible} onChange={(e) => setCustomValue('isAccessible', e.target.checked)}/>} label="Удобства для людей с ограниченными возможностями" />
                    </div>
                    </div>
            </div>
        );
    }

    if (step === STEPS.BATH) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Сведения о сан. узле"
                />
                <Counter
                    title="Туалеты"
                    subtitle="Сколько у вас туалетов?"
                    value={wcCount}
                    onChange={(value) => setCustomValue('wcCount', value)}
                />
                <FormControl fullWidth>
                    <InputLabel id="bathType">Ванная или душ?</InputLabel>
                    <Select
                        label="Тип ванной"
                        id="bathType"
                        onChange={(e: any) => {
                            setCustomValue('bathType', e.target.value);
                        } }
                        size="medium"
                    >
                        <MenuItem value="bath">Ванная</MenuItem>
                        <MenuItem value="shower">Душевая</MenuItem>
                        <MenuItem value="both">Оба</MenuItem>
                    </Select>
                </FormControl>
                {(bathType === 'bath' || bathType === 'both') && (
                    <Counter
                        title="Ванные комнаты"
                        subtitle="Сколько у вас отдельных ванных комнат?"
                        value={bathroomCount}
                        onChange={(value) => setCustomValue('bathroomCount', value)}
                    />
                )}
                {(bathType === 'shower' || bathType === 'both') && (
                    <Counter
                        title="Душевые"
                        subtitle="Сколько у вас отдельных душевых комнат?"
                        value={showerCount}
                        onChange={(value) => setCustomValue('showerCount', value)}
                    />
                )}
                <FormControlLabel control={<Checkbox defaultChecked={bathroomIsCombined} onChange={(e) => setCustomValue('bathroomIsCombined', e.target.checked)}/>} label="Совмещенный сан.узел" />
            </div>
        );
    }

    if (step === STEPS.FOOD) {
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Услуги питания"
                    subtitle="Что Вы предлгаете гостям касательно питания?"
                />
                <div className="flex flex-col">
                    <FormControlLabel control={<Checkbox defaultChecked={hasKitchen} onChange={(e) => setCustomValue('hasKitchen', e.target.checked)}/>} label="Собственная кухня в номере" />
                    <FormControlLabel control={<Checkbox defaultChecked={hasBreakfast} onChange={(e) => setCustomValue('hasBreakfast', e.target.checked)}/>} label="Включены затравки" />
                    <FormControlLabel control={<Checkbox defaultChecked={hasLunch} onChange={(e) => setCustomValue('hasLunch', e.target.checked)}/>} label="Включены обеды" />
                    <FormControlLabel control={<Checkbox defaultChecked={hasDinner} onChange={(e) => setCustomValue('hasDinner', e.target.checked)}/>} label="Включены полдники" />
                </div>    
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
                <TextField
                    variant="outlined"
                    rows={7}
                    onChange={(e) => {
                        setCustomValue('description', e.target.value);
                        console.log(watch('description'));
                    }}
                    multiline
                    id="description"
                    placeholder="Описание"
                    disabled={isLoading}
                    required
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
            .then((res) => {
                toast.success('Ура! Теперь о вашем месте узнают наши пользователи!');
                reset();
                setStep(STEPS.CATEGORY);
                rentModal.onClose();
                router.replace(`/my-realty/${res.data.id}`);
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