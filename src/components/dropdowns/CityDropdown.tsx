import Dropdown from '@/components/Dropdown';
import { getFieldErrorText } from '@/lib/helpers';
import { BACKEND_ROUTES } from '@/lib/routes';
import { Pagination } from '@/models/base.model';
import React from 'react';
import { RegisterOptions } from 'react-hook-form';
import useSWR from 'swr';

type Props = {
  control: any;
  hideLabel?: boolean;
  errors?: any;
  rules?: RegisterOptions;
  onValueChange?: (value: string) => void;
};

function CityDropdown(props: Props) {
  const { data: cities, error } = useSWR<Pagination<City>>(
    BACKEND_ROUTES.CITIES
  );

  if (error) {
    return (
      <div>
        <p className="text-red">Wystąpił błąd podczas ładowania miast.</p>
      </div>
    );
  }

  return (
    <Dropdown
      label={props.hideLabel ? undefined : 'Miasto'}
      name="city_id"
      control={props.control}
      errorText={
        props.errors ? getFieldErrorText('city_id', props.errors) : undefined
      }
      rules={props.rules}
      onValueChange={props.onValueChange}
      data={
        (cities &&
          cities.items.map((city) => ({
            label: city.name,
            value: city.id.toString(),
          }))) ||
        []
      }
    />
  );
}

export default CityDropdown;
