import { getApp } from '@firebase/app';
import { getAuth } from 'firebase/auth';

export default function useGetAuth() {
  return getAuth(getApp());
}
