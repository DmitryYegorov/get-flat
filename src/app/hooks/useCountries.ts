import countries from 'world-countries';

const formattedCountries = countries.map(country => ({
    value: country.cca2,
    label: country.translations.rus.common,
    flag: country.flag,
    latlng: country.latlng,
    region: country.region,
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