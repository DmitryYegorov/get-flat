'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import { getCurrentUser } from "@get-flat/app/http/auth";
import { getRealtyDetails, updateRealty } from "@get-flat/app/http/realty";
import { Checkbox, Chip, FormControl, FormControlLabel, Grid, InputLabel, ListItem, ListItemAvatar, ListItemText, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Key, useLayoutEffect, useMemo, useState } from "react";
import Image from 'next/image';
import ImageSettings from "../components/ImageSettings";
import Button from "@get-flat/app/components/Button";
import { MdUploadFile } from "react-icons/md";
import UploadPhotos from "@get-flat/app/components/modals/UploadPhotos";
import useUploadPhotosModal from "@get-flat/app/hooks/useUploadPhotosModal";
import InputFileUpload from "@get-flat/app/components/UploadFilesButon";
import { FieldValues, useForm } from "react-hook-form";
import { Avatar, Calendar, CustomProvider, List } from 'rsuite';
import Editor from "@get-flat/app/components/Editor";

import 'rsuite/dist/rsuite.min.css';
import toast from "react-hot-toast";
import { DateRangePicker } from "rsuite";
import { ruRU } from "rsuite/esm/locales";
import dayjs from "dayjs";
import { http } from "@get-flat/app/http";
import Counter from "@get-flat/app/components/inputs/Counter";
import CategoryInput from "@get-flat/app/components/inputs/CategoryInput";
import CountrySelect from "@get-flat/app/components/inputs/CountrySelect";
import dynamic from "next/dynamic";
import Input from "@get-flat/app/components/inputs/Input";
import router from "next/router";
import { useRouter } from "next/navigation";

const isBooked = (date: Date, booked: [Date, Date][]) => {
    for (const [start, end] of booked) {
        if (new Date(start) <= date && new Date(end) >= date) {
            return true;
        }
    }
    return false;
}

const getCleanDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');

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

const MyRealtySettings = ({ params }) => {

    const [realty, setRealty] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [settings, setSettings] = useState(STEPS.CATEGORY);
    const [categories, setCategories] = useState([]);

    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
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
            category: {},
        }
    });

    const images = watch('images');
    const mainPhoto = watch('mainPhoto');
    const categoryId = watch('categoryId');
    const location  = watch('location');
    const guestsCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
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
    const title = watch('title');
    const description = watch('description');

    const Map = useMemo(() => dynamic(() => import('../../components/Map'), {
        ssr: false,
    }), [location]);

    useLayoutEffect(() => {
        if (!currentUser) {
            getCurrentUser()
                .then((res) => {
                    const user = res.data?.payload.user;
                    setCurrentUser(user);
                });
        }

        if (!realty && params.id) {
            getRealtyDetails(params.id)
                .then((res) => {
                    const data = res.data;
                    setRealty(data);
                    setValue('mainPhoto', data.mainPhoto);
                    setValue('images', data.images || []);
                    setValue('categoryId', data.categoryId);
                    setValue('location', data.location);
                    setValue('roomCount', data.roomCount);
                    setValue('bathroomCount', data.bathroomCount);
                    setValue('childrenCount', data.childrenCount);
                    setValue('hasParking', data.hasParking);
                    setValue('hasPlayground', data.hasPlayground);
                    setValue('isAccessible', data.isAccessible);
                    setValue('bathType', data.bathType);
                    setValue('showerCount', data.showerCount);
                    setValue('bathroomCount', data.bathroomCount);
                    setValue('bathroomIsCombined', data.bathroomIsCombined);
                    setValue('hasBreakfast', data.hasBreakfast);
                    setValue('hasLunch', data.hasLunch);
                    setValue('hasDinner', data.hasDinner);
                    setValue('hasKitchen', data.hasKitchen);
                    setValue('title', data.title);
                    setValue('description', data.description);
                    setValue('price', data.price);
                })
        }

        if (categories?.length === 0) {
            http.get('/realty-categories')
                .then((res) => {
                    const categories = res.data;
                    setCategories(categories);
                });
        }
    }, [currentUser, params.id, realty, setValue]);

    const handleDelete = (src: any) => {
        updateRealty(realty.id, {images: images.filter((i: any) => i !== src)})
            .then((res) => {
                toast.success('Изображение успешно удалено!');
                setValue('images', images.filter((i: any) => i !== src));
            });
    }

    const addSelectedDatesToSlots = () => {
        http.post('/realty/booking-slot/add', {
            realtyId: realty.id,
            dates: selectedDates.map(sd => new Date(sd)),
        })
            .then((res) => {
                setRealty(null);
            });
    }

    if (!realty) {
        return null;
    }

    let settingsBody = null;

    if (settings === STEPS.CATEGORY) {
        settingsBody = (
            <div className="flex flex-col gap-8 p-2">
                <Heading
                    title={"Выберите категорию"}
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
                                    setValue('categoryId', id);
                                    // setValue('category', category);
                                }}
                                categoryId={category.id}
                                selected={category.id === categoryId}
                                label={category.name}
                            />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (settings === STEPS.LOCATION) {
        settingsBody = (
            <div
                className="flex flex-col gap-8"
            >
                <Heading
                    title="Где находиться ваш объект?"
                />
                <CountrySelect
                    onChange={(value) => setValue('location', value)}
                    value={location}
                />
                <Map
                    center={location?.latlng}
                />
            </div>
        );
    }

    if (settings === STEPS.INFO) {
        settingsBody = (
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
                        onChange={(value) => setValue('guestCount', value)}
                    />
                    <hr />
                    <Counter
                        title="Детские"
                        subtitle="Сколько у вас метс для детей, если есть?"
                        value={childrenCount}
                        onChange={(value) => setValue('childrenCount', value)}
                    />
                    <hr />
                    <Counter
                        title="Комнаты"
                        subtitle="Сколько у вас отдельных комнат?"
                        value={roomCount}
                        onChange={(value) => setValue('roomCount', value)}
                    />
                    <div>
                    <div className="flex flex-col">
                        <FormControlLabel control={<Checkbox defaultChecked={hasParking} onChange={(e) => setCustomValue('hasParking', e.target.checked)}/>} label="Есть паркока" />
                        <FormControlLabel control={<Checkbox defaultChecked={hasPlayground} onChange={(e) => setCustomValue('hasPlayground', e.target.checked)}/>} label="Есть детская площадка" />
                        <FormControlLabel control={<Checkbox defaultChecked={isAccessible} onChange={(e) => setCustomValue('isAccessible', e.target.checked)}/>} label="Удобства для людей с ограниченными возможностями" />
                    </div>
                    </div>
            </div>
        );
    }

    if (settings === STEPS.BATH) {
        settingsBody = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Сведения о сан. узле"
                />
                <Counter
                    title="Туалеты"
                    subtitle="Сколько у вас туалетов?"
                    value={wcCount}
                    onChange={(value) => setValue('wcCount', value)}
                />
                <FormControl fullWidth>
                    <InputLabel id="bathType">Ванная или душ?</InputLabel>
                    <Select
                        label="Тип ванной"
                        id="bathType"
                        onChange={(e: any) => {
                            setValue('bathType', e.target.value);
                        } }
                        size="medium"
                        value={bathType}
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
                        onChange={(value) => setValue('bathroomCount', value)}
                    />
                )}
                {(bathType === 'shower' || bathType === 'both') && (
                    <Counter
                        title="Душевые"
                        subtitle="Сколько у вас отдельных душевых комнат?"
                        value={showerCount}
                        onChange={(value) => setValue('showerCount', value)}
                    />
                )}
                <FormControlLabel control={<Checkbox defaultChecked={bathroomIsCombined} onChange={(e) => setValue('bathroomIsCombined', e.target.checked)}/>} label="Совмещенный сан.узел" />
            </div>
        );
    }

    if (settings === STEPS.FOOD) {
        settingsBody = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Услуги питания"
                    subtitle="Что Вы предлгаете гостям касательно питания?"
                />
                <div className="flex flex-col">
                    <FormControlLabel control={<Checkbox defaultChecked={hasKitchen} onChange={(e) => setValue('hasKitchen', e.target.checked)}/>} label="Собственная кухня в номере" />
                    <FormControlLabel control={<Checkbox defaultChecked={hasBreakfast} onChange={(e) => setValue('hasBreakfast', e.target.checked)}/>} label="Включены затравки" />
                    <FormControlLabel control={<Checkbox defaultChecked={hasLunch} onChange={(e) => setValue('hasLunch', e.target.checked)}/>} label="Включены обеды" />
                    <FormControlLabel control={<Checkbox defaultChecked={hasDinner} onChange={(e) => setValue('hasDinner', e.target.checked)}/>} label="Включены полдники" />
                </div>    
            </div>
        );
    }

    if (settings === STEPS.DESCRIPTION) {
        settingsBody = (
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
                    disabled={false}
                    
                    errors={errors}
                    required
                    register={register}
                />
                <Editor
                    content={description}
                    onChange={(html) => setValue('description', html)}
                />
            </div>
        );
    }

    const handleEditData = async (data) => {
        delete data.imageSrc;
        delete data.id;
        // delete data.category.id;
        delete data.mainPhoto;

        console.log(data);

        const res = await updateRealty(realty.id, {
            ...data,
        });

    }

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title={`Управление недвижимостью / ${realty.title}`}
                    subtitle="На этой странице вы можете внести изменения либо добавить/удалить слоты в которые гости смогут забронировать Ваше место для отдыха"
                />
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack>
                            <Typography>Брони</Typography>
                            <Paper>
                                <List>
                                    {realty?.bookings.map(b => (
                                        <ListItem key={b.id} className="hover:bg-indigo-200 cursor-pointer border-collapse" onClick={() => router.push(`/bookings/${b.id}`)}> 
                                            <ListItemText>{`${dayjs(b.startDate).format('MM-DD-YYYY')} - ${dayjs(b.endDate).format('DD-MM-YYYY')}`}</ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={2} marginTop={4}>
                        <Typography variant="h6">Изображения</Typography>
                        <Stack spacing={1}>
                            <div className="w-52">
                                <InputFileUpload
                                    path={`/${realty.id}/images/`}
                                    onLoad={(list) => {
                                        console.log({list});
                                        setValue('images', [...images, ...list]);
                                        updateRealty(realty.id, {images: [...images, ...list]})
                                            .then(res => {
                                                toast.success('Изображения успешно загружены');
                                                setRealty(null);
                                            });
                                    }}
                                />
                            </div>
                            <Stack spacing={1} direction={'row'}>
                                    <div>
                                        <ImageSettings
                                            isMain
                                            src={mainPhoto}
                                            width={200}
                                            height={200}
                                            onDelete={(src) => {
                                                const mainPhoto = images[0];
                                                updateRealty(realty.id, {mainPhoto, images: images.slice(1)});
                                                setValue('mainPhoto', src);
                                                setValue('images', images.slice(0));
                                                setRealty(null);
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        marginLeft: 15,
                                        maxHeight: 300,
                                        width: '100%',
                                        position: 'relative',
                                        display: 'flex',
                                        gap: 0,
                                        overflowX: 'auto',
                                        scrollSnapType: 'x mandatory',
                                    }}>
                                        {[...images].map((img: any) => (
                                            <div key={img} style={{
                                                scrollSnapAlign: 'start',
                                                flex: '0 0 160px',
                                            }}>
                                                <ImageSettings
                                                    src={img}
                                                    width={150}
                                                    height={150}
                                                    onDelete={handleDelete}
                                                    onMakeMain={(src) => {
                                                        const mainPhoto = images[0];
                                                        updateRealty(realty.id, {mainPhoto, images: [...images.filter(img => img !== src), realty.mainPhoto]});
                                                        setValue('mainPhoto', src);
                                                        setValue('images', images.slice(0));
                                                        setRealty(null);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                            </Stack>
                        </Stack>
                        <Stack>
                            <Typography variant="h6">Информация</Typography>
                            <Paper style={{padding: 1}}>
                                <Stack spacing={2} margin={2}>
                                    <FormControl>
                                        <InputLabel id="bathType">Секция Данных</InputLabel>
                                        <Select
                                            id="bathType"
                                            onChange={(e: any) => {
                                                setSettings(e.target.value);
                                            } }
                                            size="medium"
                                            value={settings}
                                        >
                                            <MenuItem value={STEPS.CATEGORY}>Категория</MenuItem>
                                            <MenuItem value={STEPS.LOCATION}>Локация</MenuItem>
                                            <MenuItem value={STEPS.INFO}>Информация</MenuItem>
                                            <MenuItem value={STEPS.BATH}>Санитарные комнаты</MenuItem>
                                            <MenuItem value={STEPS.FOOD}>Питание</MenuItem>
=                                           <MenuItem value={STEPS.DESCRIPTION}>Описание</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <hr/>
                                    {settingsBody}
                                    <Button
                                        label="Сохранить"
                                        onClick={handleSubmit(handleEditData)}
                                    />
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack marginTop={5} spacing={2}>
                            <Typography variant="h6">Доступные слоты бронирования</Typography>
                            <Paper>
                                <Stack spacing={2} className="p-6">
                                    <Button
                                        label="Добавить на выбранные даты"
                                        disabled={selectedDates.length === 0}
                                        onClick={() => {
                                            addSelectedDatesToSlots();
                                            setSelectedDates([]);
                                        }}
                                    />
                                    <Button
                                        label="Удалить выбранные слоты"
                                        outline
                                    />
                                </Stack>
                                <hr />
                                <CustomProvider locale={ruRU}>
                                    <Calendar
                                        compact
                                        cellClassName={(date: Date) => {

                                            for (const item of realty.slots) {
                                                if (getCleanDate(item) === getCleanDate(date)) {
                                                    return 'bg-neutral-200 border-solid border-2 border-rose-600';
                                                }
                                            }

                                            for (const [start,end] of realty.booked) {

                                                if (new Date(start) <= date && new Date(end) >= date) {
                                                    return 'bg-indigo-100';
                                                }
                                            }

                                            if (selectedDates.includes(dayjs(date).format('YYYY-MM-DD'))) {
                                                return 'border-solid border-2 border-indigo-600 bg-indigo-100 rounded-md outline-none'
                                            }

                                            return '';
                                        }}
                                        onSelect={(date) => {
                                            console.log(date, isBooked(date, realty.booked));

                                            if (isBooked(date, realty.booked)) {
                                                return;
                                            }

                                            if (!selectedDates.includes(dayjs(date).format('YYYY-MM-DD'))) {
                                                setSelectedDates([...selectedDates, dayjs(date).format('YYYY-MM-DD')]);
                                            } else {
                                                setSelectedDates([...selectedDates.filter(s => s !== dayjs(date).format('YYYY-MM-DD'))]);
                                            }
                                        }}
                                    />
                                </CustomProvider>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </ClientOnly>
    );
}
 
export default MyRealtySettings;