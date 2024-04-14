'use client';

import useCountries from '@get-flat/app/hooks/useCountries';
import Select from 'react-select';

interface Props {
    value?: CountrySelectValue;
    onChange: (value: CountrySelectValue) => void;
}

export type CountrySelectValue = {
    flag: string;
    label: string;
    latlng: number[];
    value: string;
    region: string;
}

const CountrySelect: React.FC<Props> = ({
    value,
    onChange,
}: Props) => {

    const { getAll } = useCountries();

    return (
        <div>
            <Select
                placeholder="Anywhere"
                isClearable
                options={getAll()}
                value={value}
                onChange={(value) => onChange(value as CountrySelectValue)}
                formatOptionLabel={(option) => (
                <div
                    className='
                        flex flex-row items-center gap-3
                    '
                >
                    <div>{option.flag}</div>
                    <div>{option.label},
                        <span className='text-neutral-500 ml-1'>
                            {option.region}
                        </span>
                    </div>
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
        </div>
    );
}
 
export default CountrySelect;
