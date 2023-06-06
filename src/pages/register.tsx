import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import { getFieldErrorText } from '@/lib/helpers';
import { QUERY_PARAMS, ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import useSendEmailVerificationWithToast from '@/lib/useSendEmailVerificationWithToast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';

type FormData = {
  email: string;
  password: string;
  repeatPassword: string;
};

export default function Login() {
  const auth = useGetAuth();
  const [createUserWithEmailAndPassword, _, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();
  const sendEmailVerificationWithToast =
    useSendEmailVerificationWithToast(auth);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    createUserWithEmailAndPassword(data.email, data.password).then(
      async (res) => {
        if (res?.user) {
          const redirect =
            (router.query[QUERY_PARAMS.REDIRECT] as string) ?? ROUTES.HOME;
          await router.push({
            pathname: ROUTES.CREATE_PROFILE,
            query: { [QUERY_PARAMS.REDIRECT]: redirect },
          });
          await sendEmailVerificationWithToast();
        }
      }
    );
  };

  return (
    <AuthFormLayout
      title="Rejestracja"
      header="Stwórz konto Ballerze"
      subheader={
        <>
          Masz już konto?{' '}
          <Link
            className="link --underline"
            href={{
              pathname: ROUTES.LOGIN,
              query: router.query,
            }}
          >
            Zaloguj się
          </Link>
        </>
      }
      onSubmit={handleSubmit(onSubmit)}
      inputChildren={
        <>
          <TextField
            label="Podaj swój adres email"
            type="email"
            errorText={getFieldErrorText('email', errors)}
            {...register('email', { required: true })}
          />
          <TextField
            label="Podaj swoje hasło"
            type="password"
            errorText={getFieldErrorText('password', errors)}
            {...register('password', { required: true })}
          />
          <TextField
            label="Powtórz swoje hasło"
            type="password"
            errorText={getFieldErrorText('repeatPassword', errors)}
            {...register('repeatPassword', {
              required: true,
              validate: (value) => {
                const { password } = getValues();
                return password === value || 'repeatPassword';
              },
            })}
          />
        </>
      }
      buttonValue="Zarejestruj się"
      buttonDisabled={loading}
      footerChildren={
        <>
          Rejestrując się akceptujesz nasz {/* TODO: Links */}
          <Link className="link --underline" href="/">
            Regulamin
          </Link>{' '}
          oraz{' '}
          <Link className="link --underline" href="/">
            Politykę prywatności
          </Link>
        </>
      }
      errorMessage={error?.message}
    />
  );
}
