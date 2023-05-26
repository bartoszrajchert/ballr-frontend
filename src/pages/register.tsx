import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import { QUERY_PARAMS, ROUTES } from '@/lib/routes';
import useGetAuth from '@/lib/useGetAuth';
import useSendEmailVerificationWithToast from '@/lib/useSendEmailVerificationWithToast';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

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
          const redirect = (router.query.redirect as string) ?? ROUTES.HOME;
          await router.push(redirect);
          toast.info('Konto zostało utworzone');
          await sendEmailVerificationWithToast();
        }
      }
    );
  };

  return (
    <AuthFormLayout
      header="Stwórz konto Ballerze"
      subheader={
        <>
          Masz już konto?{' '}
          <Link
            className="link --underline"
            href={{
              pathname: ROUTES.LOGIN,
              query: {
                [QUERY_PARAMS.REDIRECT]: router.query[QUERY_PARAMS.REDIRECT],
              },
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
            errorText={errors.email && 'Email jest wymagany'}
            {...register('email', { required: true })}
          />
          <TextField
            label="Podaj swoje hasło"
            type="password"
            errorText={errors.password && 'Hasło jest wymagane'}
            {...register('password', { required: true })}
          />
          <TextField
            label="Powtórz swoje hasło"
            type="password"
            errorText={errors.repeatPassword && 'Hasła muszą być takie same'}
            {...register('repeatPassword', {
              required: true,
              validate: (value) => {
                const { password } = getValues();
                return password === value || 'Passwords should match!';
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
