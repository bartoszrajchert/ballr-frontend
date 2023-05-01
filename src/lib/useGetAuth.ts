import app from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

export default function useGetAuth() {
  return getAuth(app);
}
