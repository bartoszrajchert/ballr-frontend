import TextField from '@/components/TextField';
import AuthFormLayout from '@/layouts/AuthFormLayout';
import useGetAuth from '@/lib/useGetAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const auth = useGetAuth();
  const [signInWithEmailAndPassword, _, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onSubmit = (data: FormData) => {
    signInWithEmailAndPassword(data.email, data.password).then(async (res) => {
      if (res?.user) {
        await router.push('/');
        toast.info('Zalogowano pomyślnie');
      }
    });
  };

  return (
    <AuthFormLayout
      header="Zaloguj się Ballerze"
      subheader={
        <>
          Nie masz konta?{' '}
          <Link className="link --underline" href={'/register'}>
            Zarejestruj się
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
        </>
      }
      footerChildren={
        <>
          Problem z logowaniem?{' '}
          <Link className="link --underline" href="/recoverPassword">
            Przypomnij hasło
          </Link>{' '}
        </>
      }
      buttonValue="Zaloguj się"
      buttonDisabled={loading}
      errorMessage={error?.message}
    />
  );
}
