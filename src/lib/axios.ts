import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAuth, getIdToken, onAuthStateChanged } from 'firebase/auth';

export default function initAxios() {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  axios.interceptors.request.use(tokenInterceptor, (error) =>
    Promise.reject(error)
  );
}

async function tokenInterceptor(config: InternalAxiosRequestConfig) {
  const token = await getUserToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

const getUserToken = async () => {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const token = await getIdToken(user);
        resolve(token);
      } else {
        resolve(null);
      }
      unsub();
    });
  });
};
