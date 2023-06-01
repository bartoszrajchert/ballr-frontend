import Dropdown from '@/components/Dropdown';
import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import {
  getFieldErrorText,
  resetKeepValues,
  setUseReactFormErrors,
} from '@/lib/helpers';
import { BACKEND_ROUTES, QUERY_PARAMS, ROUTES } from '@/lib/routes';
import { createUser, CreateUserData } from '@/repository/user.repository';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import useSWR from 'swr';

function ProfileCreate() {
  const router = useRouter();

  const { data: cities } = useSWR<Pagination<City>>(BACKEND_ROUTES.CITIES);
  const { data: genders } = useSWR<Pagination<Gender>>(BACKEND_ROUTES.GENDERS);
  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<CreateUserData>();

  const onSubmit = async (data: CreateUserData) => {
    data.birth_date = new Date(data.birth_date).toISOString();
    createUser(data)
      .then(async (res) => {
        const redirect =
          (router.query[QUERY_PARAMS.REDIRECT] as string) ?? ROUTES.HOME;
        await router.push(redirect);
        toast.success('Pomyślnie utworzono konto!');
      })
      .catch((err) => {
        setUseReactFormErrors(err, setError);
        console.log(err);
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
    />
  );
}

export default ProfileCreate;
