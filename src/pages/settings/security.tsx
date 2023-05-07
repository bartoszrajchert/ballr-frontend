import Button from '@/components/Button';
import Header from '@/components/Header';
import TextField from '@/components/TextField';
import MainLayout from '@/layouts/MainLayout';
import useGetAuth from '@/lib/useGetAuth';
import { withAuth } from '@/lib/withAuth';
import React, { useState } from 'react';
import { useUpdatePassword } from 'react-firebase-hooks/auth';

const Security = () => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const auth = useGetAuth();
  const [updatePassword, updating, error] = useUpdatePassword(auth);

  return (
    <MainLayout>
      <Header value="Bezpieczeństwo" />
      <form
        className="mx-auto mb-14 sm:max-w-[400px]"
        onSubmit={(event) => {
          event.preventDefault();
          if (password !== repeatPassword)
            return alert('Hasła nie są takie same');

          updatePassword(password).then(() => {
            alert('Hasło zostało zmienione');
          });
        }}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <TextField
              label="Podaj swoje hasło"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <TextField
              label="Powtórz swoje hasło"
              type="password"
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
            />
          </div>
          <Button value="Zapisz" isSubmit fullWidth />
        </div>
      </form>
    </MainLayout>
  );
};

export default withAuth(Security);
