export type GetReservationResponse = {
  start_time: string;
  end_time: string;
  is_paid: boolean;
  is_approved: boolean;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    notification_preference: boolean;
    gender: {
      type: string;
      id: number;
    };
    city: {
      name: string;
      id: number;
    };
  };
  field: {
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
      city: {
        name: string;
        id: number;
      };
      id: number;
    };
    id: number;
  };
  id: number;
};
