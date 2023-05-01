import { getAuth } from 'firebase/auth';
import app from '@/lib/firebase';

export default function useGetAuth() {
  return getAuth(app);
}
