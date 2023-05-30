import { ErrorData } from '@/lib/types';
import { AxiosError } from 'axios';
import { FieldErrors, FieldValues, UseFormSetError } from 'react-hook-form';

export function getAddressFromFacility(facility?: Facility) {
  return `${facility?.street} ${facility?.street_number}, ${facility?.postcode} ${facility?.city?.name}`;
}

export function getLocaleDateString(date?: string) {
  const inputDate = date ? new Date(date) : new Date();

  const year = inputDate.getFullYear();
  const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
  const day = ('0' + inputDate.getDate()).slice(-2);
  const hour = ('0' + inputDate.getHours()).slice(-2);
  const minute = ('0' + inputDate.getMinutes()).slice(-2);

  return `${day}/${month}/${year} • ${hour}:${minute}`;
}

export function concatenateDateAndTime(date: Date, time: string): string {
  return `${date.toISOString().split('T')[0]}T${time}:00.000Z`;
}

export function getFieldErrorText(name: string, errors: FieldErrors) {
  const error = errors[name];
  if (error?.type === 'required') {
    return 'Pole jest wymagane';
  }

  if (error?.type === 'validate') {
    if (error?.message === 'repeatPassword') {
      return 'Hasła muszą być takie same';
    }
  }

  if (error?.message) {
    return String(error?.message);
  }

  return undefined;
}

export function setUseReactFormErrors(
  err: AxiosError,
  setError: UseFormSetError<FieldValues>
) {
  const data = err.response?.data as ErrorData;
  if (Array.isArray(data.detail))
    data.detail.map((error) => {
      setError(error.loc[1], { message: error.msg });
    });
  else if (data.detail) {
    setError('root', { message: data.detail });
    return;
  }

  setError('root', { message: err.message });
}

export function getErrorMessage(err: AxiosError): string {
  const data = err.response?.data as ErrorData;

  if (Array.isArray(data.detail)) {
    return data.detail
      .map((error) => `${error.loc[1]} ${error.msg}`)
      .join('\n');
  }

  if (data.detail) {
    return data.detail;
  }

  return err.message;
}
