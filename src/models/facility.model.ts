import { Benefit, City } from '@/models/base.model';

export interface GetFacilitiesResponse {
  name: string;
  street: string;
  postcode: string;
  street_number: number;
  is_verified: boolean;
  open_time: string;
  close_time: string;
  city: City;
  id: number;
}

export interface GetFacilityResponse {
  name: string;
  street: string;
  postcode: string;
  street_number: number;
  is_verified: boolean;
  open_time?: string;
  close_time?: string;
  city?: City;
  id: 1;
  fields: {
    name: string;
    length: number;
    width: number;
    roof: boolean;
    id: number;
  }[];
  benefits: Benefit[];
}
