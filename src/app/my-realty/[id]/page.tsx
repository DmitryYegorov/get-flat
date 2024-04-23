'use client';

import ClientOnly from "@get-flat/app/components/ClientOnly";
import Container from "@get-flat/app/components/Container";
import Heading from "@get-flat/app/components/Heading";
import { getCurrentUser } from "@get-flat/app/http/auth";
import { getRealtyDetails, updateRealty } from "@get-flat/app/http/realty";
import { Grid, Stack, Typography } from "@mui/material";
import { Key, useLayoutEffect, useState } from "react";
import Image from 'next/image';
import ImageSettings from "../components/ImageSettings";
import Button from "@get-flat/app/components/Button";
import { MdUploadFile } from "react-icons/md";
import UploadPhotos from "@get-flat/app/components/modals/UploadPhotos";
import useUploadPhotosModal from "@get-flat/app/hooks/useUploadPhotosModal";
import InputFileUpload from "@get-flat/app/components/UploadFilesButon";
import { FieldValues, useForm } from "react-hook-form";

import toast from "react-hot-toast";


const MyRealtySettings = ({ params }) => {


    const [realty, setRealty] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState(null);

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
                        <Grid container spacing={1} rowSpacing={1}>
                            <Grid item xs={3}>
                                <div>
                                    <ImageSettings
                                        isMain
                                        src={mainPhoto}
                                        width={400}
                                        height={400}
                                        onDelete={(src) => {
                                            const mainPhoto = images[0];
                                            updateRealty(realty.id, {mainPhoto, images: images.slice(1)});
                                            setValue('mainPhoto', src);
                                            setValue('images', images.slice(0));
                                            setRealty(null);
                                        }}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <div style={{
                                    marginLeft: 15,
                                    maxHeight: 300,
                                    width: '100%',
                                    position: 'relative',
                                    display: 'flex',
                                    gap: 10,
                                    overflowX: 'auto',
                                    scrollSnapType: 'x mandatory',
                                }}>
                                    {[...images].map((img: any) => (
                                        <div key={img} style={{
                                            scrollSnapAlign: 'start',
                                            flex: '0 0 300px',
                                        }}>
                                            <ImageSettings
                                                src={img}
                                                width={300}
                                                height={300}
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
                            </Grid>
                        </Grid>
                    </Stack>
                </Stack>
            </Container>
        </ClientOnly>
    );
}
 
export default MyRealtySettings;