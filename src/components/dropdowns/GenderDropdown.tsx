import Dropdown from '@/components/Dropdown';
import { getFieldErrorText } from '@/lib/helpers';
import { BACKEND_ROUTES } from '@/lib/routes';
import { Pagination } from '@/models/base.model';
import React from 'react';
import { RegisterOptions } from 'react-hook-form';
import useSWR from 'swr';

type Props = {
  control: any;
  errors?: any;
  rules?: RegisterOptions;
  onValueChange?: (value: string) => void;
};

function GenderDropdown(props: Props) {
  const { data: genders, error } = useSWR<Pagination<Gender>>(
    BACKEND_ROUTES.GENDERS
  );

  if (error) {
    return (
      <div>
        <p className="text-red">Wystąpił błąd podczas ładowania płci.</p>
      </div>
    );
  }

  return (
    <Dropdown
      label="Płeć"
      name="gender_id"
      control={props.control}
      errorText={
        props.errors ? getFieldErrorText('gender_id', props.errors) : undefined
      }
      rules={props.rules}
      onValueChange={props.onValueChange}
      data={
        (genders &&
          genders.items.map((gender) => ({
            label: gender.type,
            value: gender.id.toString(),
          }))) ||
        []
      }
    />
  );
}

export default GenderDropdown;
