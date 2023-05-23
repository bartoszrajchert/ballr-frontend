import { getApp } from '@firebase/app';
import axios, { InternalAxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';

export default function initAxios() {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
  axios.interceptors.request.use(tokenInterceptor);
}

async function tokenInterceptor(config: InternalAxiosRequestConfig) {
  const auth = getAuth(getApp());
  const token = await auth.currentUser?.getIdToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
