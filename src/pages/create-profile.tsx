import TextField from '@/components/TextField';
import CityDropdown from '@/components/dropdowns/CityDropdown';
import GenderDropdown from '@/components/dropdowns/GenderDropdown';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { QUERY_PARAMS, ROUTES } from '@/lib/routes';
import { createUser, CreateUpdateUserData } from '@/repository/user.repository';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

function ProfileCreate() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateUpdateUserData>();

  const onSubmit = async (data: CreateUpdateUserData) => {
    data.birth_date = new Date(data.birth_date).toISOString();
    createUser(data)
      .then(async () => {
        const redirect =
          (router.query[QUERY_PARAMS.REDIRECT] as string) ?? ROUTES.HOME;
        await router.push(redirect);
        toast.success('Pomyślnie utworzono konto!');
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
      });
  };

  return (
    <AuthFormLayout
      header="Uzupełnij dane"
      onSubmit={handleSubmit(onSubmit)}
      inputChildren={
        <>
          <TextField
            label="Imię"
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
          <CityDropdown
            control={control}
            errors={errors}
            rules={{ required: true }}
          />
          <GenderDropdown
            control={control}
            errors={errors}
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
    />
  );
}

export default ProfileCreate;
