'use client';

import { useEffect, useLayoutEffect, useState } from "react";
import { http } from './http';
import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import RealtyCard from "./components/realties/RealtyCard";
import { getCurrentUser } from "./http/auth";
import useFilter from "./hooks/useFilterModal";
import {AccordionSummary, Grid, Stack, Accordion, AccordionDetails, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField} from "@mui/material";
import Heading from "./components/Heading";
import CountrySelect from "./components/inputs/CountrySelect";
import {FieldValues, useForm} from "react-hook-form";
import Map from './components/Map';
import useCities from "./hooks/useCities";
import Counter from "./components/inputs/Counter";
import CategoryInput from "./components/inputs/CategoryInput";
import Button from "./components/Button";
import {CustomProvider, DateRangePicker} from "rsuite";
import 'rsuite/dist/rsuite.min.css';
import ruRu from 'rsuite/locales/ru_RU'


function Home() {

	const [realties, setRealties] = useState([]);
	const [currentUser, setCurrentUser] = useState(null);
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

	const isEmpty = realties.length === 0;
	const defaultValues = {
		location: null,
		city: null,
		guestCount: null,
		childrenCount: null,
		hasParking: null,
		hasPlayground: null,
		isAccessible: null,
		categoryId: null,
		wcCount: null,
		bathType: null,
		bathroomIsCombined: null,
		bathroomCount: null,
		showerCount: null,
		hasKitchen: null,
		hasBreakfast: null,
		hasLunch: null,
		hasDinner: null,
		priceMax: 10000,
		priceMin: 0,
	};

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: {
			errors,
		},
		reset,
		resetField,
	} = useForm<FieldValues>({
		defaultValues,
	});

	const location = watch('location');
	const city = watch('city');
	const guestCount = watch('guestCount');
	const childrenCount = watch('childrenCount');
	const hasParking = watch('hasParking');
	const hasPlayground = watch('hasPlayground');
	const isAccessible = watch('isAccessible');
	const categoryId = watch('categoryId');
	const wcCount = watch('wcCount');
	const bathType = watch('bathType');
	const bathroomIsCombined = watch('bathroomIsCombined');
	const showerCount = watch('showerCount');
	const bathroomCount = watch('bathroomCount');
	const hasKitchen = watch('hasKitchen');
	const hasBreakfast = watch('hasBreakfast');
	const hasDinner = watch('hasDinner');
	const hasLunch = watch('hasLunch');
	const priceMax = watch('priceMax');
	const priceMin = watch('priceMin');
	const startDate = watch('startDate');
	const endDate = watch('endDate');

	const cities = useCities();


  useEffect(() => {

	const user = localStorage.getItem('payload');
	const parsedUser = JSON.parse(user ?? 'null');

	http.post('/realty/get', {
		location,
		city,
		guestCount,
		childrenCount,
		hasParking: hasParking || null,
		hasPlayground: hasPlayground || null,
		isAccessible: isAccessible || null,
		categoryId,
		wcCount,
		bathroomIsCombined,
		showerCount,
		bathType,
		bathroomCount,
		hasDinner: hasDinner || null,
		hasBreakfast: hasBreakfast || null,
		hasKitchen: hasKitchen || null,
		hasLunch: hasLunch || null,
		priceMax,
		priceMin,
		startDate,
		endDate,
		forUserId: currentUser?.id ? currentUser.id : parsedUser?.user?.id,
	})
		.then((res) => {
		const data = res.data;

		setRealties(data.list);
		});
  }, [location, city, guestCount, childrenCount, hasParking, hasPlayground, isAccessible, categoryId, wcCount, bathroomIsCombined, showerCount, bathType, bathroomCount, hasDinner, hasBreakfast, hasKitchen, hasLunch, priceMax, priceMin, startDate, endDate, currentUser?.id]);

//   if (isEmpty) {
//     return (
//       <ClientOnly>
//         <EmptyState showReset/>
//       </ClientOnly>
//     );
//   }

  return (
    <ClientOnly>
      <Container>
        <Grid container spacing={2}>
			<Grid item xs={3}>
				<Stack>
					<div className="mb-1 mt-1">
						<Button label="Сбросить фильтр" onClick={() => {
							window.location.reload();
							reset();
						}}/>
					</div>

					<Accordion defaultExpanded>
						<AccordionSummary>Свободные слоты</AccordionSummary>
						<AccordionDetails>

						<CustomProvider locale={ruRu}>
							<DateRangePicker
								className="rounded-xl border-solid border-[2px] border-indigo-600 outline-none p-1 w-[100%]"
								label={""}
								size="lg"
								defaultCalendarValue={[startDate, endDate]}
								onChange={(value) => {
									setValue('startDate', value?.[0]);
									setValue('endDate', value?.[1]);
								}}
								format="dd/MM/yyyy"
								appearance="subtle"
								placement="right"
								placeholder="Даты въезда и выезда"
								onClean={() => {
									setValue('startDate', null);
									setValue('endDate', null);
								}}
							/>
						</CustomProvider>
						</AccordionDetails>
					</Accordion>

					<Accordion defaultExpanded>
						<AccordionSummary>Локация</AccordionSummary>
						<AccordionDetails>
							<div
								className='
									flex
									flex-col
									gap-4
								'
							>
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
						</AccordionDetails>
					</Accordion>


					<Accordion defaultExpanded>
						<AccordionSummary>Цены</AccordionSummary>
						<AccordionDetails>
							<Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
								<TextField placeholder="От" size="small" label="От" defaultValue={priceMin} type="number" inputProps={{
									min: 0,
								}} onChange={(e) => setValue('priceMin', +e.target.value)}/>
								<TextField placeholder="До" size="small" label="До" defaultValue={priceMax} type="number" inputProps={{
									min: 0,
								}} onChange={(e) => setValue('priceMax', +e.target.value)} />
							</Stack>
						</AccordionDetails>
					</Accordion>

					<Accordion>
						<AccordionSummary>Количество мест</AccordionSummary>
						<AccordionDetails>
						<div
								className="flex flex-col gap-8"
							>
									<Counter
										title="Взрослые"
										subtitle=""
										value={guestCount || 1}
										onChange={(value) => setValue('guestCount', value)}
									/>
									<hr />
									<Counter
										title="Дети"
										subtitle=""
										value={childrenCount || 0}
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
						</AccordionDetails>
					</Accordion>

					<Accordion>
						<AccordionSummary>Тип размещения</AccordionSummary>
						<AccordionDetails>
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
								<div key={1} className="col-span-2">
										<CategoryInput
											onClick={(id) => {
												setValue('categoryId', null);
											}}
											categoryId={null}
											selected={categoryId === null}
											label={'Все'}
										/>
									</div>
								{categories?.length && categories.map((category: any) => (
									<div key={category.name} className="col-span-2">
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
						</AccordionDetails>
					</Accordion>

					<Accordion>
						<AccordionSummary>Сан. узел</AccordionSummary>
						<AccordionDetails>
							<div className="flex flex-col gap-8">
								<Counter
									title="Туалеты"
									subtitle="Сколько у вас туалетов?"
									value={wcCount || 0}
									onChange={(value) => setValue('wcCount', value)}
									min={0}
								/>
								<FormControl fullWidth>
									<InputLabel id="bathType">Ванная или душ?</InputLabel>
									<Select
										label="Тип ванной"
										id="bathType"
										defaultValue={bathType}
										onChange={(e: any) => {
											setValue('bathType', e.target.value);
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
										value={bathroomCount || 0}
										onChange={(value) => setValue('bathroomCount', value)}
										min={0}
									/>
								)}
								{(bathType === 'shower' || bathType === 'both') && (
									<Counter
										title="Душевые"
										subtitle="Сколько у вас отдельных душевых комнат?"
										value={showerCount || 0}
										onChange={(value) => setValue('showerCount', value)}
										min={0}
									/>
								)}
								<FormControlLabel control={<Checkbox defaultChecked={bathroomIsCombined} onChange={(e) => setValue('bathroomIsCombined', e.target.checked)}/>} label="Совмещенный сан.узел" />
							</div>
						</AccordionDetails>
					</Accordion>

					<Accordion>
						<AccordionSummary>Питание</AccordionSummary>
						<AccordionDetails>
							<div className="flex flex-col gap-8">
								<div className="flex flex-col">
									<FormControlLabel control={<Checkbox defaultChecked={hasKitchen} onChange={(e) => setValue('hasKitchen', e.target.checked)}/>} label="Собственная кухня в номере" />
									<FormControlLabel control={<Checkbox defaultChecked={hasBreakfast} onChange={(e) => setValue('hasBreakfast', e.target.checked)}/>} label="Включены затравки" />
									<FormControlLabel control={<Checkbox defaultChecked={hasLunch} onChange={(e) => setValue('hasLunch', e.target.checked)}/>} label="Включены обеды" />
									<FormControlLabel control={<Checkbox defaultChecked={hasDinner} onChange={(e) => setValue('hasDinner', e.target.checked)}/>} label="Включены полдники" />
								</div>    
							</div>
						</AccordionDetails>
					</Accordion>
				</Stack>
			</Grid>
			<Grid item xs={9}>
				<div
					className="
						grid
						grid-cols-1
						sm:grid-cols-1
						md:grid-cols-2
						lg:grid-cols-3
						xl:grid-cols-4
						2xl:grid-cols-5
						gap-8
					"
					>
					{realties.map((realty: any) => (
						<RealtyCard
							key={realty.id}
							data={realty}
							currentUser={currentUser}
						/>
					))}
			</div>
			</Grid>
		</Grid>
      </Container>
    </ClientOnly>
  );
}

export default Home;