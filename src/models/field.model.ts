import { City } from '@/models/base.model';

export type GetFieldResponse = {
  name: string;
  length: number;
  width: number;
  roof: boolean;
  facility: {
    name: string;
    street: string;
    postcode: string;
    street_number: number;
    is_verified: boolean;
    open_time: string;
    close_time: string;
    city: City;
    id: number;
  };
  id: number;
  taken_hours: string[];
};
