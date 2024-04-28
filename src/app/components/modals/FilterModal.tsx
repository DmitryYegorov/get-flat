'use client';

import {http} from '../../http';
import {FcGoogle} from 'react-icons/fc';
import { useCallback, useEffect, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm,
} from 'react-hook-form';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import useLoginModal from '@get-flat/app/hooks/useLoginModal';
import useRegisterModal from '@get-flat/app/hooks/useRegisterModule';
import useAuth from '@get-flat/app/hooks/useAuth';
import useFilter from '@get-flat/app/hooks/useFilterModal';
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet';
import Map from '../Map';
import CountrySelect from '../inputs/CountrySelect';
import { FormControlLabel, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox } from '@mui/material';
import { MdLocationCity, MdRestore, MdRoomPreferences } from 'react-icons/md';
import useCities from '@get-flat/app/hooks/useCities';
import Counter from '../inputs/Counter';
import { indigo } from '@mui/material/colors';
import CategoryInput from '../inputs/CategoryInput';

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

const FilterModal = () => {
    
    const filterModal = useFilter();
    const cities = useCities();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (!categories?.length) {
            http.get('/realty-categories')
                .then(res => {
                    const c = res.data;
                    setCategories(c);
                });
        }
    }, [categories]);

    const [step, setStep] = useState(STEPS.LOCATION);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        },
        reset,
    } = useForm<FieldValues>({
        defaultValues: {
            location: null,
            city: null,
            guestCount: 2,
            childrenCount: 0,
            hasParking: false,
            hasPlayground: false,
            isAccessible: false,
            categoryId: null,
        }
    });

    const location = watch('location');
    const city = watch('city');
    const guestCount = watch('guestCount');
    const childrenCount = watch('childrenCount');
    const hasParking = watch('hasParking');
    const hasPlayground = watch('hasPlayground');
    const isAccessible = watch('isAccessible');
    const categoryId = watch('categoryId');

    useEffect(() => {
        // if (location != null) {
        //     filterModal.setParams({
        //         ...filterModal.params,
        //         city,
        //         location,
        //     });
        // }

        filterModal.setParams({
            ...filterModal.params,
            location,
            city,
            guestCount,
            childrenCount,
            hasParking,
            hasPlayground,
            isAccessible,
            categoryId,
        })

        console.log('filter', filterModal.params);
    }, [location, city, guestCount, childrenCount, hasParking, hasPlayground, isAccessible, categoryId]);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
    };

    const navigation = (
        <List>
            <ListItemButton onClick={() => setStep(STEPS.LOCATION)}>
                <ListItemIcon><MdLocationCity /></ListItemIcon>
                <ListItemText>Локация</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={() => setStep(STEPS.INFO)}>
                <ListItemIcon><MdRoomPreferences /></ListItemIcon>
                <ListItemText>Кол-во мест</ListItemText>
            </ListItemButton>
            <ListItemButton onClick={() => setStep(STEPS.CATEGORY)}>
                <ListItemIcon><MdRoomPreferences /></ListItemIcon>
                <ListItemText>Категория</ListItemText>
            </ListItemButton>

            <ListItemButton onClick={() => {
                reset();
                filterModal.setParams(null);
            }} color={indigo[100]}>
                <ListItemIcon><MdRestore /></ListItemIcon>
                <ListItemText>Сбронить фильтр</ListItemText>
            </ListItemButton>
        </List>
    );

    let bodyContent;

    if (step === STEPS.LOCATION) {
        bodyContent = (
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    {navigation}
                </Grid>
                <Grid item>
                    <div
                        className='
                            flex
                            flex-col
                            gap-4
                        '
                    >
                        <Heading
                            title={'Куда хотите отправиться?'}
                            center
                        />
                        <CountrySelect
                            onChange={(value) => {
                                setValue('location', value);
                                if (value != null) {
                                    const city = cities.getByName(value?.cityName || '');
                                    setValue('city', city);
                                }
                            }}
                            country={location}
                            city={city}
                        />
                        <Map
                            center={location?.latlng}
                        />
                    </div>
                </Grid>
            </Grid>
        );
    }

    if (step === STEPS.INFO) {
        bodyContent = (
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    {navigation}
                </Grid>
                <Grid item xs={8}>
                <div
                    className="flex flex-col gap-8"
                >
                    <Heading
                        title={"Количество мест"}                   
                    />
                        <Counter
                            title="Взрослые"
                            subtitle=""
                            value={guestCount}
                            onChange={(value) => setValue('guestCount', value)}
                        />
                        <hr />
                        <Counter
                            title="Дети"
                            subtitle=""
                            value={childrenCount}
                            onChange={(value) => setValue('childrenCount', value)}
                        />
                        <div>
                            <div className="flex flex-col gap-2">
                                <FormControlLabel control={<Checkbox defaultChecked={hasParking} onChange={(e) => setValue('hasParking', e.target.checked)}/>} label="Нужна парковка" />
                                <FormControlLabel control={<Checkbox defaultChecked={hasPlayground} onChange={(e) => setValue('hasPlayground', e.target.checked)}/>} label="Нужна детская площадка" />
                                <FormControlLabel control={<Checkbox defaultChecked={isAccessible} onChange={(e) => setValue('isAccessible', e.target.checked)}/>} label="Я инвалид" />
                            </div>
                        </div>
                </div>
            </Grid>
            </Grid>
        );
    }

    if (step === STEPS.CATEGORY) {
        bodyContent = (
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    {navigation}
                </Grid>
                <Grid item>
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
                            }}
                            categoryId={category.id}
                            selected={category.id === categoryId}
                            label={category.name}
                        />
                    </div>
                ))}
            </div>
                </Grid>
            </Grid>
        );
    }
    


    return ( 
        <Modal
            width="70%"
            disabled={isLoading}
            isOpen={filterModal.isOpen}
            title='Поиск'
            actionLabel='Продолжить'
            onClose={filterModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
        />
    );
}
 
export default FilterModal;