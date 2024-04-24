'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import { getCurrentUser } from "@get-flat/app/http/auth";
import { getRealtyDetails, updateRealty } from "@get-flat/app/http/realty";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { Key, useLayoutEffect, useState } from "react";
import Image from 'next/image';
import ImageSettings from "../components/ImageSettings";
import Button from "@get-flat/app/components/Button";
import { MdUploadFile } from "react-icons/md";
import UploadPhotos from "@get-flat/app/components/modals/UploadPhotos";
import useUploadPhotosModal from "@get-flat/app/hooks/useUploadPhotosModal";
import InputFileUpload from "@get-flat/app/components/UploadFilesButon";
import { FieldValues, useForm } from "react-hook-form";
import { Calendar, CustomProvider } from 'rsuite';

import 'rsuite/dist/rsuite.min.css';



import toast from "react-hot-toast";
import { DateRangePicker } from "rsuite";
import { ruRU } from "rsuite/esm/locales";
import dayjs from "dayjs";
import { http } from "@get-flat/app/http";

const isBooked = (date: Date, booked: [Date, Date][]) => {
    for (const [start, end] of booked) {
        if (new Date(start) <= date && new Date(end) >= date) {
            return true;
        }
    }
    return false;
}

const getCleanDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');

const MyRealtySettings = ({ params }) => {


    const [realty, setRealty] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState(null);

    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    console.log({selectedDates});

    const {
        register,
        handleSubmit,
        setValue,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            images: realty?.images || [],
        }
    });

    const images = watch('images');
    const mainPhoto = watch('mainPhoto');

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
                })
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

    return (
        <ClientOnly>
            <Container>
                <Heading
                    title={`Редактирование / ${realty.title}`}
                    subtitle="На этой странице вы можете внести изменения либо добавить/удалить слоты в которые гости смогут забронировать Ваше место для отдыха"
                />
                <Grid container>
                    <Grid item xs={6}>
                        <Stack spacing={2} marginTop={4}>
                        <Typography variant="h6">Изображения</Typography>
                        <Stack spacing={1}>
                            <div className="w-52">
                                <InputFileUpload
                                    path={`/${realty.id}/images/`}
                                    onLoad={(list) => {
                                        console.log({list});
                                        setValue('images', list);
                                        updateRealty(realty.id, {images: list})
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