import TextField from '@/components/TextField';
import { DynamicDropdown } from '@/components/dynamic/DynamicDropdown';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  formatDateTimeToInputFormat,
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, ROUTES } from '@/lib/routes';
import { UserContext } from '@/providers/UserProvider';
import { CreateUpdateUserData, updateUser } from '@/repository/user.repository';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const ProfileSettingsEdit = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);

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
    data.birth_date = new Date(data.birth_date).toISOString();

    updateUser(data)
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
          <DynamicDropdown
            label="Miasto"
            name="city_id"
            fieldErrors={errors}
            control={control}
            dataType="pagination"
            apiURL={BACKEND_ROUTES.CITIES}
            mapper={({ name, id }: City) => ({
              label: name,
              value: id.toString(),
            })}
            rules={{ required: true }}
          />
          <DynamicDropdown
            label="Miasto"
            name="city_id"
            control={control}
            fieldErrors={errors}
            dataType="pagination"
            apiURL={BACKEND_ROUTES.CITIES}
            mapper={({ name, id }: City) => ({
              label: name,
              value: id.toString(),
            })}
            rules={{ required: true }}
          />
          <DynamicDropdown
            label="Płeć"
            name="gender_id"
            control={control}
            fieldErrors={errors}
            dataType="pagination"
            apiURL={BACKEND_ROUTES.GENDERS}
            mapper={({ type, id }: Gender) => ({
              label: type,
              value: id.toString(),
            })}
            rules={{ required: true }}
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
