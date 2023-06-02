import Dropdown from '@/components/Dropdown';
import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  formatDateTimeToInputFormat,
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { Pagination } from '@/models/base.model';
import { UserContext } from '@/providers/UserProvider';
import { CreateUpdateUserData, updateUser } from '@/repository/user.repository';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

const ProfileSettingsEdit = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { data: cities } = useSWR<Pagination<City>>(BACKEND_ROUTES.CITIES);
  const { data: genders } = useSWR<Pagination<Gender>>(BACKEND_ROUTES.GENDERS);

  const {
    register,
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateUpdateUserData>();

  useEffect(() => {
    reset({
      first_name: user?.first_name,
      last_name: user?.last_name,
      birth_date: formatDateTimeToInputFormat(user?.birth_date ?? ''),
      city_id: user?.city.id,
      gender_id: user?.gender.id,
    });
  }, [
    reset,
    user?.birth_date,
    user?.city.id,
    user?.first_name,
    user?.gender.id,
    user?.last_name,
  ]);

  const onSubmit = (data: CreateUpdateUserData) => {
    if (!user) return;

    data.birth_date = new Date(data.birth_date).toISOString();

    updateUser(data, user?.id)
      .then(async () => {
        await router.push(ROUTES.SETTINGS);
        toast.success('Pomyślnie zaktualizowano dane!');
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <AuthFormLayout
      header="Dane osobowe"
      onSubmit={handleSubmit(onSubmit)}
      inputChildren={
        <>
          <TextField
            label="Imie"
            errorText={getFieldErrorText('first_name', errors)}
            {...register('first_name', { required: true })}
          />
          <TextField
            label="Nazwisko"
            errorText={getFieldErrorText('last_name', errors)}
            {...register('last_name', { required: true })}
          />
          <TextField
            label="Data urodzenia"
            type="date"
            errorText={getFieldErrorText('birth_date', errors)}
            {...register('birth_date', { required: true })}
          />
          <Dropdown
            label="Miasto"
            name="city_id"
            control={control}
            errorText={getFieldErrorText('city_id', errors)}
            rules={{ required: true }}
            data={
              (cities &&
                cities.items.map((city) => ({
                  label: city.name,
                  value: city.id.toString(),
                }))) ||
              []
            }
          />
          <Dropdown
            label="Płeć"
            name="gender_id"
            control={control}
            errorText={getFieldErrorText('city_id', errors)}
            rules={{ required: true }}
            data={
              (genders &&
                genders.items.map((gender) => ({
                  label: gender.type,
                  value: gender.id.toString(),
                }))) ||
              []
            }
          />
        </>
      }
      buttonValue="Zapisz"
      buttonOnClick={() => resetKeepValues(reset)}
      errorMessage={
        getFieldErrorText('root', errors) &&
        `Formularz zawiera błędy: ${getFieldErrorText('root', errors)}`
      }
      centered={false}
    />
  );
};

export default ProfileSettingsEdit;
