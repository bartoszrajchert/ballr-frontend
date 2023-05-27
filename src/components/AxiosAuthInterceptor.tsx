import { QUERY_PARAMS, ROUTES } from '@/lib/routes';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const AxiosAuthInterceptor = ({ children }: { children: JSX.Element }) => {
  const router = useRouter();
  const [isSet, setIsSet] = useState(false);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        if (error.response.status === 401) {
          toast.error('Proszę zaloguj się aby kontynuować');
          const redirect = window.location.pathname;
          await router.push({
            pathname: ROUTES.LOGIN,
            query: {
              [QUERY_PARAMS.REDIRECT]: redirect,
              [QUERY_PARAMS.CANCEL_REDIRECT]: true,
            },
          });
        }
        return Promise.reject(error);
      }
    );

    setIsSet(true);
    return () => axios.interceptors.response.eject(interceptor);
  }, [router]);

  return isSet ? children : <></>;
};

export default AxiosAuthInterceptor;
