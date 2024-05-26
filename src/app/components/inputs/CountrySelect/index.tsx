'use client';

import useCities from '@get-flat/app/hooks/useCities';
import useCountries from '@get-flat/app/hooks/useCountries';
import { useEffect, useState } from 'react';
import Select from 'react-select';

interface Props {
    country?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
    city?: any;
}

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    code: string;
    region: string;
    cityName?: string;
}

const CountrySelect: React.FC<Props> = ({
    country,
    onChange,
}: Props) => {

    const { getAll } = useCountries();
    const { getAllByCountry, getCities } = useCities();

    const [selectedCountry, setSelectedCountry] = useState(country);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        onChange({
            flag: selectedCountry?.flag,
            label: selectedCountry?.label,
            code: selectedCountry?.code,
            region: selectedCountry?.region,
            cityName: selectedCity?.label,
            latlng: selectedCity ? selectedCity?.latlng : selectedCountry?.latlng,
        } as CountrySelectValue);

		// if (country?.cityName && !selectedCity) {
		// 	setSelectedCity(getCities().find(c => c.label === country.cityName));
		// 	console.log(selectedCity);
		// }
    }, [selectedCity, selectedCountry]);

    return (
        <div className='flex flex-col gap-8'>
            <Select
                placeholder="Регион"
                isClearable
                options={getAll()}
                value={selectedCountry}
                onChange={(value) => {
                    console.log(value);
                    setSelectedCountry(value as CountrySelectValue);
                    // onChange(value as CountrySelectValue)
                }}
                formatOptionLabel={(option) => (
                <div
                    className='
                        flex flex-row items-center gap-3
                    '
                >
                    <div>{option.flag}</div>
                    <div>{option.label}</div>
                </div>
                )}
                classNames={{
                    control: () => 'p-3 border-2',
                    input: () => 'text-lg',
                    option: () => 'text-lg',
                }}
                theme={(theme) => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                        ...theme.colors,
                        primary: '#8285F0',
                        primary25: '#ffffff',
                        
                    }
                })}
            />
            {selectedCountry && (
                <Select
                    placeholder="Город"
                    isClearable
                    options={selectedCountry ? getAllByCountry(selectedCountry?.code) : getCities()}
                    value={getCities().find(c => c.label === country?.cityName)}
                    onChange={(city) => {
                        console.log(city);
                        setSelectedCity(city);
                    }}
                    formatOptionLabel={(option) => (
                    <div
                        className='
                            flex flex-row items-center gap-3
                        '
                    >
                        <div>{option.label}</div>
                    </div>
                    )}
                    classNames={{
                        control: () => 'p-3 border-2',
                        input: () => 'text-lg',
                        option: () => 'text-lg',
                    }}
                    theme={(theme) => ({
                        ...theme,
                        borderRadius: 6,
                        colors: {
                            ...theme.colors,
                            primary: '#8285F0',
                            primary25: '#ffffff',
                            
                        }
                    })}
                />
            )}
        </div>
    );
}
 
export default CountrySelect;
