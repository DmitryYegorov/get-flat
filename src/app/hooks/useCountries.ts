import { countries } from 'country-cities';

const formattedCountries = countries.all().map((country) => ({
    code: country.isoCode,
    label: country.name,
    flag: country.flag,
    latlng: [country.latitude, country.longitude],
    region: '',
}));

const useCountries = () => {
    const getAll = () => formattedCountries;

    const getByValue = (value: string) => {
        return formattedCountries.find(fc => fc.value === value);
    };

    return {
        getAll,
        getByValue,
    };
}

export default useCountries;