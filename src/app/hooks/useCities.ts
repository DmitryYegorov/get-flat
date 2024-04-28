import { cities } from "country-cities";


const useCities = () => {
    const getCities = () => cities.all().map(c => ({
        label: c.name,
        latlng: [c.latitude, c.longitude],
        country: c.countryCode,
    }));

    const getByName = (name: string) => {
        const c = cities.all().find(c => c.name === name);

        if (c) {
            return {
                label: c.name,
                latlng: [c.latitude, c.longitude],
                country: c.countryCode,
            }
        }

        return null;
    };

    const getAllByCountry = (value: string) => {
        return cities.getByCountry(value)?.map(c => ({
            label: c.name,
            latlng: [c.latitude, c.longitude],
            country: c.countryCode,
        }))
    };

    return {
        getCities,
        getAllByCountry,
        getByName,
    };
}

export default useCities;