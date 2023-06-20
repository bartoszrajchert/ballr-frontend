import { ErrorData } from '@/lib/types';
import {
  GetFacilitiesResponse,
  GetFacilityResponse,
} from '@/models/facility.model';
import { AxiosError } from 'axios';
import { FieldErrors, UseFormReset, UseFormSetError } from 'react-hook-form';

export function getAddressFromFacility(
  facility?: GetFacilityResponse | GetFacilitiesResponse
) {
  return `${facility?.street} ${facility?.street_number}, ${facility?.postcode} ${facility?.city?.name}`;
}

export function formatDateTimeToInputFormat(unformulatedDate: string) {
  const date = new Date(unformulatedDate);
  const year = date.getFullYear().toString().padStart(4, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getLocaleDateString(date?: string, withoutTime?: boolean) {
  const inputDate = date ? new Date(date) : new Date();

  const year = inputDate.getFullYear();
  const month = ('0' + (inputDate.getMonth() + 1)).slice(-2);
  const day = ('0' + inputDate.getDate()).slice(-2);
  const hour = ('0' + inputDate.getHours()).slice(-2);
  const minute = ('0' + inputDate.getMinutes()).slice(-2);

  const time = withoutTime ? '' : ` ${hour}:${minute}`;

  return `${day}/${month}/${year} ${time}`;
}

export function concatenateDateAndTime(date: Date, time: string): string {
  return `${date.toISOString().split('T')[0]}T${time}:00.000Z`;
}

export function getFieldErrorText(name: string, errors: FieldErrors) {
  const error = errors[name];
  if (error?.type === 'required') {
    return 'Pole jest wymagane';
  }

  if (error?.type === 'maxLength') {
    return `Za długi tekst.`;
  }

  if (error?.type === 'validate') {
    if (error?.message === 'repeatPassword') {
      return 'Hasła muszą być takie same';
    }

    if (error?.message === 'fromTimeBeforeToTime') {
      return 'Czas rozpoczęcia musi być przed czasem zakończenia';
    }

    if (error?.message === 'fromDateBeforeToDate') {
      return 'Data rozpoczęcia musi być przed datą zakończenia';
    }
  }

  if (error?.type === 'max') {
    return 'Wartość jest za duża';
  }

  if (error?.type === 'min') {
    return 'Wartość jest za mała';
  }

  if (error?.message) {
    return String(error?.message);
  }

  return undefined;
}

/**
 * When using this function remember to use resetKeepValues on button click.
 * Otherwise, form will always be submitted.
 * @see resetKeepValues
 */
export function setUseReactFormErrors(
  err: AxiosError,
  setError: UseFormSetError<any>
) {
  console.error(err);

  const data = err.response?.data as ErrorData;
  if (Array.isArray(data?.detail))
    data.detail.map((error) => {
      setError(error.loc[1], { message: error.msg });
    });
  else if (data?.detail) {
    setError('root', { message: data.detail });
    return;
  }

  setError('root', { message: err?.message });
}

export function resetKeepValues(reset: UseFormReset<any>) {
  reset({}, { keepValues: true });
}

export function getErrorMessage(err: AxiosError): string {
  const data = err.response?.data as ErrorData;

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((error) => `${error.loc[1]} ${error.msg}`)
      .join('\n');
  }

  if (data?.detail) {
    return data.detail;
  }

  return err?.message;
}

export function getInitialsOrChars(input: string): string {
  if (input.includes(' ')) {
    return input
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('');
  }

  return input.substring(0, 5);
}

export function is404(err?: AxiosError): boolean {
  return err?.response?.status === 404;
}

export function pageTitle(title: string): string {
  return `${title} | Ballr.pl`;
}

export function validateTimeOrder(fromTime: string, toTime: string) {
  if (fromTime && toTime) {
    if (fromTime >= toTime) {
      return 'fromTimeBeforeToTime';
    }
  }
  return true;
}

export function validateDateOrder(fromDate: string, toDate: string) {
  if (fromDate && toDate) {
    if (new Date(fromDate) >= new Date(toDate)) {
      return 'fromDateBeforeToDate';
    }
  }
  return true;
}
